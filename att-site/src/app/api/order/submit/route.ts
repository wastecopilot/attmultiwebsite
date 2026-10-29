import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startHandoff } from "@/lib/order/service";
import { hasExactKeys, isJobId, isRequestId, phoneDigits, sensitivePaths, validateCreditCheck, validateCustomer, type CreditCheckInput, type CustomerInput } from "@/lib/order/validation";

/**
 * Submits the order request: { requestId, quoteJobId, customer, creditCheck, consent: true } -> { state: "started", jobId }.
 * Contact details, plus the date of birth and SSN the customer entered for AT&T's credit check (only inside
 * `creditCheck`, with consent). They go straight to order-service, which types them into the portal's
 * credit-check fields; they are never logged, stored or echoed here. Card and bank fields are refused, and so
 * is anything SSN- or date-of-birth-like outside `creditCheck`.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body) return reply({ error: "invalid_request" }, 400);
  const { creditCheck, ...rest } = body;
  if (sensitivePaths(rest).length) return reply({ error: "sensitive_data_rejected" }, 422);
  if (!hasExactKeys(body, ["requestId", "quoteJobId", "customer", "creditCheck", "consent"]) || !isRequestId(body.requestId) || !isJobId(body.quoteJobId) || body.consent !== true)
    return reply({ error: "invalid_request" }, 400);
  if (!hasExactKeys(creditCheck, ["dateOfBirth", "ssn", "consent"])) return reply({ error: "invalid_request" }, 400);
  const { value: cc, errors: ccErrors } = validateCreditCheck(creditCheck as Partial<CreditCheckInput>);
  if (Object.keys(ccErrors).length) return reply({ error: "invalid_request", fields: Object.keys(ccErrors) }, 400);
  if (!hasExactKeys(body.customer, ["firstName", "lastName", "phone", "email", "confirmEmail", "billingLanguage", "contactByPhone"]))
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
      contact_consent: c.contactByPhone,
      credit_check: { consent: true, date_of_birth: cc.dateOfBirth, ssn: cc.ssn },
    },
    customer_confirmed: true,
  });
  if (!res.ok) return reply({ state: res.status === 429 ? "busy" : "unavailable" }, 503);
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
