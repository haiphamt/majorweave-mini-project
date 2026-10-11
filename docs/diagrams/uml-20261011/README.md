# System diagrams

[Live viewer](https://uitplans.netlify.app/events.html) · [Local viewer](../../../public/events.html)

15 Activity, 8 Sequence and 44 Flowchart diagrams. Select a type and diagram in the unified viewer; zoom or print the current figure. Existing EF/AD/SQ links are preserved.

## Sources

- Business Activity and component Sequence definitions: `scripts/uml-events-data.cjs`
- Earlier event Flowcharts: `scripts/event-flows-current.cjs`, `event-flows-v2.cjs`, `event-flows-account.cjs`
- SVG rendering: `scripts/generate-uml-events.cjs` and `generate-current-events.cjs`
- Viewer: `scripts/generate-diagram-viewer.cjs`, `public/events.css`, `public/events.js`
- Brand palette: [STYLE_GUIDE.md](STYLE_GUIDE.md)
- EF-to-UML coverage: [coverage.json](coverage.json)

Regenerate with `node scripts/prepare-docs.mjs` or `npm run build`. Definitions describe the implemented Guest/Google/Supabase behavior, including explicit import, revision conflicts and polling. They do not certify that every hosted error branch has been tested; see [testing](../../testing.md).

Standalone diagram files retain their SVG and technical notes for offline reference. The public routes redirect into the compact viewer. SVG text uses offline Segoe UI with Arial fallback.
