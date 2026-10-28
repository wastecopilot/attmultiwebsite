"""
order-service: an authenticated HTTP wrapper around the AT&T SPOC order automation
(att_order_automation.process_att_order), so the website can reach it over HTTPS.

The automation is a Python module (Playwright + Chromium) with in-memory state shared between its
"quote" and "handoff" calls, so it must run in ONE long-lived process. This file is that process:
an HTTP server (standard library only) plus one asyncio event loop that runs the automation.

    GET  /healthz              -> {"ok": true}
    POST /v1/quotes            -> 202 {"job_id", "state"}      body: {request_id, service_address, products}
    POST /v1/handoffs          -> 202 {"job_id", "state"}      body: {request_id, quote_job_id, customer, customer_confirmed}
    GET  /v1/jobs/<job_id>     -> {"job_id", "kind", "state": "running" | "done", "result"?}

Every /v1 call needs "Authorization: Bearer <ATTSPOC_SERVICE_KEY>".

What never leaves this process: the partner portal link (ATTSPOC_URL), the result's `handoff` block
(a bearer link to the prepared portal session: it goes to the specialist queue only), and the result's
internal keys (removed by the automation's own to_aria()). Request bodies and personal data are never
logged. See README.md for setup and deployment.
"""

from __future__ import annotations

import asyncio
import hmac
import importlib
import json
import logging
import os
import re
import secrets
import signal
import sys
import threading
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Optional
from urllib import request as urlrequest
from urllib.parse import urlparse

log = logging.getLogger("order_service")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

HERE = Path(__file__).resolve().parent
MODULE_NAME = os.environ.get("ATTSPOC_MODULE", "att_order_automation")
MODULE_DIR = os.environ.get("ATTSPOC_MODULE_DIR", "")   # folder holding att_order_automation.py, if not next to this file

SERVICE_KEY = os.environ.get("ATTSPOC_SERVICE_KEY", "")
HOST = os.environ.get("ATTSPOC_SERVICE_HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8080"))
QUEUE_DIR = Path(os.environ.get("ATTSPOC_SPECIALIST_QUEUE_DIR", "specialist_queue"))
WEBHOOK_URL = os.environ.get("ATTSPOC_SPECIALIST_WEBHOOK_URL", "")
WEBHOOK_TOKEN = os.environ.get("ATTSPOC_SPECIALIST_WEBHOOK_TOKEN", "")
MAX_QUEUED = int(os.environ.get("ATTSPOC_MAX_QUEUED", "12"))
JOB_TTL_S = 3600            # finished jobs are forgotten after an hour
MAX_BODY_BYTES = 16 * 1024
MIN_KEY_LENGTH = 32

ID_RE = re.compile(r"^[A-Za-z0-9_-]{16,80}$")

# Same pattern the automation uses for unknown keys (att_order_automation._SENSITIVE_KEY_RE), applied
# here to EVERY key so such a request is refused before it reaches the automation.
SENSITIVE_KEY_RE = re.compile(
    r"ssn|social|tax_?id|dob|birth|card|cvv|cvc|expir|account|routing|bank|iban|\bpin\b|password|passcode", re.I)
# Values that look like an SSN, a date of birth or a card number, in any free-text field.
SSN_VALUE_RE = re.compile(r"(?<!\d)\d{3}[- ]\d{2}[- ]\d{4}(?!\d)|(?<!\d)\d{9}(?!\d)")
DATE_VALUE_RE = re.compile(r"(?<!\d)(0?[1-9]|1[0-2])[/.-](0?[1-9]|[12]\d|3[01])[/.-](19|20)?\d{2}(?!\d)")
CARD_CANDIDATE_RE = re.compile(r"(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)")
# Fields whose values are strictly formatted elsewhere (and would trip the value patterns).
VALUE_SCAN_SKIP = {"phone", "zip_code", "email", "request_id", "quote_job_id", "order_ref"}


def _luhn_ok(digits: str) -> bool:
    total, alt = 0, False
    for ch in reversed(digits):
        d = int(ch)
        if alt:
            d = d * 2 - 9 if d > 4 else d * 2
        total += d
        alt = not alt
    return total % 10 == 0


def sensitive_paths(value: Any, path: str = "") -> list[str]:
    """Key paths that carry (or are named like) SSN, DOB, card or bank data. Values are never returned."""
    hits: list[str] = []
    if isinstance(value, dict):
        for k, v in value.items():
            p = f"{path}.{k}" if path else str(k)
            if SENSITIVE_KEY_RE.search(str(k)):
                hits.append(p)
                continue
            if isinstance(v, str) and str(k) not in VALUE_SCAN_SKIP and _sensitive_text(v):
                hits.append(p)
                continue
            hits += sensitive_paths(v, p)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            hits += sensitive_paths(v, f"{path}[{i}]")
    return hits


