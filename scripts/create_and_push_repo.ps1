<#
PowerShell helper for creating a GitHub repo and pushing the current project.

Usage (PowerShell):
  - Install Git and GitHub CLI (gh) first if missing.
  - Run from the repo root (where .git lives) or ensure git is initialized.

Examples:
  PS> .\scripts\create_and_push_repo.ps1 -RepoName pdm-parris-dubbo-mover -Visibility public

What this script does when gh is available:
  - Ensures git is initialized and there is at least one commit
  - Calls: gh repo create <owner>/<repo> --public|--private --source . --remote origin --push

If the GitHub CLI (gh) is not available, the script prints step-by-step commands you can run manually.
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "pdm-parris-dubbo-mover",

    [Parameter(Mandatory=$false)]
    [ValidateSet('public','private')]
    [string]$Visibility = 'public',

    [Parameter(Mandatory=$false)]
    [string]$RemoteName = 'origin'
)

function Ensure-GitIsAvailable {
    try {
        git --version > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

function Ensure-GhIsAvailable {
    try {
        gh --version > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

if (-not (Ensure-GitIsAvailable)) {
    Write-Host "ERROR: git is not installed or not in PATH. Please install git: https://git-scm.com/downloads" -ForegroundColor Red
    exit 2
}

$hasGh = Ensure-GhIsAvailable
if ($hasGh) {
    # Use plain ASCII and words to avoid shell parsing issues (avoid ampersands and angle-brackets inside double-quoted strings)
    Write-Host 'gh CLI found - attempting to create and push GitHub repository using gh...' -ForegroundColor Green
} else {
    Write-Host 'gh CLI not found - will print manual commands you can run locally.' -ForegroundColor Yellow
}

# Ensure we're inside the project root with a git repo (or initialize)
if (-not (Test-Path .git)) {
    Write-Host "No .git found — initializing a new git repository." -ForegroundColor Yellow
    git init
    git add -A
    git commit -m "Initial commit: scaffold" || Write-Host "Couldn't commit - check git user.name/user.email" -ForegroundColor Yellow
}

# If there are no commits, make one
$hasCommits = $false
try {
    git rev-parse --verify HEAD > $null 2>&1; $hasCommits = $true
} catch {
    $hasCommits = $false
}
if (-not $hasCommits) {
    git add -A
    git commit -m "Initial commit" || Write-Host "Failed initial commit — you may need to configure git user.name and user.email" -ForegroundColor Yellow
}

if ($hasGh) {
    # This will be interactive if necessary and will push to origin
    try {
        # Try a simple non-interactive create using the local folder name unless RepoName contains '/'
        $repoArg = $RepoName
        gh repo create $repoArg --$Visibility --source . --remote $RemoteName --push --confirm
        Write-Host "Repository created and pushed successfully." -ForegroundColor Green
        exit 0
    } catch {
        Write-Host "gh failed to create/push the repository: $_" -ForegroundColor Red
        Write-Host "You can run these commands manually:" -ForegroundColor Yellow
    }
}

# If we reach here, gh wasn't available or failed — print instructions
Write-Host 'Manual push instructions:' -ForegroundColor Cyan
Write-Host "1) Create a new empty repository on GitHub (https://github.com/new) named: $RepoName" -ForegroundColor White
Write-Host '2) Add remote and push to GitHub (replace YOUR_USERNAME and REPO_NAME accordingly)' -ForegroundColor White

Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/$RepoName.git" -ForegroundColor Gray
Write-Host '  git branch -M main' -ForegroundColor Gray
Write-Host '  git push -u origin main' -ForegroundColor Gray

Write-Host "If you prefer SSH and have keys configured, use the SSH remote URL instead." -ForegroundColor White

Write-Host "Done — run the above commands in your repo root on your local machine." -ForegroundColor Green
exit 0
