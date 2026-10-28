import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { getJob, serviceConfigured } from "@/lib/order/service";
import { toOutcome } from "@/lib/order/outcome";
import { hasExactKeys, isJobId, validOptionAnswers } from "@/lib/order/validation";

/**
 * Progress of a quote or submission: { jobId, options } -> { state: "running" } | { state: "done", outcome }.
 * `options` are the visitor's own answers, used to confirm the portal selected nothing else.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body || !hasExactKeys(body, ["jobId", "options"]) || !isJobId(body.jobId) || !validOptionAnswers(body.options))
    return reply({ error: "invalid_request" }, 400);
  if (!serviceConfigured()) return reply({ state: "done", outcome: { screen: "failed", retryable: false, reason: "not_configured" } });

  const res = await getJob(body.jobId);
  if (!res.ok) {
    // Unknown or expired job: nothing to resume. Network trouble: the page may keep polling until its own limit.
    if (res.status === 404) return reply({ state: "done", outcome: { screen: "failed", retryable: false, reason: "job_not_found" } });
    return reply({ state: "unreachable" }, 503);
  }
  if (res.body.state !== "done") return reply({ state: "running" });
  return reply({ state: "done", outcome: toOutcome(res.body.result, body.options) });
}
