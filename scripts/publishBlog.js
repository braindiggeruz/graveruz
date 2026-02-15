const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function runStep(label, scriptName) {
  console.log(`\n[publish:blog] ${label}...`);
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptName)], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function main() {
  const startedAt = Date.now();

  runStep('Parse markdown from /blog/src/content', 'parseArticles.js');
  runStep('Validate generated structure', 'validateBlogPosts.js');
  runStep('Update frontend blogPosts.js + auto-submit indexing', 'updateBlogPosts.js');

  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\n[publish:blog] ✅ DONE in ${durationSec}s`);
  console.log('[publish:blog] Parse + Validate + Update + Auto-submit completed');
}

try {
  main();
} catch (error) {
  console.error(`\n[publish:blog] ❌ ${error.message}`);
  process.exit(1);
}
