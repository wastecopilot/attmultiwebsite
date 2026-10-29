# Restarts only order-service (for example after the automation module was updated) and its keep-awake helper.
# The Cloudflare tunnel keeps running, so its address, and the ATTSPOC_SERVICE_URL set in Vercel, stay the same.
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$svc = Split-Path -Parent $PSScriptRoot
$run = Join-Path $svc ".run"
$envFile = Join-Path $svc ".env.local"

function Start-Hidden([string]$commandLine) {
  # Win32_Process.Create starts the process on its own (not as a child of this window), with no window.
  $startup = New-CimInstance -ClassName Win32_ProcessStartup -ClientOnly -Property @{ ShowWindow = [uint16]0 }
  $result = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $commandLine; CurrentDirectory = $svc; ProcessStartupInformation = $startup }
  if ($result.ReturnValue -ne 0) { throw "Could not start a background process (Win32_Process error $($result.ReturnValue))." }
  [int]$result.ProcessId
}

$tunnelPidFile = Join-Path $run "tunnel.pid"
$tunnelUp = (Test-Path -LiteralPath $tunnelPidFile) -and (Get-Process -Id ([int](Get-Content -LiteralPath $tunnelPidFile)) -ErrorAction SilentlyContinue)
if (-not $tunnelUp) { throw "The tunnel is not running. Use start-order-service.bat instead (it starts both)." }

$port = 8787
foreach ($line in Get-Content -LiteralPath $envFile) { if ($line -match '^\s*PORT\s*=\s*(\d+)') { $port = [int]$Matches[1] } }

foreach ($name in "keepawake", "service") {
  $file = Join-Path $run "$name.pid"
  if (Test-Path -LiteralPath $file) {
    $procId = [int](Get-Content -LiteralPath $file)
    if (Get-Process -Id $procId -ErrorAction SilentlyContinue) { & taskkill.exe /PID $procId /T /F 2>$null | Out-Null }
    Remove-Item -LiteralPath $file -ErrorAction SilentlyContinue
  }
}
for ($i = 0; $i -lt 20 -and (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue); $i++) { Start-Sleep -Milliseconds 500 }

$python = Get-Command python -All -ErrorAction SilentlyContinue | Where-Object { $_.Source -notlike "*WindowsApps*" } | Select-Object -First 1 -ExpandProperty Source
if (-not $python) { throw "Python was not found." }
Write-Host "Restarting order-service on 127.0.0.1:$port ..."
$servicePid = Start-Hidden "`"$python`" `"$PSScriptRoot\run_local.py`""
Set-Content -LiteralPath (Join-Path $run "service.pid") $servicePid
$healthy = $false
for ($i = 0; $i -lt 60 -and -not $healthy; $i++) {
  Start-Sleep -Milliseconds 500
  if (-not (Get-Process -Id $servicePid -ErrorAction SilentlyContinue)) { break }
  try { $healthy = (Invoke-RestMethod "http://127.0.0.1:$port/healthz" -TimeoutSec 2).ok -eq $true } catch { }
}
if (-not $healthy) { throw "order-service did not start (log: order-service\.run\service.log)." }
$powershell = Join-Path $PSHOME "powershell.exe"
$keepAwakePid = Start-Hidden "`"$powershell`" -NoProfile -ExecutionPolicy Bypass -File `"$PSScriptRoot\keep-awake.ps1`" -ServicePid $servicePid"
Set-Content -LiteralPath (Join-Path $run "keepawake.pid") $keepAwakePid

$url = Get-Content -LiteralPath (Join-Path $run "tunnel-url.txt")
Write-Host ""
Write-Host "  order-service restarted. The tunnel address is unchanged:  $url" -ForegroundColor Green
