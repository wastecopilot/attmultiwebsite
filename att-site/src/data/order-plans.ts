/**
 * Plans that can be ordered online through the order automation (research/spoc-analysis.md §2.6).
 *
 * Only Internet plans are mapped in the automation; every other offer shows the "please call" message.
 * `portalPlanName` is the plan name exactly as the partner portal lists it (captured from the portal's
 * Plans pages on 28 Sep and 2 Oct 2026). `questions` are the option groups the portal is known to ask for
 * that plan, with the wording and prices the portal showed. Every question starts with nothing selected;
 * any other group the portal asks about comes back as `options_required` and is asked on the page.
 */
export interface OrderChoice {
  /** Sent to the automation: true = take the offered option, false = the portal's "Decline" choice. */
  value: boolean;
  label: string;
}

export interface OrderQuestion {
  /** Option group key used by the automation, e.g. "autopay", "wifi_extender". */
  key: string;
  legend: string;
  /** Explanatory text as the portal shows it (kept verbatim; marked lang="en"). */
  hint?: string;
  choices: OrderChoice[];
}

export interface OrderablePlan {
  offerId: string;
  productType: "internet";
  portalPlanName: string;
  questions: OrderQuestion[];
}

// Wording and prices below are the portal's own (Options pages captured 28 Sep and 2 Oct 2026). The quote
// step always shows the price the portal returns at that moment.
const AUTOPAY: OrderQuestion = {
  key: "autopay",
  legend: "AutoPay and paperless billing discount",
  hint: "$10/mo AutoPay and Paperless Billing discount with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. If you decline AutoPay and Paperless Billing your price will increase.",
  choices: [
    { value: true, label: "Yes, apply the AutoPay and paperless billing discount" },
    { value: false, label: "No, decline the discount" },
  ],
};

const WIFI_EXTENDER: OrderQuestion = {
  key: "wifi_extender",
  legend: "AT&T Extended Wi-Fi",
  hint: "Next-generation Wi-Fi experience, delivers more coverage to more corners of your home.",
  choices: [
    { value: true, label: "Add AT&T Extended Wi-Fi ($12/mo.)" },
    { value: false, label: "No, do not add Extended Wi-Fi" },
  ],
};

const EQUIPMENT: OrderQuestion = {
  key: "equip",
  legend: "Internet equipment",
  choices: [{ value: true, label: "AT&T Internet Equipment Fee ($0)" }],
};

const INSTALLATION: OrderQuestion = {
  key: "install",
  legend: "Installation",
  hint: "AT&T professional installation fee waived with speeds of 300MB or more",
  choices: [{ value: true, label: "AT&T Professional Install ($0)" }],
};

export const ORDERABLE_PLANS: OrderablePlan[] = [
  { offerId: "fiber-300", productType: "internet", portalPlanName: "Internet 300 (Fiber 300)", questions: [AUTOPAY, EQUIPMENT, INSTALLATION] },
  // Plan names verified on the portal's Fiber plans page; their option groups were not captured, so any
  // group beyond AutoPay is asked after the first quote attempt.
  { offerId: "fiber-500", productType: "internet", portalPlanName: "Internet 500 (Fiber 500)", questions: [AUTOPAY] },
  { offerId: "fiber-1000", productType: "internet", portalPlanName: "Internet 1000 (Fiber 1 GIG)", questions: [AUTOPAY] },
  { offerId: "fiber-5000", productType: "internet", portalPlanName: "Internet 5000 (Fiber 5 GIG)", questions: [AUTOPAY] },
  { offerId: "internet-air", productType: "internet", portalPlanName: "AT&T Internet Air", questions: [AUTOPAY, WIFI_EXTENDER] },
];

export function orderablePlan(offerId: string | null | undefined): OrderablePlan | undefined {
  return ORDERABLE_PLANS.find((p) => p.offerId === offerId);
}
