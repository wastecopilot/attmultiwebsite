#!/usr/bin/env bash
# Starts the Order Now demo: order-service (127.0.0.1 only, one process) and a Cloudflare quick tunnel to it,
# keeps the computer awake while they run, and prints the tunnel address to paste into Vercel.
# Stop with ./stop-order-service.sh. On Windows (Git Bash) it runs the same steps as start-order-service.bat.
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd)"
case "$(uname -s)" in
  MINGW* | MSYS* | CYGWIN*)
    exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w "$root/order-service/local/start.ps1")" ;;
esac

svc="$root/order-service"
run="$svc/.run"
mkdir -p "$run"
alive() { [ -f "$run/$1.pid" ] && kill -0 "$(cat "$run/$1.pid")" 2>/dev/null; }
show() {
  printf '\n  Tunnel address:  %s\n\n' "$1"
  printf '  In Vercel (Settings > Environment Variables), then redeploy:\n'
  printf '    ATTSPOC_SERVICE_URL = %s\n' "$1"
  printf '    ATTSPOC_SERVICE_KEY = the value in order-service/.env.local (it does not change on restart)\n\n'
  printf '  The address changes every time the tunnel starts. Stop with ./stop-order-service.sh.\n'
}

if alive service && alive tunnel && [ -f "$run/tunnel-url.txt" ]; then
  echo "order-service and the tunnel are already running."
  show "$(cat "$run/tunnel-url.txt")"
  exit 0
fi
bash "$root/stop-order-service.sh" >/dev/null  # clears a partial run

[ -f "$svc/.env.local" ] || { echo "order-service/.env.local is missing (it must hold ATTSPOC_SERVICE_KEY)." >&2; exit 1; }
port="$(sed -n 's/^PORT=//p' "$svc/.env.local" | tr -d '\r' | tail -n 1)"
port="${port:-8787}"
python="${PYTHON:-python3}"
command -v cloudflared >/dev/null || { echo "cloudflared is not installed: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/" >&2; exit 1; }

echo "Starting order-service on 127.0.0.1:$port ..."
nohup "$python" "$svc/local/run_local.py" >/dev/null 2>&1 &
echo $! >"$run/service.pid"
healthy=""
for _ in $(seq 60); do
  sleep 0.5
  alive service || break
  curl -fsS "http://127.0.0.1:$port/healthz" >/dev/null 2>&1 && { healthy=1; break; }
done
if [ -z "$healthy" ]; then
  tail -n 15 "$run/service.log" >&2 || true
  bash "$root/stop-order-service.sh" >/dev/null
  echo "order-service did not start (log: order-service/.run/service.log)." >&2
  exit 1
fi

# Keep the computer awake while the service runs (macOS: caffeinate; Linux: systemd-inhibit).
service_pid="$(cat "$run/service.pid")"
if command -v caffeinate >/dev/null; then
  nohup caffeinate -i -w "$service_pid" >/dev/null 2>&1 &
  echo $! >"$run/keepawake.pid"
elif command -v systemd-inhibit >/dev/null; then
  nohup systemd-inhibit --what=sleep:idle --why="order-service demo" tail --pid="$service_pid" -f /dev/null >/dev/null 2>&1 &
  echo $! >"$run/keepawake.pid"
fi

echo "Starting the Cloudflare quick tunnel ..."
rm -f "$run/tunnel.log"
nohup cloudflared tunnel --no-autoupdate --url "http://127.0.0.1:$port" --logfile "$run/tunnel.log" >/dev/null 2>&1 &
echo $! >"$run/tunnel.pid"
url=""
for _ in $(seq 90); do
  sleep 1
  alive tunnel || break
  url="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$run/tunnel.log" 2>/dev/null | grep -v '//api\.' | head -n 1 || true)"
  [ -n "$url" ] && grep -q "Registered tunnel connection" "$run/tunnel.log" && break
done
if [ -z "$url" ]; then
  tail -n 15 "$run/tunnel.log" >&2 || true
  bash "$root/stop-order-service.sh" >/dev/null
  echo "The tunnel did not start (log: order-service/.run/tunnel.log). Check the internet connection and try again." >&2
  exit 1
fi
echo "$url" >"$run/tunnel-url.txt"

echo "Checking the tunnel address ..."
public=""
for _ in $(seq 20); do
  sleep 3
  curl -fsS "$url/healthz" >/dev/null 2>&1 && { public=1; break; }
done
show "$url"
if [ -n "$public" ]; then echo "  Health check through the tunnel: OK"
else echo "  The tunnel address did not answer from this computer yet. Open $url/healthz in a browser shortly."; fi
