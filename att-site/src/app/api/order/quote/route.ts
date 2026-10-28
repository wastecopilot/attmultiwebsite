import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startQuote } from "@/lib/order/service";
import { orderablePlan } from "@/data/order-plans";
import { hasExactKeys, isRequestId, sensitivePaths, validateAddress, validOptionAnswers, type AddressInput } from "@/lib/order/validation";

/**
 * Starts a quote: { requestId, plan, options, address } -> { state: "started", jobId }.
 * The automation needs about 45-60 seconds, so this only starts the job; the page polls /api/order/status.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body) return reply({ error: "invalid_request" }, 400);
  if (sensitivePaths(body).length) return reply({ error: "sensitive_data_rejected" }, 422);
  if (!hasExactKeys(body, ["requestId", "plan", "options", "address"]) || !isRequestId(body.requestId) || !validOptionAnswers(body.options))
    return reply({ error: "invalid_request" }, 400);
  if (!hasExactKeys(body.address, ["street", "unit", "city", "state", "zip"])) return reply({ error: "invalid_request" }, 400);
  const plan = orderablePlan(typeof body.plan === "string" ? body.plan : "");
  if (!plan) return reply({ error: "plan_not_orderable" }, 400);
  const { value: address, errors } = validateAddress(body.address as Partial<AddressInput>);
  if (Object.keys(errors).length) return reply({ error: "invalid_request", fields: Object.keys(errors) }, 400);
  // Every known question needs the visitor's own answer (a choice title when the portal asked again); nothing is defaulted.
  const answers = body.options;
  if (plan.questions.some((q) => typeof answers[q.key] !== "string" && !q.choices.some((c) => c.value === answers[q.key])))
    return reply({ error: "invalid_request", fields: ["options"] }, 400);

  if (!serviceConfigured()) return reply({ state: "unavailable" }, 503);
  const res = await startQuote({
    request_id: body.requestId,
    service_address: {
      street: address.street,
      unit_type: null,
      unit_number: address.unit || null,
      city: address.city,
      state: address.state,
      zip_code: address.zip,
    },
    products: [{ product_type: plan.productType, plan_name: plan.portalPlanName, options: answers }],
  });
  if (!res.ok) return reply({ state: res.status === 429 ? "busy" : "unavailable" }, 503);
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
