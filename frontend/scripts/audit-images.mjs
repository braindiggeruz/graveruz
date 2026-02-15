import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const inputDir = path.join(root, 'public', 'images', 'blog');
const outputDir = path.join(root, 'public', 'images', 'blog-webp');
const reportPath = path.join(root, 'public', 'images', 'image-audit-report.json');

const exts = new Set(['.png', '.jpg', '.jpeg', '.webp']);

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

function kb(bytes) {
  return Number((bytes / 1024).toFixed(2));
}

async function run() {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input dir not found: ${inputDir}`);
  }

  const allFiles = walk(inputDir).filter((f) => exts.has(path.extname(f).toLowerCase()));

  const report = [];
  for (const file of allFiles) {
    const stat = fs.statSync(file);
    const meta = await sharp(file).metadata();

    const rel = path.relative(inputDir, file).replace(/\\/g, '/');
    const parsed = path.parse(rel);
    const baseNoExt = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name;

    const sizes = ['small', 'medium', 'large'];
    const variants = {};
    for (const size of sizes) {
      const candidate = path.join(outputDir, `${baseNoExt}-${size}.webp`);
      if (fs.existsSync(candidate)) {
        const cstat = fs.statSync(candidate);
        variants[size] = { exists: true, sizeKB: kb(cstat.size) };
      } else {
        variants[size] = { exists: false };
      }
    }

    report.push({
      file: rel,
      format: (meta.format || path.extname(file).slice(1)).toLowerCase(),
      width: meta.width || null,
      height: meta.height || null,
      sizeKB: kb(stat.size),
      webpVariants: variants,
    });
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  const totalOriginal = report.reduce((sum, item) => sum + item.sizeKB, 0);
  const totalWebp = report.reduce((sum, item) => {
    return sum + ['small', 'medium', 'large'].reduce((s, size) => s + (item.webpVariants[size].sizeKB || 0), 0);
  }, 0);

  console.log(`audited=${report.length}`);
  console.log(`originalTotalKB=${totalOriginal.toFixed(2)}`);
  console.log(`webpVariantsTotalKB=${totalWebp.toFixed(2)}`);
  console.log(`report=${path.relative(root, reportPath).replace(/\\/g, '/')}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
