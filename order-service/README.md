# order-service

This is the bridge between the website's **Order Now** flow and the AT&T SPOC order automation
(`att_order_automation.py`, kept in the private `attspoc AT&T` folder).

The automation drives a real Chromium browser in the partner portal. A quote takes about 45–60 seconds, and
the handoff reuses the quote's portal session from memory. It therefore **cannot run on Vercel**. It runs
here, in one long-lived process, and the website calls this service over HTTPS with a shared secret.

```
Website (Vercel) ──HTTPS + Bearer key──► order-service ──► att_order_automation ──► Chromium ──► partner portal
                                              └─► specialist queue (portal link + tasks, never sent to the website)
```

## What it does

| Endpoint | Purpose |
|---|---|
| `GET /healthz` | Liveness check, `{"ok": true}`. No key needed; reveals nothing else. |
| `POST /v1/plans` | Starts a plans job: `{request_id, service_address}`. The result (`plans_ready`) lists the Internet plans the portal offers at the address, as its plan cards show them. Nothing is added to the cart. |
| `POST /v1/quotes` | Starts a quote job for one of those plans: `{request_id, plans_job_id, plan_name, options}`. With `options: {}` the result is `options_required` with the portal's real option groups for that plan; with an answer for every group it is `quote_ready` with the portal cart. (The older `{request_id, service_address, products}` body still works.) |
| `POST /v1/handoffs` | Starts the handoff for a finished quote: `{request_id, quote_job_id, customer, customer_confirmed: true}` |
| `GET /v1/jobs/<job_id>` | Job state. When done, the automation's customer-safe result (`to_aria`) |

**How jobs behave**

- **Auth:** every `/v1` call needs `Authorization: Bearer <ATTSPOC_SERVICE_KEY>`.
- **Idempotency:** the same `request_id` returns the same job, so double clicks are safe.
- **Order reference:** the service creates the reference, for example `UW-7K3M9QX2`. It is used as the
  automation's `order_ref` and shown to the customer.
- **Handoff reuse:** the handoff reuses the quote's exact address, products and options, so the automation
  resumes the quoted portal session. The browser cannot change the order between quote and handoff.
- **One portal session per visitor:** a plans job keeps its portal page open (parked) on the Plans page; the
  quotes made from it continue there, and after `options_required` on the Options page. Parked pages close
  after 20 minutes unused (the portal's own limit is 30); a lost session restarts automatically with a fresh
  address check. A quote must name a plan that its plans job returned.
- **Public results** never contain the portal link, a session id or the portal's cart id (removed even if the
  automation returned them). Option texts meant for sales staff are removed by the website.

**What is refused (with `422`, values never logged)**

- Any field named like an SSN, date of birth, card, bank, PIN or password.
- Any value that looks like an SSN, card number or date of birth.
- Unknown fields (`400`).
- Requests over 16 KB.
- New jobs once `ATTSPOC_MAX_QUEUED` are running (`429`).

**Specialist queue.** On `handoff_ready`, the automation's `handoff` block goes to the specialist queue only.
It holds the portal link (a bearer link to the customer's prepared order), the contact details and the task
list. The queue has two parts:

- **Queue file:** one JSON file per order in `ATTSPOC_SPECIALIST_QUEUE_DIR`, owner-only permissions.
- **Notification (optional):** a POST of the same JSON to `ATTSPOC_SPECIALIST_WEBHOOK_URL`, for example an
  internal team-chat or CRM endpoint. It must be private and https, because it receives the portal link.

If neither part works, the result becomes `handoff_undelivered`. The website then asks the customer to call
instead of promising a follow-up. **The specialist must open the portal link within 30 minutes:** the portal
session expires after 30 minutes without activity.

## Settings

| Variable | Required | Meaning |
|---|---|---|
| `ATTSPOC_SERVICE_KEY` | yes | Shared secret, a random value of at least 32 characters. Set the **same** value as `ATTSPOC_SERVICE_KEY` on Vercel. |
| `ATTSPOC_URL` | yes | The partner portal link with the partner key (`https://www.attspoc.com/?key=…`). Secret: set it only here. |
| `PORT` | no (8080) | Listening port. Put HTTPS in front (platform TLS or a reverse proxy). |
| `ATTSPOC_SPECIALIST_QUEUE_DIR` | no (`specialist_queue`) | Private folder for handoff files |
| `ATTSPOC_SPECIALIST_WEBHOOK_URL` / `ATTSPOC_SPECIALIST_WEBHOOK_TOKEN` | no | Internal https endpoint (and bearer token) notified of each handoff |
| `ATTSPOC_MAX_QUEUED` | no (12) | Running jobs allowed before new ones get `429` |
| `ATTSPOC_ARTIFACT_DIR` | no | The automation's screenshot folder (private; delete on a schedule) |
| `ATTSPOC_MAX_CONCURRENCY` | no (3) | Orders the automation runs at once |
| `ATTSPOC_MODULE_DIR` | no | Folder holding `att_order_automation.py` if it is not next to `server.py` |

## Run it

**On a computer** (Python 3.11):

```
pip install -r requirements.txt
python -m playwright install chromium
set ATTSPOC_SERVICE_KEY=<random 32+ characters>
set ATTSPOC_MODULE_DIR=C:\path\to\attspoc AT&T
python server.py
```

`ATTSPOC_URL` can be left unset when `portal_url.txt` sits next to the automation module.

**With Docker** (any container host):

1. Copy `att_order_automation.py` from the private `attspoc AT&T` folder into this folder. It is gitignored
   and never committed.
2. Build the image: `docker build -t order-service .`
3. Run it:
   `docker run -p 8080:8080 -e ATTSPOC_SERVICE_KEY=… -e ATTSPOC_URL=… -v spoc-data:/data order-service`

**Hosting rules**

- **Exactly one instance.** The automation keeps the quote session and duplicate guard in memory.
- **At least 2 GB RAM.**
- **HTTPS** in front.
- **A private persistent volume** at `/data` for screenshots and the queue.

Suitable hosts include a small VM, Fly.io, Railway or Render (single instance), or Google Cloud Run with
min = max = 1 instance and CPU always allocated. Then set `ATTSPOC_SERVICE_URL` (this service's https
address) and `ATTSPOC_SERVICE_KEY` in Vercel.

## Tests

```
python -m unittest discover -s tests -v
```

The tests use `tests/stub_automation.py`, so no browser runs. They cover:

- the plans job and quotes made from it (options first, then the quote);
- refusal of sensitive data;
- idempotency;
- the job lifecycle;
- the handoff reusing the quote;
- the portal link staying in the queue file.

With `ATTSPOC_MODULE_DIR` set to the real module's folder, three extra tests confirm the automation's own
refusals. These also run without a browser.
