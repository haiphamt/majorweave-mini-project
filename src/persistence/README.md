# Persistence

Features interact with persistence through the shared workspace controller. Data contracts live in `src/domain/contracts.ts`.

| Module | Purpose |
| --- | --- |
| `roadmap-store.ts` | Native IndexedDB workspace transactions and revision checks |
| `cloud-workspace.ts` | Supabase workspace read/save gateway |
| `guest-backup.ts` | Explicit Guest-to-account import |
| `backup.ts` | Validated export, preview and import with duplicate handling |
| `migration-source.ts` | Read and fingerprint the unchanged legacy source |
| `migration-preview.ts`, `migration.ts` | Preview and confirm a migration without deleting the source |
| `legacy.ts` | Compatibility with the original persisted format |

A mutation succeeds only after a transaction/cloud acknowledgement. Failures preserve the candidate for retry/export/discard; stale revisions are rejected. Guest and account workspaces remain separate.

See [architecture](../../docs/architecture.md), [deployment](../../docs/deployment.md) and [testing](../../docs/testing.md).
