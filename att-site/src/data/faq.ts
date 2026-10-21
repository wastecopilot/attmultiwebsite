/**
 * Frequently asked questions. Every factual statement about AT&T services is taken from att.com
 * (source noted per item, retrieved 2026-10-21) and is listed in AUDIT.md.
 */
import { company } from "./site";

export interface FaqItem {
  q: string;
  a: string;
  /** att.com page the facts come from, or "site" for statements about this retailer. */
  source: string;
  topics: ("general" | "internet" | "fiber" | "air" | "wireless" | "phone" | "pricing")[];
}

export const faqs: FaqItem[] = [
  {
    q: "Is this AT&T's official website?",
    a: `No. This website is operated by ${company.legalName}, an independent authorized retailer of AT&T services. It is not AT&T's official website and ${company.legalName} is not AT&T Inc.`,
    source: "site",
    topics: ["general"],
  },
  {
    q: "Are the prices on this site the same as the prices on att.com?",
    a: "Every price and promotion on this site is copied from att.com and shows the date it was verified. Prices and offers are set by AT&T, exclude taxes and fees unless stated, and may change without notice. The price that applies to you is confirmed for your address before you decide.",
    source: "site",
    topics: ["general", "pricing"],
  },
  {
    q: "Do the AT&T Fiber prices require AutoPay and paperless billing?",
    a: "Yes. AT&T Fiber prices shown include a $10/mo. AutoPay & Paperless bill discount when AutoPay uses a bank account or the AT&T Points Plus® Card from Citi. AT&T reduces the discount to $5/mo. with a debit card and gives no discount with any other credit card. The discount starts within 2 bills.",
    source: "https://www.att.com/internet/fiber/",
    topics: ["fiber", "pricing"],
  },
  {
    q: "Is AT&T Fiber available at my address?",
    a: "AT&T confirms service for each street address, so a ZIP code or city alone cannot confirm availability. A specialist can confirm which AT&T services and prices are available at your address by phone, or you can request a call back.",
    source: "https://www.att.com/internet/fiber/",
    topics: ["fiber", "internet", "general"],
  },
  {
    q: "What is the difference between AT&T Fiber and AT&T Internet Air?",
    a: "AT&T Fiber is delivered to your home over fiber-optic cable, with speeds up to 5 GIG where available and equal upload and download speeds. AT&T Internet Air is home internet delivered over AT&T's 5G wireless network, set up by plugging in the included AT&T All-Fi Hub, with no annual contract.",
    source: "https://www.att.com/internet/",
    topics: ["internet", "fiber", "air"],
  },
  {
    q: "Is there an annual contract or a data cap on AT&T home internet?",
    a: "AT&T states that its fiber pricing has no annual contracts and no data caps, and that AT&T Internet Air has no annual contract and no overage fees. For Internet Air, AT&T may temporarily slow data speeds if the network is busy.",
    source: "https://www.att.com/internet/internet-service-plans/",
    topics: ["internet", "fiber", "air"],
  },
  {
    q: "Is there an installation fee for AT&T Fiber?",
    a: "AT&T's plan comparison lists $0 self or technician installation for AT&T Fiber, and AT&T's offer details note that an installation fee of up to $99, plus tax where applicable, may apply. The installation terms for your address are confirmed before you decide.",
    source: "https://www.att.com/internet/fiber/",
    topics: ["fiber", "pricing"],
  },
  {
    q: "How much can I save by combining AT&T Fiber with AT&T wireless?",
    a: "With an eligible AT&T unlimited wireless plan, AT&T discounts the monthly AT&T Fiber charge by $15/mo. on Internet 300 or 500, $20/mo. on Internet 1000 and $25/mo. on Internet 5000. The discount starts within 3 bills. AT&T describes this as savings of up to $420 a year on 5 GIG with eligible AutoPay and paperless billing.",
    source: "https://www.att.com/bundles/",
    topics: ["fiber", "wireless", "pricing"],
  },
  {
    q: "How much does AT&T Internet Air cost?",
    a: "AT&T lists AT&T Internet Air at $55/mo. plus taxes and fees, with AutoPay and paperless billing required. It is not available in all areas.",
    source: "https://www.att.com/internet/internet-service-plans/",
    topics: ["air", "pricing"],
  },
  {
    q: "Which AT&T unlimited wireless plans are available?",
    a: "AT&T currently offers four Unlimited Your Way plans: AT&T Elite 2.0, AT&T Premium 2.0, AT&T Extra 2.0 and AT&T Value 2.0. With 4 lines they are $70, $50, $40 and $30 per line per month respectively, after the AutoPay and paperless bill discount. Each line can be on a different plan.",
    source: "https://www.att.com/plans/unlimited-data-plans/",
    topics: ["wireless", "pricing"],
  },
  {
    q: "Can I keep my phone number if I switch to AT&T?",
    a: "Yes. AT&T allows you to transfer an eligible number from your current carrier, and its current switching offers, such as the up to $800 per line reward card and the bring-your-own-phone bill credit, require transferring a number to a new line.",
    source: "https://www.att.com/wireless/switch-and-save/",
    topics: ["wireless"],
  },
  {
    q: "What does AT&T Phone cost?",
    a: "AT&T lists AT&T Phone Unlimited North America at $24.99/mo. for 12 months for new residential AT&T Phone customers, then the prevailing rate (currently $34.99/mo.). AT&T Phone may require an AT&T internet connection at additional cost.",
    source: "https://www.att.com/home-phone/",
    topics: ["phone", "pricing"],
  },
  {
    q: "Can you help with an existing AT&T account, bill or service issue?",
    a: `${company.legalName} handles enquiries about new AT&T service only. We do not have access to existing AT&T accounts, bills or service records and cannot make changes to them.`,
    source: "site",
    topics: ["general"],
  },
  {
    q: "How is the information I submit used?",
    a: "Details you submit through the call-back form are used only to respond to your enquiry about AT&T services, as described in our Privacy Policy. You can withdraw your consent to be contacted at any time.",
    source: "site",
    topics: ["general"],
  },
];

export const faqsFor = (topic: FaqItem["topics"][number]) => faqs.filter((f) => f.topics.includes(topic));
