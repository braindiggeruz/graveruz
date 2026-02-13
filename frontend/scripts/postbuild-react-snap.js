const { execSync } = require('child_process');

const shouldSkip = String(process.env.SKIP_REACT_SNAP || '').toLowerCase();
if (shouldSkip === '1' || shouldSkip === 'true') {
  console.log('[postbuild] SKIP_REACT_SNAP=1, skipping react-snap.');
  process.exit(0);
}

execSync('react-snap', { stdio: 'inherit' });
