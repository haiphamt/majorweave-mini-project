# Repository guidance

## Product

uitplans. is a React/TypeScript learning planner. Keep the lowercase wordmark and rust-colored trailing dot. Main navigation stays in English: Explore, Path detail, My roadmap, My plan, Profile. Preserve the existing cream/rust palette and responsive layout.

## Commands

- `npm ci`
- `npm run dev`
- `npm run check` — product, workspace, integration and account checks
- `npm run check:features` — content, roadmap, plan, profile and migration checks
- `npm run build` — regenerate documentation, type-check and build

Read `docs/architecture.md`, `docs/testing.md` and `src/domain/contracts.ts` before changing data behavior.

## Boundaries

- Features use shared workspace callbacks; they do not write storage directly.
- Keep the domain independent of React and persistence.
- Guest uses IndexedDB; Google accounts use Supabase Auth and a private cloud workspace.
- A save succeeds only after the persistence acknowledgement. Preserve candidates on errors and revision conflicts.
- Keep persisted IDs, legacy keys and backup formats stable. Do not silently reset or discard unknown data.
- Guest import, backup import, regeneration and destructive plan actions need their existing previews/confirmations.
- Never commit `.env.local`, tokens, OAuth secrets or service role keys. Frontend environment variables are public.
- Use isolated fixtures for destructive/error tests; never modify a learner's real account as a test.

## Documentation and diagrams

`npm run build` regenerates the catalogue and diagram viewer. Edit their generators and data, not only the generated HTML. The viewer lives at `/events.html`, with Activity, Sequence and Flowchart tabs. Preserve links to existing EF/AD/SQ identifiers.

Keep public documentation focused on setup, architecture, product behavior and verification. Team allocations, meeting notes, handoff logs and presentation drafts belong outside the public repository. Preserve a recoverable draft before removing existing internal material.

## Delivery

Run the relevant checks and the production build. Inspect meaningful UI changes on desktop and mobile, including keyboard navigation. Report actual results and limitations; do not infer that a fixture proves behavior on two physical devices. Preserve other contributors' changes and Git history.
