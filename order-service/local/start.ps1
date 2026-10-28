# Starts the Order Now demo on this laptop: order-service (127.0.0.1 only, one process), a Cloudflare quick
# tunnel to it, and a keep-awake helper. Each runs as its own hidden process, so closing this window does not
# stop them; stop-order-service.bat stops all three. Prints the tunnel address to paste into Vercel.
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$svc = Split-Path -Parent $PSScriptRoot
$run = Join-Path $svc ".run"
$envFile = Join-Path $svc ".env.local"
$urlFile = Join-Path $run "tunnel-url.txt"
New-Item -ItemType Directory -Force $run | Out-Null

function Read-Settings {
  $s = @{}
  foreach ($line in Get-Content -LiteralPath $envFile) {
    $t = $line.Trim()
    if (-not $t -or $t.StartsWith("#")) { continue }
    $i = $t.IndexOf("=")
    if ($i -gt 0) { $s[$t.Substring(0, $i).Trim()] = $t.Substring($i + 1).Trim() }
  }
  $s
}

function Get-Running([string]$name) {
  $file = Join-Path $run "$name.pid"
  if (-not (Test-Path -LiteralPath $file)) { return $null }
  Get-Process -Id ([int](Get-Content -LiteralPath $file)) -ErrorAction SilentlyContinue
}

function Start-Hidden([string]$commandLine) {
  # Win32_Process.Create starts the process on its own (not as a child of this window), with no window.
  $startup = New-CimInstance -ClassName Win32_ProcessStartup -ClientOnly -Property @{ ShowWindow = [uint16]0 }
  $result = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $commandLine; CurrentDirectory = $svc; ProcessStartupInformation = $startup }
  if ($result.ReturnValue -ne 0) { throw "Could not start a background process (Win32_Process error $($result.ReturnValue))." }
  [int]$result.ProcessId
}

function Stop-All { & (Join-Path $PSScriptRoot "stop.ps1") -Quiet }

function Show-Address([string]$url) {
  Write-Host ""
  Write-Host "  Tunnel address:  $url" -ForegroundColor Green
  Write-Host ""
  Write-Host "  In Vercel (Settings > Environment Variables), then redeploy:"
  Write-Host "    ATTSPOC_SERVICE_URL = $url"
  Write-Host "    ATTSPOC_SERVICE_KEY = the value in order-service\.env.local (it does not change on restart)"
  Write-Host ""
  Write-Host "  The address changes every time the tunnel starts. Stop with stop-order-service.bat."
}

if ((Get-Running "service") -and (Get-Running "tunnel") -and (Test-Path -LiteralPath $urlFile)) {
  Write-Host "order-service and the tunnel are already running."
  Show-Address (Get-Content -LiteralPath $urlFile)
  exit 0
}
Stop-All  # clears a partial run, for example a tunnel that stopped while the service kept running

# ---------------------------------------------------------------- settings and tools
if (-not (Test-Path -LiteralPath $envFile)) { throw "$envFile is missing. It must hold ATTSPOC_SERVICE_KEY (a random secret of at least 32 characters)." }
$settings = Read-Settings
if (("" + $settings["ATTSPOC_SERVICE_KEY"]).Length -lt 32) { throw "ATTSPOC_SERVICE_KEY in $envFile must be at least 32 characters." }
$port = 8787
if ($settings["PORT"]) { $port = [int]$settings["PORT"] }
$moduleDir = $settings["ATTSPOC_MODULE_DIR"]
if (-not $moduleDir) { $moduleDir = Join-Path (Split-Path -Parent $svc) "attspoc AT&T" }
if (-not (Test-Path -LiteralPath (Join-Path $moduleDir "att_order_automation.py"))) { throw "att_order_automation.py was not found in $moduleDir (ATTSPOC_MODULE_DIR)." }
if (-not (Test-Path -LiteralPath (Join-Path $moduleDir "portal_url.txt"))) { Write-Warning "portal_url.txt is missing in $moduleDir, so every quote will answer not_configured." }

