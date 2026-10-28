import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startHandoff } from "@/lib/order/service";
import { hasExactKeys, isJobId, isRequestId, phoneDigits, sensitivePaths, validateCustomer, type CustomerInput } from "@/lib/order/validation";

/**
 * Submits the order request: { requestId, quoteJobId, customer, consent: true } -> { state: "started", jobId }.
 * Contact details only. Requests carrying SSN, date of birth, card or bank fields are refused.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body) return reply({ error: "invalid_request" }, 400);
  if (sensitivePaths(body).length) return reply({ error: "sensitive_data_rejected" }, 422);
  if (!hasExactKeys(body, ["requestId", "quoteJobId", "customer", "consent"]) || !isRequestId(body.requestId) || !isJobId(body.quoteJobId) || body.consent !== true)
    return reply({ error: "invalid_request" }, 400);
  if (!hasExactKeys(body.customer, ["firstName", "lastName", "phone", "email", "billingLanguage", "contactByPhone"]))
    return reply({ error: "invalid_request" }, 400);
  const { value: c, errors } = validateCustomer(body.customer as Partial<CustomerInput>);
  if (Object.keys(errors).length) return reply({ error: "invalid_request", fields: Object.keys(errors) }, 400);

  if (!serviceConfigured()) return reply({ state: "unavailable" }, 503);
  const res = await startHandoff({
    request_id: body.requestId,
    quote_job_id: body.quoteJobId,
    customer: {
      first_name: c.firstName,
      last_name: c.lastName,
      phone: phoneDigits(c.phone),
      email: c.email,
      billing_language: c.billingLanguage,
      contact_consent: c.contactByPhone === "yes",
    },
    customer_confirmed: true,
  });
  if (!res.ok) return reply({ state: res.status === 429 ? "busy" : "unavailable" }, 503);
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
