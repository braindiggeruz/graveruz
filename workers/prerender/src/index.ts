import { launch } from '@cloudflare/playwright';
import { isBotUserAgent } from './bots';

type Provider = 'cloudflare' | 'prerenderio';

type Env = {
  BROWSER: Fetcher;
  PRERENDER_ENABLED?: string;
  PRERENDER_PROVIDER?: Provider;
  PRERENDER_TOKEN?: string;
  RENDER_ORIGIN_PRIMARY?: string;
  RENDER_ORIGIN_FALLBACK?: string;
  CACHE_TTL_SECONDS?: string;
  RENDER_TIMEOUT_MS?: string;
  BOT_RATE_LIMIT_PER_MIN?: string;
};

const BLOG_PREFIXES = ['/ru/blog', '/uz/blog'];
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; windowStart: number }>();
const inflightRenders = new Map<string, Promise<Response>>();

function isBlogPath(pathname: string): boolean {
  return BLOG_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isGetRequest(request: Request): boolean {
  return request.method.toUpperCase() === 'GET';
}

function isHeadRequest(request: Request): boolean {
  return request.method.toUpperCase() === 'HEAD';
}

function isPrerenderEnabled(env: Env): boolean {
  return (env.PRERENDER_ENABLED || '1') !== '0';
}

function acceptsHtml(request: Request): boolean {
  const accept = request.headers.get('accept');
  if (!accept) return false;
  return accept.toLowerCase().includes('text/html');
}

function hasSensitiveHeaders(request: Request): boolean {
  return Boolean(request.headers.get('cookie') || request.headers.get('authorization'));
}

function toInt(input: string | undefined, fallback: number): number {
  const value = Number.parseInt(input || '', 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function normalizePublicUrl(input: URL): URL {
  const normalized = new URL(input.toString());
  normalized.hash = '';
  normalized.search = '';
  if (normalized.hostname === 'www.graver-studio.uz') {
    normalized.hostname = 'graver-studio.uz';
  }
  return normalized;
}

function makeCacheKey(publicUrl: URL): Request {
  const cacheUrl = new URL(publicUrl.toString());
  cacheUrl.searchParams.set('__bot', '1');
  return new Request(cacheUrl.toString(), { method: 'GET' });
}

function makeBreakerKey(publicUrl: URL): Request {
  const breakerUrl = new URL(publicUrl.toString());
  breakerUrl.pathname = '/__prerender_breaker__';
  breakerUrl.search = '';
  breakerUrl.hash = '';
  return new Request(breakerUrl.toString(), { method: 'GET' });
}

function buildRenderCandidates(publicUrl: URL, env: Env): URL[] {
  const primaryBase = (env.RENDER_ORIGIN_PRIMARY || 'https://graveruz.pages.dev').replace(/\/+$/, '');
  const fallbackBase = (env.RENDER_ORIGIN_FALLBACK || 'https://www.graver-studio.uz').replace(/\/+$/, '');

  const primaryUrl = new URL(`${primaryBase}${publicUrl.pathname}`);
  const fallbackUrl = new URL(`${fallbackBase}${publicUrl.pathname}`);

  return [primaryUrl, fallbackUrl].filter((candidate, index, all) => {
    const sameAsIntercepted = candidate.hostname === publicUrl.hostname && candidate.pathname === publicUrl.pathname;
    if (sameAsIntercepted) return false;
    const key = `${candidate.protocol}//${candidate.hostname}${candidate.pathname}`;
    return all.findIndex((item) => `${item.protocol}//${item.hostname}${item.pathname}` === key) === index;
  });
}

function copyHeadersWith(
  baseHeaders: Headers,
  extras: Record<string, string>,
): Headers {
  const headers = new Headers(baseHeaders);
  for (const [key, value] of Object.entries(extras)) {
    headers.set(key, value);
  }
  return headers;
}

function getBotRateKey(request: Request): string {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const ua = (request.headers.get('user-agent') || 'unknown').toLowerCase();
  return `${ip}|${ua}`;
}

function allowBotRateLimit(request: Request, env: Env): boolean {
  const limit = toInt(env.BOT_RATE_LIMIT_PER_MIN, 30);
  const now = Date.now();
  const key = getBotRateKey(request);
  const existing = rateBuckets.get(key);

  if (!existing || now - existing.windowStart >= RATE_WINDOW_MS) {
    rateBuckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  rateBuckets.set(key, existing);
  return true;
}

async function renderWithCloudflareBrowser(renderUrl: URL, env: Env, timeoutMs: number): Promise<string> {
  const browser = await launch(env.BROWSER);
  try {
    const page = await browser.newPage();

    await page.route('**/*', async (route) => {
      const type = route.request().resourceType();
      if (type === 'image' || type === 'font' || type === 'media') {
        await route.abort();
        return;
      }
      await route.continue();
    });

    await page.goto(renderUrl.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: timeoutMs,
    });

    await Promise.race([
      page.waitForSelector('link[rel="canonical"]', { timeout: Math.max(1000, Math.floor(timeoutMs / 2)) }),
      page.waitForLoadState('networkidle', { timeout: Math.max(1000, Math.floor(timeoutMs / 2)) }),
    ]).catch(() => undefined);

    return page.content();
  } finally {
    await browser.close();
  }
}

async function renderWithPrerenderIo(publicUrl: URL, env: Env, timeoutMs: number): Promise<string> {
  const token = env.PRERENDER_TOKEN;
  if (!token) {
    throw new Error('PRERENDER_TOKEN is required for prerenderio provider');
  }

  const endpoint = `https://service.prerender.io/${publicUrl.toString()}`;
  const response = await fetch(endpoint, {
    headers: {
      'X-Prerender-Token': token,
      'User-Agent': 'Mozilla/5.0 (compatible; prerender-worker/1.0)',
    },
    cf: {
      cacheTtl: 0,
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error('prerenderio upstream failed');
  }

  return response.text();
}

async function tryRenderHtml(publicUrl: URL, env: Env): Promise<string> {
  const timeoutMs = toInt(env.RENDER_TIMEOUT_MS, 12_000);
  const provider = (env.PRERENDER_PROVIDER || 'cloudflare') as Provider;

  if (provider === 'prerenderio') {
    return renderWithPrerenderIo(publicUrl, env, timeoutMs);
  }

  const candidates = buildRenderCandidates(publicUrl, env);
  let lastError: unknown;
  let lastCandidate: string | undefined;

  for (const candidate of candidates) {
    try {
      return await renderWithCloudflareBrowser(candidate, env, timeoutMs);
    } catch (error) {
      lastError = error;
      lastCandidate = candidate.toString();
    }
  }

  const wrapped = lastError instanceof Error ? lastError : new Error('prerender failed');
  (wrapped as Error & { candidate?: string }).candidate = lastCandidate;
  throw wrapped;
}

function classifyPrerenderReason(error: unknown): 'rate_limit' | 'timeout' | 'binding' | 'nav' | 'content' | 'unknown' {
  const message = error instanceof Error ? error.message : String(error);
  const text = (message || '').toLowerCase();
  if (text.includes('429') || text.includes('rate limit')) return 'rate_limit';
  if (text.includes('timeout')) return 'timeout';
  if (text.includes('binding') || text.includes('browser')) return 'binding';
  if (text.includes('navigation') || text.includes('nav')) return 'nav';
  if (text.includes('content')) return 'content';
  return 'unknown';
}

async function fetchOrigin(
  request: Request,
  withErrorFlag = false,
  reasonCode?: 'rate_limit' | 'timeout' | 'binding' | 'nav' | 'content' | 'unknown',
): Promise<Response> {
  const originResponse = await fetch(request);
  if (!withErrorFlag) {
    return originResponse;
  }
  const extraHeaders: Record<string, string> = {
    'x-prerender-error': '1',
  };
  if (reasonCode) {
    extraHeaders['x-prerender-error-reason'] = reasonCode;
    if (reasonCode === 'rate_limit') {
      extraHeaders['retry-after'] = '60';
    }
  }
  const headers = copyHeadersWith(originResponse.headers, extraHeaders);
  return new Response(originResponse.body, {
    status: originResponse.status,
    statusText: originResponse.statusText,
    headers,
  });
}

function withPrerenderHeaders(response: Response, cacheState: 'HIT' | 'MISS'): Response {
  const headers = copyHeadersWith(response.headers, {
    'content-type': 'text/html; charset=utf-8',
    'x-prerender': '1',
    'x-prerender-cache': cacheState,
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function shouldCachePrerenderResponse(response: Response): boolean {
  if (response.status >= 400) return false;
  if (response.headers.has('set-cookie')) return false;
  return true;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const incomingUrl = new URL(request.url);

    if (!isPrerenderEnabled(env)) {
      return fetchOrigin(request);
    }

    if (isHeadRequest(request)) {
      return fetchOrigin(request);
    }

    if (!isGetRequest(request) || !isBlogPath(incomingUrl.pathname)) {
      return fetchOrigin(request);
    }

    const ua = request.headers.get('user-agent');
    if (!isBotUserAgent(ua)) {
      return fetchOrigin(request);
    }

    if (!acceptsHtml(request) || hasSensitiveHeaders(request)) {
      return fetchOrigin(request);
    }

    if (!allowBotRateLimit(request, env)) {
      return fetchOrigin(request, true);
    }

    const publicUrl = normalizePublicUrl(incomingUrl);
    const cache = (caches as unknown as { default: Cache }).default;
    const cacheKey = makeCacheKey(publicUrl);
    const breakerKey = makeBreakerKey(publicUrl);
    const inflightKey = cacheKey.url;

    const breakerActive = await cache.match(breakerKey);
    if (breakerActive) {
      return fetchOrigin(request, true, 'rate_limit');
    }

    const cached = await cache.match(cacheKey);
    if (cached) {
      return withPrerenderHeaders(cached, 'HIT');
    }

    const existingInflight = inflightRenders.get(inflightKey);
    if (existingInflight) {
      const inflightResponse = await existingInflight;
      return inflightResponse.clone();
    }

    const renderPromise = (async (): Promise<Response> => {
      try {
        const html = await tryRenderHtml(publicUrl, env);
        const ttl = toInt(env.CACHE_TTL_SECONDS, 3600);

        const prerendered = new Response(html, {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': `public, max-age=0, s-maxage=${ttl}`,
            'x-prerender': '1',
            'x-prerender-cache': 'MISS',
          },
        });

        if (shouldCachePrerenderResponse(prerendered)) {
          ctx.waitUntil(cache.put(cacheKey, prerendered.clone()));
        }
        return prerendered;
      } catch (error) {
        const reasonCode = classifyPrerenderReason(error);
        const errorObj = error as Error & { candidate?: string };
        const candidate = errorObj?.candidate;
        console.error('prerender_failed', {
          url: request.url,
          candidate,
          err: errorObj?.message ?? String(error),
          stack: errorObj?.stack,
        });

        if (reasonCode === 'rate_limit') {
          const breakerResponse = new Response('1', {
            headers: {
              'cache-control': 'max-age=600',
            },
          });
          ctx.waitUntil(cache.put(breakerKey, breakerResponse));

          const fallbackCached = await cache.match(cacheKey);
          if (fallbackCached) {
            return withPrerenderHeaders(fallbackCached, 'HIT');
          }
        }

        return fetchOrigin(request, true, reasonCode);
      }
    })();

    inflightRenders.set(inflightKey, renderPromise);
    try {
      const response = await renderPromise;
      return response.clone();
    } finally {
      inflightRenders.delete(inflightKey);
    }
  },
};