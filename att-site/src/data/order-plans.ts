/**
 * Online ordering (research/portal-flow.md). Plans, prices, promotions and options on the order page always
 * come live from the AT&T partner portal for the visitor's address; nothing in this file is ever shown as a
 * price. This file only links the site's marketing offers (offers.ts ids, used by the Order Now buttons) to
 * the plan names the portal lists, so the plan a visitor clicked can be preselected when the portal offers
 * it at their address. Names verified on the portal's Plans pages (2 Oct and 28 Oct 2026).
 */
export interface PortalPlanLink {
  offerId: string;
  /** The plan's name exactly as the portal's plan card lists it. */
  portalPlanName: string;
}

export const PORTAL_PLAN_LINKS: PortalPlanLink[] = [
  { offerId: "fiber-300", portalPlanName: "Internet 300 (Fiber 300)" },
  { offerId: "fiber-500", portalPlanName: "Internet 500 (Fiber 500)" },
  { offerId: "fiber-1000", portalPlanName: "Internet 1000 (Fiber 1 GIG)" },
  { offerId: "fiber-5000", portalPlanName: "Internet 5000 (Fiber 5 GIG)" },
  { offerId: "internet-air", portalPlanName: "AT&T Internet Air" },
];

/** Marketing offer categories whose Order Now opens the online Internet order flow. */
export const ONLINE_ORDER_CATEGORIES = new Set(["fiber", "internet-air"]);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export const portalNameForOffer = (offerId: string | null | undefined) =>
  PORTAL_PLAN_LINKS.find((l) => l.offerId === offerId)?.portalPlanName;

export const offerIdForPortalName = (name: string) => PORTAL_PLAN_LINKS.find((l) => norm(l.portalPlanName) === norm(name))?.offerId;

/** Same slug the order automation gives each plan (att_order_automation._plan_slug). */
export const portalPlanSlug = (name: string) => norm(name).replace(/ /g, "-");
