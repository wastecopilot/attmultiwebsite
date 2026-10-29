/**
 * Browser-side calls to the site's own /api/order routes (never to the order automation itself).
 * Personal data travels only in POST bodies, never in URLs.
 */
import type { Expected, OrderOutcome } from "@/lib/order/outcome";

// fetch() does not add next.config's basePath, so it is spelled out here.
const API = "/att/api/order";
const POLL_MS = 2500;

export type StartResult = { kind: "started"; jobId: string } | { kind: "unavailable" } | { kind: "rejected" };

export async function startJob(path: "plans" | "quote" | "submit" | "verify", body: unknown): Promise<StartResult> {
  try {
    const res = await fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { state?: string; jobId?: string };
    if (res.status === 202 && data.state === "started" && data.jobId) return { kind: "started", jobId: data.jobId };
    return res.status === 400 || res.status === 422 ? { kind: "rejected" } : { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => (clearTimeout(t), resolve()), { once: true });
  });

/**
 * Polls a job until it finishes, the deadline passes ("timeout") or the page goes away ("aborted").
 * `expected` is what the visitor chose; the server checks the portal's answer against it.
 */
export async function waitForJob(jobId: string, expected: Expected, timeoutSeconds: number, signal: AbortSignal): Promise<OrderOutcome | "timeout" | "aborted"> {
  const deadline = Date.now() + timeoutSeconds * 1000;
  while (Date.now() < deadline) {
    await sleep(POLL_MS, signal);
    if (signal.aborted) return "aborted";
    try {
      const res = await fetch(`${API}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, offerId: expected.offerId ?? "", zip: expected.zip ?? "", options: expected.options ?? {} }),
        cache: "no-store",
        signal,
      });
      const data = (await res.json().catch(() => ({}))) as { state?: string; outcome?: OrderOutcome };
      if (data.state === "done" && data.outcome) return data.outcome;
    } catch {
      if (signal.aborted) return "aborted";
      // A dropped connection is retried until the deadline.
    }
  }
  return "timeout";
}

export const newRequestId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
