# Domain

Pure TypeScript contracts and operations for learning plans, content resolution, validation, progress and activity. This layer does not depend on React, browser storage or Supabase.

Use `contracts.ts` as the data boundary. Mutations return results without writing persistence; the workspace controller decides when to commit them. Keep existing identifiers and backup-compatible structures stable.

See [architecture](../../docs/architecture.md) and [testing](../../docs/testing.md).
