import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const imageDir = path.join(projectRoot, 'public', 'images', 'blog');
const widths = [480, 768, 1200];
const formats = ['avif', 'webp'];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const entries = await fs.readdir(imageDir, { withFileTypes: true });
  const pngNames = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const issues = [];

  for (const pngName of pngNames) {
    const baseName = pngName.replace(/\.png$/i, '');

    for (const width of widths) {
      for (const format of formats) {
        const variant = `${baseName}-${width}.${format}`;
        const variantPath = path.join(imageDir, variant);
        const ok = await exists(variantPath);
        if (!ok) {
          issues.push(variant);
        }
      }
    }

    const ogVariant = `${baseName}-og.jpg`;
    const ogOk = await exists(path.join(imageDir, ogVariant));
    if (!ogOk) {
      issues.push(ogVariant);
    }
  }

  if (issues.length) {
    console.error(`[verify:images] Missing variants: ${issues.length}`);
    issues.slice(0, 50).forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }

  console.log(`[verify:images] OK: ${pngNames.length} PNG sources have AVIF/WebP variants for ${widths.join(', ')} and OG JPG`);
}

main().catch((error) => {
  console.error('[verify:images] Failed:', error.message);
  process.exit(1);
});
