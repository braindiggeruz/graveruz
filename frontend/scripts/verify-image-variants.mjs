import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.cwd());
const dataPath = path.join(root, 'src', 'data', 'blogPosts.js');
const webpDir = path.join(root, 'public', 'images', 'blog-webp');

function toVariantBase(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const normalized = imagePath.replace(/^\/+/, '');
  if (!normalized.startsWith('images/blog/')) return null;
  const fileName = normalized.slice('images/blog/'.length);
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) return null;
  return fileName.slice(0, dotIndex);
}

async function run() {
  if (!fs.existsSync(dataPath)) {
    throw new Error(`blogPosts data not found: ${dataPath}`);
  }

  if (!fs.existsSync(webpDir)) {
    throw new Error(`WebP directory not found: ${webpDir}`);
  }

  const mod = await import(pathToFileURL(dataPath).href + `?v=${Date.now()}`);
  const allPosts = [...(mod.blogPosts?.ru || []), ...(mod.blogPosts?.uz || [])];

  const missing = [];
  let checked = 0;

  for (const post of allPosts) {
    const base = toVariantBase(post.image);
    if (!base) {
      missing.push({ slug: post.slug, reason: 'invalid image path', image: post.image || null });
      continue;
    }

    checked += 1;
    for (const size of ['small', 'medium', 'large']) {
      const expected = path.join(webpDir, `${base}-${size}.webp`);
      if (!fs.existsSync(expected)) {
        missing.push({ slug: post.slug, reason: 'missing variant', variant: `${base}-${size}.webp` });
      }
    }
  }

  console.log(`postsChecked=${checked}`);
  console.log(`missingVariants=${missing.length}`);

  if (missing.length > 0) {
    const preview = missing.slice(0, 20);
    console.error('Image variant verification failed. Sample:');
    console.error(JSON.stringify(preview, null, 2));
    process.exit(1);
  }

  console.log('PASS - all blog images have small/medium/large WebP variants');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
