## Quick context — what this repo is

This repo is the ParrisDubboMover (PDM) app: a Vite + React (TypeScript) frontend in `client/` and a Node/Express + TypeScript backend in `server/` (SQLite via `better-sqlite3`). See `docs/ParrisDubboMover (PDM) Design Blueprint.docx.txt` for the product spec.

Key facts an AI assistant should know immediately:

- The frontend lives in `client/` (Vite + React + TypeScript). `client/package.json` scripts: `dev`, `build`, `preview`.
- The backend lives in `server/` (Express + TypeScript). `server/package.json` scripts: `dev` (ts-node-dev) and `build` (tsc).
- Root `package.json` uses workspaces and exposes a convenience `npm run dev` which runs both server and client via `concurrently`.

## How to run & debug (practical)

- Start both (root):

  PowerShell:

  $env:PORT=5100; npm run dev

  (The root `dev` launches server and client; server defaults to port `5100`.)

- Start only server:

  PowerShell:

  $env:PORT=5100; npm --workspace=server run dev

- Start only client:

  PowerShell:

  npm --workspace=client run dev

- Build client production assets:

  npm --workspace=client run build

Notes:
- Vite dev server listens on `3000` and proxies `/api` to the backend. See `client/vite.config.ts` for the proxy target (default `http://localhost:5100`).
- The server listens on `PORT` (default `5100`) in `server/src/index.ts`.

## Important integration patterns & assumptions (copyable examples)

- API layer: `client/src/api/client.ts` centralizes JSON requests as `apiRequest`. Most client adapters live in `client/src/api/*` and use that helper.
  - Example: `fetchTasks(domainId)` calls `/api/tasks/domain/{domainId}` (see `client/src/api/tasks.ts`). It throws when required params are missing.
  - Single-user shortcut: many client calls and server seed data assume `user_id = 1` for now (seeded in `server/src/db/schema.ts`). Be careful when adding auth.
  - File uploads: `client` uploads documents via `FormData` to `/api/documents/upload` (see `client/src/api/documents.ts` & `server/src/routes/documents.ts`). The server uses `multer` and `server/src/services/documentTextExtractor.ts` to extract text (DOCX/TXT supported; PDF parsing is conditional—may be skipped without DOM polyfills).
  - Error handling: `apiRequest` throws with server response text when `res.ok === false` — caller should catch and display the message.

## Patterns & conventions to follow when editing

- Frontend: keep small UI pieces in `client/src/components/` and page containers in `client/src/pages/`.
- API adapters: add or update adapters in `client/src/api/*` and update types in `client/src/types/*`.
- Server routes: place route handlers in `server/src/routes/*` and export a router default; mount the router in `server/src/app.ts` (see existing patterns: `tasks.ts`, `work-links.ts`, `compliance-items.ts`).
- DB schema/migrations: modify `server/src/db/schema.ts` (CREATE TABLE) and ensure `server/src/db/migrate.ts` runs your new schema code on startup (migrations run via `initDb()` in `server/src/index.ts`).
- Naming & IDs: DB tables use `INTEGER PRIMARY KEY AUTOINCREMENT`. Many helpers default to `user_id = 1` — change carefully.

## Where to look first as a contributor

- `client/src/api/` — main contract between frontend & backend.
- `client/src/types/` — canonical TypeScript types used across the UI.
- `server/src/db/` — schema (`schema.ts`), migrations (`migrate.ts`) and queries/helpers (`queries.ts`).
- `server/src/routes/` — example routes to copy patterns from (`tasks.ts`, `documents.ts`, `work-links.ts`, `compliance-items.ts`).
- `docs/ParrisDubboMover (PDM) Design Blueprint.docx.txt` — feature spec and domain model.
- `docs/IMPLEMENTATION_FEATURES_CHECKLIST.md` — current implementation status and gaps (useful to pick next tasks).

## Common gotchas & troubleshooting

- Database file and migrations: DB file is created at `server/data/pdm.db` when the server starts. If migrations fail, check `server/src/db/migrate.ts` and `server/src/db/schema.ts`.
- Native build for `better-sqlite3`: this package has native binaries — if `npm install` fails on your platform, run the helper scripts `scripts/fix-bin-permissions.ps1` (Windows) or `scripts/fix-bin-permissions.sh` (Unix) and ensure build tools are available.
- PDF parsing can crash in Node environments missing certain DOM APIs; if document text extraction for PDFs is required, add a Node canvas/polyfill or run PDF parsing in a separate worker as noted in `server/src/services/documentTextExtractor.ts`.
- Port conflicts: change the server port via `PORT` env var (PowerShell example shown above) and update `client/vite.config.ts` proxy target if necessary.
- Seed data: the repo seeds a default user (id=1) and domain rows on first run — check `server/src/db/schema.ts` for seeded entries.

If you'd like, I can expand this into a longer developer onboarding doc (runbook, common PR checklist, and CI steps).
