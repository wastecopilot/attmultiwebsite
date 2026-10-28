import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startPlans } from "@/lib/order/service";
import { hasExactKeys, isRequestId, sensitivePaths, validateAddress, type AddressInput } from "@/lib/order/validation";

/**
 * Looks up the Internet plans the partner portal offers at an address:
 * { requestId, address } -> { state: "started", jobId }. Nothing is added to any cart. The lookup takes
 * about 30-60 seconds, so this only starts the job; the page polls /api/order/status.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body) return reply({ error: "invalid_request" }, 400);
  if (sensitivePaths(body).length) return reply({ error: "sensitive_data_rejected" }, 422);
  if (!hasExactKeys(body, ["requestId", "address"]) || !isRequestId(body.requestId)) return reply({ error: "invalid_request" }, 400);
  if (!hasExactKeys(body.address, ["street", "unit", "city", "state", "zip"])) return reply({ error: "invalid_request" }, 400);
  const { value: address, errors } = validateAddress(body.address as Partial<AddressInput>);
  if (Object.keys(errors).length) return reply({ error: "invalid_request", fields: Object.keys(errors) }, 400);

  if (!serviceConfigured()) return reply({ state: "unavailable" }, 503);
  const res = await startPlans({
    request_id: body.requestId,
    service_address: {
      street: address.street,
      unit_type: null,
      unit_number: address.unit || null,
      city: address.city,
      state: address.state,
      zip_code: address.zip,
    },
  });
  if (!res.ok) return reply({ state: res.status === 429 ? "busy" : "unavailable" }, 503);
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
