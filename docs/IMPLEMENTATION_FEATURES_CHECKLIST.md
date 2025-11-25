ParrisDubboMover (PDM) — Implementation / Features Checklist

This checklist maps features described in the Design Blueprint to the current repository state. Each feature is either:
- [x] implemented (file references provided), or
- [ ] missing / not yet implemented (short notes + suggestions where helpful).

Use this document as the single place to track gaps and next work items.

Legend
- [x] Implemented (present in repo)
- [~] Partially implemented (basic support, needs improvements)
- [ ] Not implemented / missing

High-level modules (from the Design Blueprint)

1) Global / App
- [x] Monorepo with `client/` and `server/` workspaces and a root `dev` script that runs both via `concurrently`.
  - Files: `package.json` (root), `client/package.json`, `server/package.json`
- [x] Vite + React client app running on port 3000 with proxy to server port 5100.
  - Files: `client/vite.config.ts`
- [~] Dev error-handling notes and platform caveats documented (partial notes exist in `.github/copilot-instructions.md`).
- [ ] Auth / multi-user accounts (design assumes single user for MVP; user table seeded with `user_id=1`).
  - Files: `server/src/db/schema.ts` seeds a single user.

2) Data storage & DB
- [x] SQLite via `better-sqlite3` and runtime DB init/migrations.
  - Files: `server/src/db/index.ts`, `server/src/db/migrate.ts`, `server/src/db/schema.ts`.
- [x] Tables: `users`, `domains`, `documents`, `properties`, `job_options`, `childcare_options`, `providers`, `appointments`, `trips`, `trip_assignments`, `tasks`, `work_links`, `compliance_items`.
  - Files: `server/src/db/schema.ts`.
- [~] Document text extraction implemented for `.docx` & `.txt` and conditional PDF support (PDF parsing requires DOM polyfills).
  - Files: `server/src/services/documentTextExtractor.ts` (PDF parsing skips if DOM APIs not present).
- [ ] Full-text search (FTS) / semantic search / embeddings / vector store.
  - No references found. This is suggested in the design doc but not implemented.

3) Documents & Document ingestion
- [x] Document upload endpoint and client helper.
  - Files: `server/src/routes/documents.ts`, `client/src/api/documents.ts`.
- [x] Extract raw text from uploaded DOCX/TXT; PDF parsing supported conditionally.
  - Files: `server/src/services/documentTextExtractor.ts`.
- [ ] Document semantic indexing, embeddings, or RAG-style retrieval and AI summarization/extraction.
  - Not implemented.

4) Tasks / Checklist (central)
- [x] Task CRUD and domain grouping.
  - Files: `server/src/routes/tasks.ts`, `server/src/db/queries.ts` (task helpers), `client/src/api/tasks.ts`, `client/src/pages/TasksPage.tsx`, `client/src/components/TaskList.tsx` (and related components).
- [x] Domain table seeded with the 11 domains from the design doc.
  - File: `server/src/db/schema.ts` (domain seeds).
- [~] Task explanations / "why" field are stubbed in NextActions route; more advanced rationale engine not implemented.
  - File: `server/src/routes/next-actions.ts` (generateExplanation is basic).

5) "What Should I Do Next" (Next Actions)
- [x] Basic Next Actions endpoint that returns top-priority pending tasks (limit 1–3) and a simple explanation stub.
  - Files: `server/src/routes/next-actions.ts`, `client/src/pages/NextActionsPage.tsx`, `client/src/api/next-actions.ts`.
- [ ] Full "What Next" engine with rule-based + document-backed rationale or RAG-based NLP.
  - Explanation: route uses a simple heuristic; design doc envisages more advanced logic.

6) Properties / Housing module
- [x] `properties` table + basic seed for 53 Buckland St.
  - Files: `server/src/db/schema.ts` (schema + seed).
- [x] Client types for `Property` and API hooks exist.
  - Files: `client/src/types/api.ts`, `client/src/api` (no dedicated properties API file yet — search for `properties.ts` absent on server).
- [ ] Dedicated server `properties` routes (CRUD) — NOT present.
  - Suggestion: add `server/src/routes/properties.ts` + query helpers in `server/src/db/queries.ts`.

7) Kristy’s Job Options
- [x] DB table `job_options` exists and schema is in `schema.ts`.
- [ ] Server-side CRUD routes for `job_options` appear missing.
  - Files: server routes list does not include `job-options.ts`.
- [x] Client types exist (`JobOption` in `client/src/types/api.ts`) and client API file? There is `client/src/api/providers.ts` and others; `job_options` client adapter appears missing.
  - Suggestion: add `client/src/api/jobOptions.ts` and `server/src/routes/jobOptions.ts`.

8) Childcare options
- [x] DB table `childcare_options` exists.
- [ ] Server routes for childcare options missing.
- [ ] Client API adapters for childcare (fetch/create/update) missing or incomplete.

9) Providers & Appointments (Healthcare etc.)
- [x] `providers` and `appointments` tables present.
- [x] Server routes: `providers.ts` and `appointments.ts` exist in `server/src/routes`.
- [x] Client API helpers exist: `client/src/api/providers.ts`, `client/src/api/appointments.ts` and UI components `AppointmentFormModal.tsx`, `AppointmentList.tsx`.
- [ ] Calendar sync / iCal export / external calendar integration not implemented.

10) Trips & People/Vehicle Matrix (Logistics)
- [x] DB tables: `trips` and `trip_assignments` exist.
- [x] Server routes: `trips.ts` present.
- [x] Client types and pages: `client/src/pages/TripsPage.tsx`, `client/src/components/PeopleVehicleMatrix.tsx`, `client/src/types/trips.ts`.
- [ ] Advanced timeline/Gantt export, printable run-sheets, and shareable one-page run sheet not implemented (UI elements exist for planning but export/share is missing).