def _sensitive_text(text: str) -> bool:
    if SSN_VALUE_RE.search(text) or DATE_VALUE_RE.search(text):
        return True
    return any(_luhn_ok(re.sub(r"\D", "", m.group(0))) for m in CARD_CANDIDATE_RE.finditer(text))


def load_automation():
    for folder in (MODULE_DIR, str(HERE)):
        if folder and folder not in sys.path:
            sys.path.insert(0, folder)
    return importlib.import_module(MODULE_NAME)


aoa = load_automation()

# ---------------------------------------------------------------------------
# Jobs
# ---------------------------------------------------------------------------

_REF_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789"   # no 0/O, 1/I/L, U: easy to read out on a call


def new_order_ref() -> str:
    """Reference shown to the customer and used as the automation's order_ref (idempotency key)."""
    return "UW-" + "".join(secrets.choice(_REF_ALPHABET) for _ in range(8))


@dataclass
class Job:
    id: str
    kind: str                      # "quote" | "handoff"
    request_id: str
    order_ref: str
    created: float = field(default_factory=time.time)
    state: str = "running"         # "running" | "done"
    result: Optional[dict] = None  # to_aria(result): status, order_ref, message, retryable, data
    service_address: Optional[dict] = None   # quotes: what was priced, reused verbatim by the handoff
    products: Optional[list] = None
    quote_job_id: Optional[str] = None       # handoffs: the quote they continue

    def view(self) -> dict:
        out = {"job_id": self.id, "kind": self.kind, "state": self.state}
        if self.state == "done":
            out["result"] = self.result
        return out


class JobStore:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._jobs: dict[str, Job] = {}
        self._by_request: dict[tuple[str, str], str] = {}

    def purge(self) -> None:
        cutoff = time.time() - JOB_TTL_S
        with self._lock:
            for jid in [j.id for j in self._jobs.values() if j.state == "done" and j.created < cutoff]:
                job = self._jobs.pop(jid)
                self._by_request.pop((job.kind, job.request_id), None)

    def get(self, job_id: str) -> Optional[Job]:
        with self._lock:
            return self._jobs.get(job_id)

    def running(self) -> int:
        with self._lock:
            return sum(1 for j in self._jobs.values() if j.state == "running")

    def find_request(self, kind: str, request_id: str) -> Optional[Job]:
        with self._lock:
            jid = self._by_request.get((kind, request_id))
            return self._jobs.get(jid) if jid else None

    def handoffs_for(self, quote_job_id: str) -> list[Job]:
        with self._lock:
            return [j for j in self._jobs.values() if j.kind == "handoff" and j.quote_job_id == quote_job_id]

    def add(self, job: Job) -> None:
        with self._lock:
            self._jobs[job.id] = job
            self._by_request[(job.kind, job.request_id)] = job.id

    def finish(self, job: Job, result: dict) -> None:
        with self._lock:
            job.result, job.state = result, "done"


jobs = JobStore()
_create_lock = threading.Lock()   # makes "find by request_id, else create" atomic (double clicks)


class Runner:
    """One asyncio loop in a background thread runs every automation call (its state is per process)."""

    def __init__(self) -> None:
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(target=self.loop.run_forever, name="automation-loop", daemon=True)
        self.thread.start()

    def start(self, job: Job, payload: dict) -> None:
        asyncio.run_coroutine_threadsafe(_run_job(job, payload), self.loop)

    def stop(self) -> None:
        try:
            asyncio.run_coroutine_threadsafe(aoa.shutdown(), self.loop).result(timeout=30)
        except Exception:  # noqa: BLE001 - best effort on exit
            pass
        self.loop.call_soon_threadsafe(self.loop.stop)


async def _run_job(job: Job, payload: dict) -> None:
    t0 = time.monotonic()
    try:
        result = await aoa.process_att_order(payload)
    except Exception as e:  # process_att_order never raises; guard anyway
        log.error("job %s %s raised %s", job.id, job.kind, type(e).__name__)
        result = {"status": "portal_error", "order_ref": job.order_ref, "message": "", "retryable": True, "data": {}}

    handoff = result.pop("handoff", None)
    if handoff is not None:
        delivered = await asyncio.get_running_loop().run_in_executor(None, deliver_to_specialist, job, handoff)
        if not delivered:
            # Nobody would follow up, so the website must not tell the customer that someone will.
            result = {**result, "status": "handoff_undelivered", "retryable": False}
    public = aoa.to_aria(result)
    jobs.finish(job, public)
    log.info("job %s %s finished: %s in %.1fs", job.id, job.kind, public.get("status"), time.monotonic() - t0)


