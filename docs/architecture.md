# Architecture

uitplans is a static React application. Its learning catalogue includes Node.js/Express, Python and Java as subjects to study; those tracks are not backend services running this application.

## Application layers

| Layer | Responsibility |
| --- | --- |
| `src/auth` | Supabase session lifecycle and Google OAuth |
| `src/app` | Active workspace, account boundaries, dirty-state protection and shared callbacks |
| `src/features` | The five learning pages and their interactions |
| `src/domain` | Planning, validation, progress, activity and data contracts |
| `src/content` | Faculties, majors, career directions, tracks, resources and credentials |
| `src/persistence` | IndexedDB, cloud gateway, backups and legacy migration |

The workspace controller manages the last acknowledged workspace and any pending candidate. Features submit changes through callbacks. Persistence confirms the commit before the controller reports success.

## Guest and account workspaces

Guest is an IndexedDB workspace tied to the browser origin. It is not Supabase Anonymous Auth. Signing in does not automatically copy Guest data into an account. The explicit Guest import presents a preview, creates independent copies and preserves the Guest source.

Google authenticates through Supabase Auth using basic identity information. Account data is stored in `public.uitplans_workspaces`, with one private JSONB workspace per user. RLS permits reads for the row owner. Writes go through `save_uitplans_workspace`, which verifies ownership, expected revision and request ID.

A conflicting revision is rejected rather than overwriting another session's data. Retrying the same cloud candidate uses the same request ID so a lost acknowledgement can be resolved without applying the same write twice.

## Remote updates and errors

The app checks remote revisions every 15 seconds while visible, and when focus/connectivity returns. A newer remote workspace is loaded automatically only when the local workspace is clean and ready. Users can also request a reload from the account menu.

There is no Supabase Realtime subscription, automatic conflict merge or durable offline write queue. Failed mutations retain their candidate in the current session for retry/export/discard. Do not treat a pending candidate as an already saved plan.

Signing out uses the Supabase SDK's local scope and returns to the separate Guest workspace. The SDK may emit `SIGNED_OUT` before its promise resolves. Session transitions must therefore follow the actual session event, including when an API response reports an error.

## Learning data

Draft learning choices are independent of existing plans. Each plan has its own tasks, schedule and history. Regeneration is previewed before confirmation. Closed-week snapshots and historical versions are read-only. Completion is self-reported; changing the profile time zone does not rewrite existing completion dates.

Backups are validated before import. Import supports explicit skip/copy handling for duplicate identifiers. Legacy migration preserves the original source and records its fingerprint to prevent accidental repeat import. The legacy key `majorweave.prototype.v1` remains unchanged for compatibility.

## Diagrams

[Open the viewer](https://uitplans.netlify.app/events.html) for 15 Activity, 8 Sequence and 44 Flowchart diagrams. Activity describes the business decisions; Sequence describes component exchanges; Flowchart retains the earlier event-level representation. Their EF coverage is recorded in `docs/diagrams/uml-20261011/coverage.json`.

Diagram definitions are in `scripts/uml-events-data.cjs` and `scripts/event-flows-*.cjs`. Build-time rendering uses SVG and does not call an external diagram service. Long explanations remain in technical documentation, rather than the public viewer.
