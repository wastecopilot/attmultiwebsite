import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { getJob, serviceConfigured } from "@/lib/order/service";
import { toOutcome } from "@/lib/order/outcome";
import { hasExactKeys, isJobId, validOptionAnswers } from "@/lib/order/validation";

/**
 * Progress of a plans lookup, quote or submission: { jobId, planName, options } ->
 * { state: "running" } | { state: "done", outcome }. `planName` and `options` are what the visitor chose,
 * used to confirm the portal cart holds exactly that and nothing else ("" and {} for a plans lookup).
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (
    !body ||
    !hasExactKeys(body, ["jobId", "planName", "options"]) ||
    !isJobId(body.jobId) ||
    typeof body.planName !== "string" ||
    body.planName.length > 120 ||
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
  return reply({ state: "done", outcome: toOutcome(res.body.result, { planName: body.planName, options: body.options }) });
}
