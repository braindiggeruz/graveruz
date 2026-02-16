import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const sourceDir = path.join(projectRoot, 'public', 'images', 'blog');
const targetWidths = [480, 768, 1200];
const pngExt = '.png';

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function getVariantPath(baseFilePath, width, ext) {
  const parsed = path.parse(baseFilePath);
  return path.join(parsed.dir, `${parsed.name}-${width}.${ext}`);
}

async function fileSize(filePath) {
  const stat = await fs.stat(filePath);
  return stat.size;
}

function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeOne(pngPath) {
  const metadata = await sharp(pngPath).metadata();
  const sourceWidth = metadata.width || 1200;
  const widths = targetWidths.filter((width) => width <= sourceWidth);
  const finalWidths = widths.length ? widths : [Math.min(sourceWidth, 1200)];

  let generatedCount = 0;

  for (const width of finalWidths) {
    const resized = sharp(pngPath).resize({
      width,
      fit: 'cover',
      withoutEnlargement: true,
    });

    const avifPath = getVariantPath(pngPath, width, 'avif');
    const webpPath = getVariantPath(pngPath, width, 'webp');

    await resized
      .clone()
      .avif({ quality: 45, effort: 6, chromaSubsampling: '4:2:0' })
      .toFile(avifPath);

    await resized
      .clone()
      .webp({ quality: 72, effort: 6 })
      .toFile(webpPath);

    generatedCount += 2;
  }

  return generatedCount;
}

async function main() {
  await ensureDir(sourceDir);
  const allEntries = await fs.readdir(sourceDir, { withFileTypes: true });
  const pngFiles = allEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(pngExt))
    .map((entry) => path.join(sourceDir, entry.name))
    .sort((a, b) => a.localeCompare(b));

  if (!pngFiles.length) {
    console.log('[images:optimize] No PNG files found in blog images folder.');
    return;
  }

  const sourceBytes = (await Promise.all(pngFiles.map(fileSize))).reduce((sum, size) => sum + size, 0);

  let generatedTotal = 0;
  for (const pngPath of pngFiles) {
    generatedTotal += await optimizeOne(pngPath);
  }

  const generatedFiles = await fs.readdir(sourceDir, { withFileTypes: true });
  const optimizedTargets = generatedFiles
    .filter((entry) => entry.isFile() && /-(480|768|1200)\.(avif|webp)$/i.test(entry.name))
    .map((entry) => path.join(sourceDir, entry.name));

  const optimizedBytes = (await Promise.all(optimizedTargets.map(fileSize))).reduce((sum, size) => sum + size, 0);

  console.log(`[images:optimize] Processed PNG files: ${pngFiles.length}`);
  console.log(`[images:optimize] Generated variants: ${generatedTotal}`);
  console.log(`[images:optimize] Source PNG total: ${formatMb(sourceBytes)}`);
  console.log(`[images:optimize] Variant AVIF/WebP total: ${formatMb(optimizedBytes)}`);
}

main().catch((error) => {
  console.error('[images:optimize] Failed:', error.message);
  process.exit(1);
});
