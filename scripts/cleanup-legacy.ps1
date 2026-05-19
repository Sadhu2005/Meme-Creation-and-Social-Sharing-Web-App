# Run after stopping any dev servers (Ctrl+C on port 5173 and 5000)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/cleanup-legacy.ps1

$root = Split-Path $PSScriptRoot -Parent
$folders = @("frontend", "backend", "gitworkflow")

foreach ($name in $folders) {
  $path = Join-Path $root $name
  if (Test-Path $path) {
    Write-Host "Removing $path ..."
    Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
    if (Test-Path $path) {
      Write-Host "  Could not fully remove $name (close VS Code / stop npm run dev, then delete manually)"
    } else {
      Write-Host "  Removed $name"
    }
  }
}

Write-Host "Done. Use only: npm run dev  ->  http://localhost:3000"
