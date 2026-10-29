import { reply, readJson, sameOrigin } from "@/lib/order/http";
import { serviceConfigured, startVerify } from "@/lib/order/service";
import { hasExactKeys, isJobId, isRequestId, validIdentityAnswers } from "@/lib/order/validation";

/**
 * The customer's answers to AT&T's Account Validation questions (asked from their credit file during the credit
 * check): { requestId, questionsJobId, answers } -> { state: "started", jobId }. `answers` maps each question key
 * (q1, q2, ...) to the choice picked; order-service accepts only the choices AT&T offered. Never logged or stored here.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  const body = await readJson(request);
  if (!body || !hasExactKeys(body, ["requestId", "questionsJobId", "answers"]) || !isRequestId(body.requestId) || !isJobId(body.questionsJobId) || !validIdentityAnswers(body.answers))
    return reply({ error: "invalid_request" }, 400);
  if (!serviceConfigured()) return reply({ state: "unavailable" }, 503);
  const res = await startVerify({ request_id: body.requestId, questions_job_id: body.questionsJobId, answers: body.answers });
  if (!res.ok) return res.status === 400 ? reply({ error: "invalid_request" }, 400) : reply({ state: res.status === 429 ? "busy" : "unavailable" }, 503);
  return reply({ state: "started", jobId: res.body.job_id }, 202);
}
