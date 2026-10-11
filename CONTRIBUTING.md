# Contributing

Use a branch for a focused change and describe its user-visible effect in the pull request.

## Before submitting

```sh
npm ci
npm run check
npm run check:features
npm run build
```

For interface changes, inspect desktop and mobile sizes and include a screenshot. For content changes, check provider URLs and retain honest language about costs and certification requirements.

Keep IDs, storage keys and backup formats stable. Use fixtures for tests involving failures, import or deletion. Preserve pending changes when saves fail. Never include credentials or personal account data in a commit, screenshot or issue.

Generated catalogue and diagram files should be updated together with their source generators. See [architecture](docs/architecture.md) and [testing](docs/testing.md).
