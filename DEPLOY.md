# Deploy

This repo uses a CRA + CRACO frontend with react-snap prerendering. Follow the steps below for a deterministic build and deployment.

## Deterministic Build Inputs

Set one of the following environment variables before building:

- BUILD_ID: preferred build stamp (e.g., git SHA or release tag)
- SOURCE_DATE_EPOCH: Unix epoch seconds used to derive an ISO timestamp

If neither is set, the build stamp falls back to the current time.

## Frontend Build

1. Open a clean working tree and ensure dependencies are locked.
2. Install dependencies:
   - From frontend/: npm ci
3. Set required environment variables:
   - REACT_APP_BASE_URL=https://www.graver-studio.uz
   - BUILD_ID=your-release-id (or SOURCE_DATE_EPOCH=1700000000)
4. Build:
   - From frontend/: npm run build

Output: frontend/build

## Deploy (Emergent.sh)

- Deploy only from the main branch.
- Do not deploy from workspace branches or conflict_* branches.

### Source Of Truth

Before any Redeploy, verify Emergent is deploying GitHub main, not a workspace snapshot.

1. Open the GitHub integration panel for the project.
2. Confirm the connected branch is main.
3. Confirm the latest GitHub commit SHA matches main on GitHub.
4. Use "Save to GitHub" to sync any workspace changes back to main.
5. If the workspace SHA does not match main, re-sync or re-import main before deploy.

### Steps

1. Merge the PR into main.
2. In Emergent.sh, verify the deployment source is main.
3. Use "Save to GitHub" to push the exact main commit before deploying.
4. Deploy main and confirm the live commit matches the main SHA.

If the live commit or branch does not match main, stop and redeploy from main.

## Post-Deploy Verification

- Confirm build stamp exists:
  - frontend/build/build.txt
  - <meta name="build-id" ...> in built HTML
- Spot-check canonical and hreflang tags on RU and UZ pages.
- Verify no stale content is served in an incognito browser.

## Service Worker Kill Switch

If a client has a stale service worker, open any page with:

- ?sw-kill=1

This will unregister existing service workers and clear caches on that host.
