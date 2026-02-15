import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const inputDir = path.join(root, 'public', 'images', 'blog');
const outputDir = path.join(root, 'public', 'images', 'blog-webp');

const quality = Number(process.env.WEBP_QUALITY || 80);
const sizes = [
  { key: 'small', width: 640 },
  { key: 'medium', width: 1280 },
  { key: 'large', width: 1920 },
];
const exts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

async function convertOne(filePath) {
  const rel = path.relative(inputDir, filePath).replace(/\\/g, '/');
  const parsed = path.parse(rel);
  const baseNoExt = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name;

  const image = sharp(filePath, { failOn: 'none' });
  const meta = await image.metadata();
  const sourceWidth = meta.width || 0;

  let created = 0;
  for (const target of sizes) {
    const outRel = `${baseNoExt}-${target.key}.webp`;
    const outPath = path.join(outputDir, outRel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const resizeWidth = sourceWidth > 0 ? Math.min(sourceWidth, target.width) : target.width;
    await sharp(filePath, { failOn: 'none' })
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outPath);

    created += 1;
  }

  return { rel, created };
}

async function run() {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input dir not found: ${inputDir}`);
  }

  const allFiles = walk(inputDir).filter((f) => exts.has(path.extname(f).toLowerCase()));
  let createdTotal = 0;

  for (const file of allFiles) {
    const result = await convertOne(file);
    createdTotal += result.created;
  }

  console.log(`imagesProcessed=${allFiles.length}`);
  console.log(`webpGenerated=${createdTotal}`);
  console.log(`quality=${quality}`);
  console.log(`outputDir=${path.relative(root, outputDir).replace(/\\/g, '/')}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