def deliver_to_specialist(job: Job, handoff: dict) -> bool:
    """Write the hand-off (portal link + tasks) to the private queue folder and notify the webhook, if set."""
    entry = {
        "reference": job.order_ref,
        "source": "website",
        "received_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "handoff": handoff,
    }
    body = json.dumps(entry, indent=2).encode("utf-8")
    stored = False
    try:
        QUEUE_DIR.mkdir(parents=True, exist_ok=True)
        name = f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}_{job.order_ref}.json"
        fd = os.open(QUEUE_DIR / name, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "wb") as f:
            f.write(body)
        stored = True
    except OSError as e:
        log.error("specialist queue write failed for %s: %s", job.order_ref, type(e).__name__)
    notified = False
    if WEBHOOK_URL:
        headers = {"Content-Type": "application/json"}
        if WEBHOOK_TOKEN:
            headers["Authorization"] = f"Bearer {WEBHOOK_TOKEN}"
        try:
            with urlrequest.urlopen(urlrequest.Request(WEBHOOK_URL, data=body, headers=headers, method="POST"), timeout=10) as r:
                notified = 200 <= r.status < 300
        except Exception as e:  # noqa: BLE001
            log.error("specialist webhook failed for %s: %s", job.order_ref, type(e).__name__)
    log.info("handoff %s queued (file: %s, webhook: %s)", job.order_ref, stored, notified if WEBHOOK_URL else "not set")
    return stored or notified


runner: Optional[Runner] = None

# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------


class ApiError(Exception):
    def __init__(self, status: int, error: str, **extra: Any) -> None:
        super().__init__(error)
        self.status, self.body = status, {"error": error, **extra}


def _validate_with_automation(payload: dict) -> None:
    """The automation's own schema check, run before starting a job (never echoes values)."""
    model = getattr(aoa, "OrderRequest", None)
    if model is None:
        return
    try:
        model.model_validate(payload)
    except Exception as e:  # pydantic.ValidationError
        errors = getattr(e, "errors", lambda: [])()
        fields = sorted({".".join(map(str, x.get("loc", ()))) for x in errors})
        raise ApiError(400, "invalid_request", fields=fields)


def _check_capacity() -> None:
    if jobs.running() >= MAX_QUEUED:
        raise ApiError(429, "busy")


def _require_keys(body: dict, allowed: set[str]) -> None:
    unknown = sorted(set(body) - allowed)
    missing = sorted(allowed - set(body))
    if unknown or missing:
        raise ApiError(400, "invalid_request", fields=unknown + missing)


def create_quote(body: dict) -> Job:
    with _create_lock:
        return _create_quote(body)


def create_handoff(body: dict) -> Job:
    with _create_lock:
        return _create_handoff(body)


def _create_quote(body: dict) -> Job:
    _require_keys(body, {"request_id", "service_address", "products"})
    request_id = body["request_id"]
    if not isinstance(request_id, str) or not ID_RE.match(request_id):
        raise ApiError(400, "invalid_request", fields=["request_id"])
    existing = jobs.find_request("quote", request_id)
    if existing:
        return existing
    order_ref = new_order_ref()
    payload = {"order_ref": order_ref, "mode": "quote", "service_address": body["service_address"],
               "products": body["products"]}
    _validate_with_automation(payload)
    _check_capacity()
    job = Job(id=secrets.token_urlsafe(18), kind="quote", request_id=request_id, order_ref=order_ref,
              service_address=body["service_address"], products=body["products"])
    jobs.add(job)
    runner.start(job, payload)
    log.info("job %s quote started", job.id)
    return job


