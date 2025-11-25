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
