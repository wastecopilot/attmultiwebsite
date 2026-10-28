/** Small helpers shared by the /api/order route handlers. */

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" };
const MAX_BODY_BYTES = 8 * 1024;

export const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: HEADERS });

/** Parsed JSON object, or null when the body is missing, too large, not JSON or not an object. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return null;
  const text = await request.text().catch(() => "");
  if (!text || text.length > MAX_BODY_BYTES) return null;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Refuses requests a browser marks as cross-site. Together with the JSON-only body (which a cross-site page
 * cannot send without a CORS preflight this API never approves) this keeps the order API to the site's own
 * order page, including when the domain reaches the site through a rewrite.
 */
export const sameOrigin = (request: Request) => request.headers.get("sec-fetch-site") !== "cross-site";