def _create_handoff(body: dict) -> Job:
    _require_keys(body, {"request_id", "quote_job_id", "customer", "customer_confirmed"})
    request_id, quote_job_id = body["request_id"], body["quote_job_id"]
    if not isinstance(request_id, str) or not ID_RE.match(request_id):
        raise ApiError(400, "invalid_request", fields=["request_id"])
    if body["customer_confirmed"] is not True:
        raise ApiError(400, "not_confirmed")
    existing = jobs.find_request("handoff", request_id)
    if existing:
        return existing
    quote = jobs.get(quote_job_id) if isinstance(quote_job_id, str) else None
    if quote is None or quote.kind != "quote":
        raise ApiError(404, "quote_not_found")
    if quote.state != "done" or (quote.result or {}).get("status") != "quote_ready":
        raise ApiError(409, "quote_not_ready")
    # One hand-off per quote at a time; a successful one is final.
    for other in jobs.handoffs_for(quote.id):
        if other.state == "running" or (other.result or {}).get("status") == "handoff_ready":
            return other
    # Same order_ref, address and products as the quote, so the automation resumes the quoted portal session.
    payload = {"order_ref": quote.order_ref, "mode": "handoff", "customer_confirmed": True,
               "service_address": quote.service_address, "products": quote.products, "customer": body["customer"]}
    _validate_with_automation(payload)
    _check_capacity()
    job = Job(id=secrets.token_urlsafe(18), kind="handoff", request_id=request_id, order_ref=quote.order_ref,
              quote_job_id=quote.id)
    jobs.add(job)
    runner.start(job, payload)
    log.info("job %s handoff started (quote %s)", job.id, quote.id)
    return job


class Handler(BaseHTTPRequestHandler):
    server_version = "order-service"
    sys_version = ""

    def log_message(self, fmt: str, *args: Any) -> None:  # no client IPs or query strings in the log
        pass

    def _send(self, status: int, body: dict) -> None:
        data = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(data)
        log.info("%s %s -> %d", self.command, _route_label(self.path), status)

    def _authorised(self) -> bool:
        header = self.headers.get("Authorization", "")
        token = header[7:] if header.startswith("Bearer ") else ""
        return bool(token) and hmac.compare_digest(token.encode(), SERVICE_KEY.encode())

    def _json_body(self) -> dict:
        if "application/json" not in (self.headers.get("Content-Type") or ""):
            raise ApiError(415, "json_required")
        try:
            length = int(self.headers.get("Content-Length") or "0")
        except ValueError:
            raise ApiError(400, "invalid_request")
        if length <= 0 or length > MAX_BODY_BYTES:
            raise ApiError(413 if length > MAX_BODY_BYTES else 400, "invalid_request")
        try:
            body = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise ApiError(400, "invalid_request")
        if not isinstance(body, dict):
            raise ApiError(400, "invalid_request")
        rejected = sensitive_paths(body)
        if rejected:
            log.warning("request refused: sensitive fields %s (values not logged)", rejected)
            raise ApiError(422, "sensitive_data_rejected", fields=rejected)
        return body

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path == "/healthz":
            return self._send(200, {"ok": True})
        if not path.startswith("/v1/"):
            return self._send(404, {"error": "not_found"})
        if not self._authorised():
            return self._send(401, {"error": "unauthorised"})
        jobs.purge()
        m = re.fullmatch(r"/v1/jobs/([A-Za-z0-9_-]{16,64})", path)
        job = jobs.get(m.group(1)) if m else None
        if not job:
            return self._send(404, {"error": "not_found"})
        return self._send(200, job.view())

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path not in ("/v1/quotes", "/v1/handoffs"):
            return self._send(404, {"error": "not_found"})
        if not self._authorised():
            return self._send(401, {"error": "unauthorised"})
        jobs.purge()
        try:
            body = self._json_body()
            job = create_quote(body) if path == "/v1/quotes" else create_handoff(body)
        except ApiError as e:
            return self._send(e.status, e.body)
        return self._send(202, job.view())


def _route_label(path: str) -> str:
    p = urlparse(path).path
    return "/v1/jobs/<id>" if p.startswith("/v1/jobs/") else p


def main() -> None:
    global runner
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    if len(SERVICE_KEY) < MIN_KEY_LENGTH:
        sys.exit(f"ATTSPOC_SERVICE_KEY must be set to a random secret of at least {MIN_KEY_LENGTH} characters.")
    if WEBHOOK_URL:
        u = urlparse(WEBHOOK_URL)
        if u.scheme != "https" and u.hostname not in ("localhost", "127.0.0.1"):
            sys.exit("ATTSPOC_SPECIALIST_WEBHOOK_URL must be an https:// URL (it receives the portal link).")
    settings_cls = getattr(aoa, "Settings", None)
    if settings_cls is not None and not settings_cls().portal_url:
        log.warning("partner portal link not set (ATTSPOC_URL): every order will return not_configured")
    runner = Runner()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.daemon_threads = True

    def stop(*_: Any) -> None:
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    log.info("order-service listening on %s:%d (max %d queued jobs)", HOST, PORT, MAX_QUEUED)
    try:
        server.serve_forever()
    finally:
        runner.stop()
        server.server_close()


if __name__ == "__main__":
    main()
