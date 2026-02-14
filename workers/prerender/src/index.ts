import { launch } from '@cloudflare/playwright';
import { isBotUserAgent } from './bots';

type Provider = 'cloudflare' | 'prerenderio';

type Env = {
  BROWSER: Fetcher;
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

function isBlogPath(pathname: string): boolean {
  return BLOG_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isGetRequest(request: Request): boolean {
  return request.method.toUpperCase() === 'GET';
}

function isHeadRequest(request: Request): boolean {
  return request.method.toUpperCase() === 'HEAD';
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

  for (const candidate of candidates) {
    try {
      return await renderWithCloudflareBrowser(candidate, env, timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('prerender failed');
}

async function fetchOrigin(request: Request, withErrorFlag = false): Promise<Response> {
  const originResponse = await fetch(request);
  if (!withErrorFlag) {
    return originResponse;
  }
  const headers = copyHeadersWith(originResponse.headers, {
    'x-prerender-error': '1',
  });
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

    if (!allowBotRateLimit(request, env)) {
      return fetchOrigin(request, true);
    }

    const publicUrl = normalizePublicUrl(incomingUrl);
    const cache = (caches as unknown as { default: Cache }).default;
    const cacheKey = makeCacheKey(publicUrl);

    const cached = await cache.match(cacheKey);
    if (cached) {
      return withPrerenderHeaders(cached, 'HIT');
    }

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
    } catch {
      return fetchOrigin(request, true);
    }
  },
};