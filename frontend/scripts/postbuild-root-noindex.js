const fs = require("fs");
const path = require("path");

const buildIndexPath = path.join(__dirname, "..", "build", "index.html");

if (!fs.existsSync(buildIndexPath)) {
  console.log("[postbuild] build/index.html not found, skipping.");
  process.exit(0);
}

const html = fs.readFileSync(buildIndexPath, "utf8");
const updated = html
  .replace(/name="robots"\s+content="index, follow"/g, 'name="robots" content="noindex, follow"')
  .replace(/content="index, follow"\s+name="robots"/g, 'content="noindex, follow" name="robots"');

if (updated === html) {
  console.log("[postbuild] build/index.html already noindex.");
  process.exit(0);
}

fs.writeFileSync(buildIndexPath, updated, "utf8");
console.log("[postbuild] Set noindex on build/index.html.");
