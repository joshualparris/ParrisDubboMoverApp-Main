# ParrisDubboMover (PDM)

A browser-based mission control app for the Parris family’s Bendigo → Dubbo move.

Tech stack
- Frontend: React 18 + TypeScript + Vite
- Backend: Node 20+ + Express + TypeScript
- Database: SQLite (via better-sqlite3)

Getting started

1. Open a terminal and change to the project root:

```
cd _ParrisDubboMoverApp
```

2. Install dependencies for both workspaces:

```
npm run install:all
```

3. Start both client and server (single command):

```
npm run dev
```

4. Open your browser at `http://localhost:3000`.

Verification
- Home page shows “PDM App running”.
- The page displays API health status fetched from `/api/health` (should show `ok`).
- You can also visit `http://localhost:3000/api/health` which proxies to the backend and returns `{ "status": "ok" }`.

Notes
- The server uses SQLite and will create a database file at `server/data/pdm.db` when it runs.
- This is scaffolding (CT1). The full data model and features will be added in later CT prompts.

## API Endpoints

### Domains
- `GET /api/domains` — List all domains

### Tasks
- `GET /api/tasks/:id` — Get task by ID
- `GET /api/tasks/domain/:domain` — Get tasks by domain slug or ID
- `POST /api/tasks` — Create new task
- `PATCH /api/tasks/:id/status` — Update task status
- `DELETE /api/tasks/:id` — Delete task

See `server/src/routes/domains.ts` and `server/src/routes/tasks.ts` for details.

## UI Features

- View all domains (e.g. Housing, Health, Childcare, etc.)
- Select a domain to view its tasks
- Create, update, and delete tasks for each domain
- Dashboard page for quick overview

## Document Upload & Browser

- Upload PDF, DOCX, or TXT files via the Documents page
- View a list of uploaded documents
- Click a document to preview metadata and extracted text
- Files are stored in `server/uploads` and indexed in the database

## Usage

- Go to `/tasks` to manage tasks by domain
- Go to `/dashboard` for a simple overview
