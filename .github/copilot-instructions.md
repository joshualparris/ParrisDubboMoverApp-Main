## Quick context — what this repo is

This repo is a small Vite + React (TypeScript) client app that implements the ParrisDubboMover (PDM) UI and a set of client-side API adapters. There is also a detailed design blueprint under `docs/ParrisDubboMover (PDM) Design Blueprint.docx.txt` describing the server, data model and expected API endpoints.

Key facts an AI assistant should know immediately:

- The frontend lives in `client/` (Vite + React + TypeScript). `client/package.json` scripts: `dev`, `build`, `preview`.
- Root `package.json` declares a workspace `server` but there is no `server/` folder in this snapshot — the full backend is NOT present. The root `dev` script runs both workspaces via `concurrently` and will fail unless a `server` workspace is added.

## How to run & debug (practical)

- Start only the client (works in this repo):
  - From repo root: npm --workspace=client run dev
  - Or from client: cd client; npm run dev
- Building production assets: npm --workspace=client run build
- If you add the server later, the root script uses: npm run dev (runs both client + server via concurrently)

## Important integration patterns & assumptions (copyable examples)

- API layer: `client/src/api/client.ts` and `client/src/api/base.ts` centralize requests. All client routes call `/api/*` relative to the app host. Example:
  - fetchTasks(domainId) => calls `/api/tasks/domain/{domainId}` (see `client/src/api/tasks.ts`). It will throw if missing required params.
  - createTask(...) currently injects `user_id: 1` locally before POSTing — this is a deliberate single-user shortcut to watch for if you add backend auth.
  - File uploads: `uploadDocument` posts a FormData to `/api/documents/upload` (not using `apiRequest` — uses raw fetch).
  - Error handling: `apiRequest` throws with the server response text when res.ok === false — propagate errors accordingly.

## Patterns & conventions to follow when editing

- Frontend is TypeScript + minimal CSS (see `client/src/styles.css`). Keep small components in `client/src/components` and page-level containers in `client/src/pages`.
- Keep API usage in `client/src/api/*` and update types in `client/src/types/*` when backend contracts change.
- Prefer using `apiRequest` from `client.ts` for JSON APIs; use FormData + fetch for file uploads when necessary.
- When adding backend routes, match these expected endpoints & methods: `/api/tasks`, `/api/tasks/:id`, `/api/tasks/:id/status (PATCH)`, `/api/tasks/domain/:domainId`, `/api/documents`, `/api/documents/upload`, `/api/domains`, `/api/trips` (see `client/src/api/*` files for exact expectations).

## Where to look first as a contributor

- `client/src/api/` — main contract between frontend & backend: change here if you alter endpoints.
- `client/src/types` — canonical types for entities like Task, Domain, Document.
- `client/src/pages/*` and `client/src/components/*` — UI behaviour and usage examples.
- `docs/ParrisDubboMover (PDM) Design Blueprint.docx.txt` — high-level architecture, data model, and server design. Use it as the primary spec for building backend endpoints.

## Common gotchas & TODOs for maintainers/agents

- Root-level `npm run dev` expects a `server` workspace that is missing. Use the client-only dev command while backend is absent.
- There are no unit tests configured — add tests (`vitest`/`jest`) if you introduce critical business logic.
- Linting is intentionally empty (`lint` prints a placeholder); maintainers should add an ESLint/formatter config before enforcing rules.

If anything here is unclear or you want this tailored more (e.g., add backend coding conventions or a checklist for adding a DB-backed server), tell me which area to expand and I’ll iterate. ✅
