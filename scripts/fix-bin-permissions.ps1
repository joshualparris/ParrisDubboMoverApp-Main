# PowerShell script to fix node_modules/.bin permissions on Windows (no-op for Windows but provided for symmetry)
param()

Write-Host "Fixing node_modules/.bin permissions on Windows is typically unnecessary.\n"
Write-Host "If you are on WSL/Unix, please run the shell script: scripts/fix-bin-permissions.sh" -ForegroundColor Yellow

# If running in Git Bash or WSL on Windows, you can call the shell script instead
if (Test-Path "./scripts/fix-bin-permissions.sh") {
    try {
        bash ./scripts/fix-bin-permissions.sh
    } catch {
        Write-Host 'Unable to call bash script from PowerShell (maybe not WSL). Please run the shell script manually in a bash environment.' -ForegroundColor Yellow
    }
}
