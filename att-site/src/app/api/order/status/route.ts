import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { getJob, serviceConfigured } from "@/lib/order/service";
import { toOutcome } from "@/lib/order/outcome";
import { hasExactKeys, isJobId, validOptionAnswers } from "@/lib/order/validation";

/**
 * Progress of a plans lookup, quote or submission: { jobId, offerId, zip, options } ->
 * { state: "running" } | { state: "done", outcome }. `offerId` (offers.ts) and `options` are what the visitor
 * chose: the portal cart must hold exactly that, at the att.com price ("" and {} for a plans lookup). `zip`
 * (5 digits) only labels a price-mismatch log line.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (
    !body ||
    !hasExactKeys(body, ["jobId", "offerId", "zip", "options"]) ||
    !isJobId(body.jobId) ||
    typeof body.offerId !== "string" ||
    !/^[a-z0-9-]{0,80}$/.test(body.offerId) ||
    typeof body.zip !== "string" ||
    !/^(\d{5})?$/.test(body.zip) ||
    !validOptionAnswers(body.options)
  )
    return reply({ error: "invalid_request" }, 400);
  if (!serviceConfigured()) return reply({ state: "done", outcome: { screen: "failed", retryable: false, reason: "not_configured" } });

  const res = await getJob(body.jobId);
  if (!res.ok) {
    // Unknown or expired job: nothing to resume. Network trouble: the page may keep polling until its own limit.
    if (res.status === 404) return reply({ state: "done", outcome: { screen: "failed", retryable: false, reason: "job_not_found" } });
    return reply({ state: "unreachable" }, 503);
  }
  if (res.body.state !== "done") return reply({ state: "running" });
  return reply({ state: "done", outcome: toOutcome(res.body.result, { offerId: body.offerId, zip: body.zip, options: body.options }) });
}
