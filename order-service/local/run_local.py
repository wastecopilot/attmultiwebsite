"""Runs order-service on this laptop for the Order Now demo (started by start-order-service.bat / .sh).

Same service as `python server.py`, with three local additions:
- settings come from order-service/.env.local (git-ignored); the partner portal link is not there, the
  automation reads it from portal_url.txt in ATTSPOC_MODULE_DIR;
- the service listens on 127.0.0.1 only, and on Windows the port is exclusive, so a second copy cannot start
  (the quote and the order request must reach the same process);
- the log goes to order-service/.run/service.log with every web address and portal session id removed (the
  automation logs the session address and page paths at INFO; they open the customer's prepared order).
"""
import logging
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SERVICE_DIR = HERE.parent
RUN_DIR = SERVICE_DIR / ".run"
URL = re.compile(r"https?://\S+")
SESSION_ID = re.compile(r"\(S\([^)]*\)\)", re.IGNORECASE)  # cookieless ASP.NET session in portal paths


def load_env_file(path: Path) -> None:
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        os.environ[name.strip()] = value.strip()


class RedactingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        text = URL.sub("[address removed]", super().format(record))
        return SESSION_ID.sub("(S(removed))", text)


def main() -> None:
    RUN_DIR.mkdir(exist_ok=True)
    out = open(RUN_DIR / "service.log", "a", encoding="utf-8", buffering=1)
    sys.stdout = sys.stderr = out  # startup errors land in the log too (the process has no visible window)

    env_file = SERVICE_DIR / ".env.local"
    if not env_file.exists():
        sys.exit(f"{env_file} is missing: it must hold ATTSPOC_SERVICE_KEY.")
    load_env_file(env_file)
    os.environ["ATTSPOC_SERVICE_HOST"] = "127.0.0.1"  # reachable only through the tunnel, never the network
    os.environ.setdefault("ATTSPOC_MODULE_DIR", str(SERVICE_DIR.parent / "attspoc AT&T"))
    os.chdir(SERVICE_DIR)

    handler = logging.StreamHandler(out)
    handler.setFormatter(RedactingFormatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
    logging.basicConfig(level=logging.INFO, handlers=[handler])  # server.main()'s basicConfig is then a no-op

    if os.name == "nt":
        import http.server
        http.server.ThreadingHTTPServer.allow_reuse_address = False  # SO_REUSEADDR on Windows lets two copies share the port

    sys.path.insert(0, str(SERVICE_DIR))
    import server  # reads the settings above at import time

    server.main()


if __name__ == "__main__":
    main()
