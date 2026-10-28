# Stops the Order Now demo started by start-order-service.bat: the tunnel, order-service (with its Playwright
# and Chromium processes) and the keep-awake helper.
param([switch]$Quiet)
$ErrorActionPreference = "Continue"

$run = Join-Path (Split-Path -Parent $PSScriptRoot) ".run"
$expected = @{ tunnel = "cloudflared"; service = "python*"; keepawake = "powershell" }
$stopped = @()
foreach ($name in "tunnel", "service", "keepawake") {
  $file = Join-Path $run "$name.pid"
  if (-not (Test-Path -LiteralPath $file)) { continue }
  $procId = [int](Get-Content -LiteralPath $file)
  $process = Get-Process -Id $procId -ErrorAction SilentlyContinue
  if ($process -and $process.ProcessName -like $expected[$name]) {
    & taskkill.exe /PID $procId /T /F 2>$null | Out-Null  # /T also ends its child processes
    $stopped += $name
  }
  Remove-Item -LiteralPath $file -ErrorAction SilentlyContinue
}
Remove-Item -LiteralPath (Join-Path $run "tunnel-url.txt") -ErrorAction SilentlyContinue
if (-not $Quiet) {
  if ($stopped) { Write-Host "Stopped: $($stopped -join ', ')." } else { Write-Host "Nothing was running." }
}
