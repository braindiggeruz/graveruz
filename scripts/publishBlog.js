const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function runStep(label, scriptName, envOverrides = {}) {
  console.log(`\n[publish:blog] ${label}...`);
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptName)], {
    cwd: ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...envOverrides
    }
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function resolveDryRunMode() {
  if (process.argv.includes('--dry-run')) return true;
  const envValue = String(process.env.PUBLISH_BLOG_DRY_RUN || '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(envValue);
}

function main() {
  const startedAt = Date.now();
  const isDryRun = resolveDryRunMode();
  const updateEnv = isDryRun
    ? { AUTO_SUBMIT_INDEXING_ON_PUBLISH: '0' }
    : {
      AUTO_SUBMIT_INDEXING_LIMIT: process.env.AUTO_SUBMIT_INDEXING_LIMIT || '10000'
    };

  if (isDryRun) {
    console.log('[publish:blog] DRY-RUN mode enabled: indexing submit is disabled for this run');
  }

  runStep('Parse markdown from /blog/src/content', 'parseArticles.js');
  runStep('Validate generated structure', 'validateBlogPosts.js');
  runStep(
    isDryRun
      ? 'Update frontend blogPosts.js (without indexing submit)'
      : 'Update frontend blogPosts.js + auto-submit indexing',
    'updateBlogPosts.js',
    updateEnv
  );

  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\n[publish:blog] ✅ DONE in ${durationSec}s`);
  console.log(
    isDryRun
      ? '[publish:blog] Parse + Validate + Update completed (dry-run, no external submit)'
      : '[publish:blog] Parse + Validate + Update + Auto-submit completed'
  );
}

try {
  main();
} catch (error) {
  console.error(`\n[publish:blog] ❌ ${error.message}`);
  process.exit(1);
}