11) Packing / Boxes / Inventory
- [ ] Server-side tables for packing (`packing_areas`, `packing_boxes`, `packing_items`) are NOT present in DB schema.
- [x] Client-side API placeholder files exist: `client/src/api/packingAreas.ts`, `packingBoxes.ts`, `packingItems.ts` — these will fail without server routes.
- [ ] Sync between client packing UI and server DB (missing). Implement server endpoints or persist in DB.

12) Work Links / DCS Work Hub
- [x] `work_links` table exists and server route `work-links.ts` is present.
- [x] Client page `DcsWorkPage.tsx`, components `WorkLinksTable.tsx`, and API `client/src/api/workLinks.ts` exist.

13) Compliance (Licensing / Rego / WWCC)
- [x] `compliance_items` table exists and `server/src/routes/compliance-items.ts` is present.
- [x] Client API `client/src/api/complianceItems.ts` exists and UI `ComplianceTable.tsx` + `ComplianceFormModal.tsx` exist.

14) Church & Community hub (Community Places & Visits)
- [ ] Design doc CT14 requested `community_places` and `community_visits` tables + routes and UI.
- [ ] No server `communityPlaces` or `communityVisits` routes exist; client components/pages for Community Page not present (though `client/src/pages` includes many pages, `CommunityPage.tsx` is not in repo to my search results).
- [ ] Not implemented.

15) Documents Insights & Doc -> Tasks extraction
- [ ] Automatic parsing of uploaded documents into Tasks (smart extraction) is not implemented — basic text extraction is present but no automated task generation pipeline yet.
- [ ] Document snippet linking in Task detail (origin_doc_id exists in schema, but UI for showing snippets is limited).

16) "What Next" engine advanced features
- [ ] AI-backed advice (RAG + document context) — not implemented.
- [~] Simple rule-based NextAction exists (priority/due date heuristic) — implemented.

17) UI/UX expected features per design doc
- [x] Dashboard / Home showing next actions link exists as `client/src/pages/Home.tsx` and link in `App.tsx`.
- [x] Timeline page exists (`client/src/pages/TimelinePage.tsx`) and is wired in routes.
- [x] Documents page exists (`client/src/pages/DocumentsPage.tsx`) with upload UI.
- [x] Tasks page exists (`client/src/pages/TasksPage.tsx`).
- [ ] Map views for properties (map integration) not implemented.
- [ ] Print/export (PDF/CSV/one-page run sheet) missing.
- [ ] Offline/low-connectivity sync not implemented.
- [ ] Notifications (email, push) not implemented.

18) Integrations & external dependencies
- [ ] Centrelink / MyGov / Service NSW / WWCC direct integrations — not implemented (out of scope). The app provides checklists only.
- [ ] Calendar integration (Google Calendar, iCal export) — not implemented.
- [ ] Payment/billing integrations (bond payments, rent) — not implemented.

19) Developer/maintenance
- [x] Scripts and DX: `npm --workspace=client run dev`, `npm --workspace=server run dev` are available; root `npm run dev` runs both.
- [ ] Unit tests / automated tests — not present.
- [ ] Linting and formatting — intentionally left minimal; `lint` is placeholder.
- [x] Helper scripts for platform issues: `scripts/fix-bin-permissions.*` exist.

20) Misc (small features mentioned)
- [x] `origin_doc_id` on tasks exists for traceability.
- [x] `related_*` foreign keys exist on `tasks` to tie tasks to properties, job options, providers, childcare, trips.
- [ ] Embedding / vector search / semantic question-answering over documents — not implemented.
- [ ] Export/import backup / data migration CLI beyond the existing migrations — limited support via `migrate.ts`.

Detailed per-module TODO suggestions (short list)
- Add server CRUD routes for: `properties`, `job_options`, `childcare_options`, `packing_*` endpoints, `community_places` & `community_visits` (CT14).
- Implement document -> task extraction pipeline (even simple heuristics) to turn uploaded checklist documents into draft tasks linked to `origin_doc_id`.
- Add full-text search (SQLite FTS) or a lightweight vector store for semantic search across `documents.content_text`.
- Add iCal export for `appointments` and a simple CSV/print export for trips / people-vehicle matrix.
- Implement calendar sync (optional) and a "print run-sheet" feature for move week.
- Add tests for critical DB helpers in `server/src/db/queries.ts` and endpoint smoke tests.

Notes & pointers (where to start)
- DB: `server/src/db/schema.ts` is the canonical place to add new tables; `server/src/db/migrate.ts` runs `createTables` + seeds.
- Routes: follow the pattern in `server/src/routes/*` (e.g. `tasks.ts` and `work-links.ts`) and add corresponding helpers in `server/src/db/queries.ts`.
- Client: keep API adapters in `client/src/api/*` and types in `client/src/types/api.ts`.
- Docs: `docs/ParrisDubboMover (PDM) Design Blueprint.docx.txt` is the source of truth for features and user flows.

Status summary
- Implemented: core DB schema, tasks, documents upload (with extraction), providers & appointments, trips + trip assignments, work-links, compliance items, Next Actions (simple), pages for many modules (Tasks, Documents, Timeline, NextActions, DCS Work Hub); lots of UI scaffolding exists.
- Missing / important gaps: server routes for some domain tables (properties, job options, childcare, packing), semantic/document RAG features, calendar export/sync, export/print run-sheets, community modules (CT14), tests, and offline sync/notifications.

If you want, I can:
- Generate a prioritized issue list and create matching GitHub issue templates or PR branches.
- Implement one of the missing server routes (e.g., `properties`) and the corresponding client API and page.

Which next step would you like me to take? (I can start with the most valuable missing item: server `properties` CRUD + client API.)
