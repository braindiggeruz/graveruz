import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const imageDir = path.join(projectRoot, 'public', 'images', 'blog');

async function getFiles() {
  const entries = await fs.readdir(imageDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

async function getSizeBytes(filePath) {
  const stat = await fs.stat(filePath);
  return stat.size;
}

function toMb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

async function sumByPattern(fileNames, regex) {
  const selected = fileNames.filter((name) => regex.test(name));
  const sizes = await Promise.all(selected.map((name) => getSizeBytes(path.join(imageDir, name))));
  return {
    count: selected.length,
    total: sizes.reduce((sum, size) => sum + size, 0),
  };
}

async function main() {
  const fileNames = await getFiles();

  const png = await sumByPattern(fileNames, /\.png$/i);
  const avif = await sumByPattern(fileNames, /\.(avif)$/i);
  const webp = await sumByPattern(fileNames, /\.(webp)$/i);
  const ogJpg = await sumByPattern(fileNames, /-og\.jpg$/i);

  console.log('[images:audit] Blog image storage footprint');
  console.log(`- PNG:  ${png.count} files / ${toMb(png.total)} MB`);
  console.log(`- AVIF: ${avif.count} files / ${toMb(avif.total)} MB`);
  console.log(`- WebP: ${webp.count} files / ${toMb(webp.total)} MB`);
  console.log(`- OG JPG: ${ogJpg.count} files / ${toMb(ogJpg.total)} MB`);

  if (png.total > 0 && (avif.total + webp.total) > 0) {
    const ratio = ((avif.total + webp.total) / png.total) * 100;
    console.log(`- Variant to PNG total ratio: ${ratio.toFixed(1)}%`);
  }
}

main().catch((error) => {
  console.error('[images:audit] Failed:', error.message);
  process.exit(1);
});
