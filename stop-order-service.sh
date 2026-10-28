#!/usr/bin/env bash
# Stops order-service, the Cloudflare quick tunnel and the keep-awake helper started by start-order-service.sh.
root="$(cd "$(dirname "$0")" && pwd)"
case "$(uname -s)" in
  MINGW* | MSYS* | CYGWIN*)
    exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w "$root/order-service/local/stop.ps1")" ;;
esac

run="$root/order-service/.run"
stopped=""
for name in tunnel service keepawake; do
  f="$run/$name.pid"
  [ -f "$f" ] || continue
  pid="$(cat "$f")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true  # SIGTERM: order-service closes its browser before exiting
    stopped="$stopped $name"
  fi
  rm -f "$f"
done
rm -f "$run/tunnel-url.txt"
if [ -n "$stopped" ]; then echo "Stopped:$stopped."; else echo "Nothing was running."; fi
