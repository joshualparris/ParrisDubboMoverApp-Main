# ParrisDubboMoverApp

See `docs/README.md` for setup, usage, and architecture details.

## Pushing this project to GitHub

This repository can be pushed to a new GitHub repository from your local machine. If you have the GitHub CLI (`gh`) installed the included helper script `scripts/create_and_push_repo.ps1` can create and push a new repository for you.

Quick steps (PowerShell):

1. Make sure git and gh are installed and you're signed into gh:

```
git --version
gh --version
gh auth login
```

2. Run the helper script from the project root (optionally adjust repo name/visibility):

```
.\scripts\create_and_push_repo.ps1 -RepoName pdm-parris-dubbo-mover -Visibility public
```

3. If you don't have `gh`, create a new repo at https://github.com/new then add the remote and push locally:

```
git remote add origin https://github.com/<USERNAME>/pdm-parris-dubbo-mover.git
git branch -M main
git push -u origin main
```

If you'd like me to push the repo for you from here I can try — but that requires either `git`/`gh` in this environment or a GitHub token from you (not recommended). It's easiest and safest to run the steps above locally.

## Running the app locally (dev)

This repo is a monorepo with two workspaces: `client/` (Vite + React) and `server/` (Node + Express + TypeScript + SQLite). From the repo root you can start both with one command:

```powershell
npm run dev
```

This executes both the backend and frontend concurrently (frontend on http://localhost:3000 and backend on http://localhost:5100 by default). If you have issues starting binaries on Unix (permission denied on node_modules/.bin/*), run:

Unix / WSL:
```bash
sh ./scripts/fix-bin-permissions.sh
```

Windows PowerShell (invoke WSL/bash if required):
```powershell
.\scripts\fix-bin-permissions.ps1
```

If you need PDF text extraction in the backend, the server uses `pdf-parse` which relies on some browser DOM classes via `pdfjs-dist`. On a pure Node environment we skip PDF parsing unless a canvas-like polyfill is installed. To enable server-side PDF parsing install a canvas implementation (e.g. `@napi-rs/canvas`) and set up the corresponding globals in your runtime environment.
