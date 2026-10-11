# Testing

## Automated gates

| Command | Coverage |
| --- | --- |
| `npm run check` | Catalogue structure, content invariants, workspace callbacks, integration, account isolation, revision handling and SQL/RLS fixtures |
| `npm run check:features` | Resolver/content, roadmap, plan operations, profile/activity validation, backup and legacy migration |
| `npm run build` | Documentation generation, TypeScript and production bundling |

Checks use existing TypeScript/esbuild and isolated fixtures. `scripts/check-account.mjs` includes Postgres/PGlite tests for owner restrictions, revisions and idempotent saves; these are not a substitute for testing every branch against hosted Supabase.

Browser fixtures are in `tests/context-v2-browser.html` and `tests/integration-browser.html`. Run the development server and open their URLs using an isolated browser context. Their RAM/gateway fixtures intentionally keep failure tests separate from personal data.

## Manual product checks

1. Explore: change major/faculty, search/filter directions and open a track. Other careers remain available regardless of major.
2. Path detail: select a stage/resource and save a certification goal. External resources open the correct provider.
3. My roadmap: adjust known skills, time and date; preview/regenerate and cancel. Cancel must not mutate an existing plan.
4. My plan: add/edit/schedule a task, move it to backlog, complete/undo, change week and inspect statistics. Preview each closing policy for unfinished tasks; closed history remains read-only.
5. Profile: save/cancel changes, navigate the activity grid with the keyboard, export/import a backup and inspect duplicate handling.
6. Accounts: sign in with Google, save and reload; sign out and confirm the separate Guest workspace. Explicit Guest import must preserve its source.
7. Failure/conflict: use a fixture to reject a save, preserve the candidate, retry and reject stale revisions. Do not inject failures into a personal account.
8. Diagrams: switch all three tabs, choose the first/last entry, open a direct link, navigate with the keyboard, zoom on mobile and print the selected diagram.

## Verification record

Google sign-in and account save/reload were verified with a real account on 11 October 2026. My Plan interface checks and reported defects were reviewed using isolated fixtures. The earlier detailed logs are retained in the separate internal draft.

The diagram viewer was checked at 1440px and 390px, including keyboard tab navigation, selection and contained horizontal scrolling when zoomed. The live Netlify viewer has 15 Activity, 8 Sequence and 44 Flowchart entries.

Two physical devices and every hosted network-failure branch have not been verified. Fixture tests do not establish those outcomes. Vite currently reports the existing application chunk above 500 kB; the build completes successfully.
