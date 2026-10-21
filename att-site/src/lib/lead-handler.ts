/**
 * ============================================================================
 *  LEAD HANDLER — INTEGRATION POINT (frontend-only build)
 * ============================================================================
 * The site has no backend. `submitLead` is the single place to connect the lead form to a CRM,
 * email service or webhook. Until NEXT_PUBLIC_LEAD_ENDPOINT is set, nothing is transmitted and the
 * form shows the visitor a phone (tel:) and email (mailto:) fallback instead.
 *
 * To connect it later (see HANDOVER.md, "Connecting the lead form"):
 *   1. Set NEXT_PUBLIC_LEAD_ENDPOINT to an HTTPS endpoint that accepts JSON (POST).
 *   2. Make sure that endpoint sends CORS headers for https://authorizedinternetretailer.net.
 *   3. Rebuild and redeploy. No component changes are needed.
 * ============================================================================
 */
import { currentAttribution } from "./attribution";

export interface Lead {
  name: string;
  phone: string;
  zip: string;
  interest: string;
  consent: boolean;
  /** Exact consent wording the visitor agreed to (kept for TCPA records). */
  consentText: string;
  page: string;
  offerId?: string;
}

export type LeadResult = { status: "sent" } | { status: "not-connected" } | { status: "error"; message: string };

const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "";

export function leadEndpointConfigured(): boolean {
  return ENDPOINT.startsWith("https://");
}

export async function submitLead(lead: Lead): Promise<LeadResult> {
  if (!leadEndpointConfigured()) return { status: "not-connected" };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, attribution: currentAttribution(), submittedAt: new Date().toISOString() }),
    });
    return res.ok ? { status: "sent" } : { status: "error", message: `The request was not accepted (HTTP ${res.status}).` };
  } catch {
    return { status: "error", message: "The request could not be sent. Please check your connection." };
  }
}
