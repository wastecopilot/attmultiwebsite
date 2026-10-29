/**
 * Server-side client for order-service (the HTTP wrapper around the SPOC order automation).
 * Imported only by the /api/order route handlers. The URL and key are server-side environment variables
 * (never NEXT_PUBLIC_*), so neither ever reaches the browser.
 *
 *   ATTSPOC_SERVICE_URL        https base URL of order-service
 *   ATTSPOC_SERVICE_KEY        shared secret (same value as on order-service)
 *   ATTSPOC_QUOTE_TIMEOUT_S    how long the order page waits for plans, options or a quote (default 240)
 *   ATTSPOC_HANDOFF_TIMEOUT_S  how long it waits for a submission or the credit check (default 330: the
 *                              automation itself stops after 300 s)
 */

export interface AutomationResult {
  status: string;
  order_ref?: string | null;
  message?: string;
  retryable?: boolean;
  data?: Record<string, unknown>;
}

export interface JobView {
  job_id: string;
  kind: "plans" | "quote" | "handoff" | "verify";
  state: "running" | "done";
  result?: AutomationResult;
}

export type ServiceResponse<T> = { ok: true; status: number; body: T } | { ok: false; status: number; body?: { error?: string } };

const REQUEST_TIMEOUT_MS = 15_000;

function serviceBase(): URL | null {
  const raw = process.env.ATTSPOC_SERVICE_URL ?? "";
  const key = process.env.ATTSPOC_SERVICE_KEY ?? "";
  if (!raw || key.length < 32) return null;
  try {
    const url = new URL(raw);
    // The key travels in a header, so only https (or a local service during development) is allowed.
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    return url.protocol === "https:" || (local && url.protocol === "http:") ? url : null;
  } catch {
    return null;
  }
}

export const serviceConfigured = () => serviceBase() !== null;

function seconds(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n >= 5 && n <= 900 ? n : fallback;
}

/** Waiting limits handed to the order page (not secret). */
export const orderTimeouts = () => ({
  quoteSeconds: seconds("ATTSPOC_QUOTE_TIMEOUT_S", 240),
  handoffSeconds: seconds("ATTSPOC_HANDOFF_TIMEOUT_S", 330),
});

async function call<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<ServiceResponse<T>> {
  const base = serviceBase();
  if (!base) return { ok: false, status: 0 };
  try {
    const res = await fetch(new URL(path.replace(/^\//, ""), base.href.endsWith("/") ? base : `${base.href}/`), {
      method,
      headers: { Authorization: `Bearer ${process.env.ATTSPOC_SERVICE_KEY}`, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const parsed = (await res.json().catch(() => undefined)) as T | undefined;
    return res.ok && parsed ? { ok: true, status: res.status, body: parsed } : { ok: false, status: res.status, body: parsed as { error?: string } };
  } catch {
    return { ok: false, status: 0 };
  }
}

export const startPlans = (body: { request_id: string; service_address: Record<string, unknown> }) =>
  call<JobView>("POST", "/v1/plans", body);

export const startQuote = (body: { request_id: string; plans_job_id: string; plan_name: string; options: Record<string, boolean | string> }) =>
  call<JobView>("POST", "/v1/quotes", body);

export const startHandoff = (body: { request_id: string; quote_job_id: string; customer: Record<string, unknown>; customer_confirmed: true }) =>
  call<JobView>("POST", "/v1/handoffs", body);

/** The customer's Account Validation answers (question key -> chosen answer), for the job that asked them. */
export const startVerify = (body: { request_id: string; questions_job_id: string; answers: Record<string, string> }) =>
  call<JobView>("POST", "/v1/verifications", body);

export const getJob = (jobId: string) => call<JobView>("GET", `/v1/jobs/${encodeURIComponent(jobId)}`);