$python = $settings["PYTHON"]
if (-not $python) { $python = Get-Command python -All -ErrorAction SilentlyContinue | Where-Object { $_.Source -notlike "*WindowsApps*" } | Select-Object -First 1 -ExpandProperty Source }
if (-not $python) { throw "Python 3.11 was not found. Install it, then run: pip install -r order-service\requirements.txt and python -m playwright install chromium" }
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source
if (-not $cloudflared) { $cloudflared = @("$env:ProgramFiles\cloudflared\cloudflared.exe", "${env:ProgramFiles(x86)}\cloudflared\cloudflared.exe") | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1 }
if (-not $cloudflared) { throw "cloudflared was not found. Install it with: winget install Cloudflare.cloudflared" }
if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { throw "Port $port is already in use. Set another PORT in $envFile." }

# ---------------------------------------------------------------- order-service
Write-Host "Starting order-service on 127.0.0.1:$port ..."
$servicePid = Start-Hidden "`"$python`" `"$PSScriptRoot\run_local.py`""
Set-Content -LiteralPath (Join-Path $run "service.pid") $servicePid
$healthy = $false
for ($i = 0; $i -lt 60 -and -not $healthy; $i++) {
  Start-Sleep -Milliseconds 500
  if (-not (Get-Process -Id $servicePid -ErrorAction SilentlyContinue)) { break }
  try { $healthy = (Invoke-RestMethod "http://127.0.0.1:$port/healthz" -TimeoutSec 2).ok -eq $true } catch { }
}
if (-not $healthy) {
  Get-Content -LiteralPath (Join-Path $run "service.log") -Tail 15 -ErrorAction SilentlyContinue | Write-Host
  Stop-All
  throw "order-service did not start (log: order-service\.run\service.log)."
}

$powershell = Join-Path $PSHOME "powershell.exe"
$keepAwakePid = Start-Hidden "`"$powershell`" -NoProfile -ExecutionPolicy Bypass -File `"$PSScriptRoot\keep-awake.ps1`" -ServicePid $servicePid"
Set-Content -LiteralPath (Join-Path $run "keepawake.pid") $keepAwakePid

# ---------------------------------------------------------------- tunnel
Write-Host "Starting the Cloudflare quick tunnel ..."
$tunnelLog = Join-Path $run "tunnel.log"
Remove-Item -LiteralPath $tunnelLog -ErrorAction SilentlyContinue
$tunnelPid = Start-Hidden "`"$cloudflared`" tunnel --no-autoupdate --url http://127.0.0.1:$port --logfile `"$tunnelLog`""
Set-Content -LiteralPath (Join-Path $run "tunnel.pid") $tunnelPid
$url = $null
$registered = $false
for ($i = 0; $i -lt 90 -and -not ($url -and $registered); $i++) {
  Start-Sleep -Seconds 1
  if (-not (Get-Process -Id $tunnelPid -ErrorAction SilentlyContinue)) { break }
  $text = Get-Content -LiteralPath $tunnelLog -Raw -ErrorAction SilentlyContinue
  if ($text -match "https://(?!api\.)[a-z0-9-]+\.trycloudflare\.com") { $url = $Matches[0] }
  $registered = $text -match "Registered tunnel connection"
}
if (-not $url) {
  Get-Content -LiteralPath $tunnelLog -Tail 15 -ErrorAction SilentlyContinue | Write-Host
  Stop-All
  throw "The tunnel did not start (log: order-service\.run\tunnel.log). Check the internet connection and try again."
}
Set-Content -LiteralPath $urlFile $url

Write-Host "Checking the tunnel address ..."
$public = $false
for ($i = 0; $i -lt 20 -and -not $public; $i++) {
  Start-Sleep -Seconds 3
  try { $public = (Invoke-RestMethod "$url/healthz" -TimeoutSec 10).ok -eq $true } catch { }
}
Show-Address $url
if ($public) { Write-Host "  Health check through the tunnel: OK" -ForegroundColor Green }
else { Write-Warning "The tunnel address did not answer from this laptop yet (a new address can take a minute to reach every DNS server). Open $url/healthz in a browser shortly." }
