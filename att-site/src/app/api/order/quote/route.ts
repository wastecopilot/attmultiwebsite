import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startQuote } from "@/lib/order/service";
import { hasExactKeys, isJobId, isRequestId, sensitivePaths, validOptionAnswers } from "@/lib/order/validation";
import { onlineOffer } from "@/lib/order/outcome";
import { portalNameForOffer } from "@/data/order-plans";

/**
 * Prices one of the att.com plans found at the address: { requestId, plansJobId, offerId, options } ->
 * { state: "started", jobId }. The offer id (offers.ts) is mapped here to the portal's plan name. With no
 * options the portal's option list comes back first (screen "options"); the visitor's answers then produce
 * the itemised quote. order-service checks that the plan is one of the plans that lookup returned.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body) return reply({ error: "invalid_request" }, 400);
  if (sensitivePaths(body).length) return reply({ error: "sensitive_data_rejected" }, 422);
  if (
    !hasExactKeys(body, ["requestId", "plansJobId", "offerId", "options"]) ||
    !isRequestId(body.requestId) ||
    !isJobId(body.plansJobId) ||
    typeof body.offerId !== "string" ||
    !validOptionAnswers(body.options)
  )
    return reply({ error: "invalid_request" }, 400);
  const planName = onlineOffer(body.offerId) ? portalNameForOffer(body.offerId) : undefined;
  if (!planName) return reply({ error: "invalid_request", fields: ["offerId"] }, 400);

  if (!serviceConfigured()) return reply({ state: "unavailable" }, 503);
  const res = await startQuote({ request_id: body.requestId, plans_job_id: body.plansJobId, plan_name: planName, options: body.options });
  if (!res.ok) {
    if (res.status === 400 || res.status === 404) return reply({ error: "invalid_request" }, 400);
    return reply({ state: res.status === 429 || res.status === 409 ? "busy" : "unavailable" }, 503);
  }
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
