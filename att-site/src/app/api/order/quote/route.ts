import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startQuote } from "@/lib/order/service";
import { hasExactKeys, isJobId, isRequestId, sensitivePaths, validOptionAnswers } from "@/lib/order/validation";

/**
 * Prices one of the plans found at the address: { requestId, plansJobId, planName, options } ->
 * { state: "started", jobId }. With no options the portal's real option list comes back first
 * (screen "options"); the visitor's explicit answers then produce the itemised quote. order-service
 * checks that planName is one of the plans that lookup returned.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body) return reply({ error: "invalid_request" }, 400);
  if (sensitivePaths(body).length) return reply({ error: "sensitive_data_rejected" }, 422);
  if (
    !hasExactKeys(body, ["requestId", "plansJobId", "planName", "options"]) ||
    !isRequestId(body.requestId) ||
    !isJobId(body.plansJobId) ||
    typeof body.planName !== "string" ||
    !/^[A-Za-z0-9&()+.,' -]{2,120}$/.test(body.planName) ||
    !validOptionAnswers(body.options)
  )
    return reply({ error: "invalid_request" }, 400);

  if (!serviceConfigured()) return reply({ state: "unavailable" }, 503);
  const res = await startQuote({ request_id: body.requestId, plans_job_id: body.plansJobId, plan_name: body.planName, options: body.options });
  if (!res.ok) {
    if (res.status === 400 || res.status === 404) return reply({ error: "invalid_request" }, 400);
    return reply({ state: res.status === 429 || res.status === 409 ? "busy" : "unavailable" }, 503);
  }
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
