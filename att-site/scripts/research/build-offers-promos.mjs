// Wireless promotions for build-offers.mjs. Fine print = the full att.com "See offer details" dialog text.
export default function addPromos({ offers, pages, details, norm, line }) {
  const dlg = (slug, startsWith) => {
    const pools = [...(details[slug]?.dialogs ?? []).filter((d) => d.text).map((d) => d.text), ...(pages[slug]?.openedDialogs ?? []).map((d) => d.text)];
    const t = pools.map(norm).find((x) => x.startsWith(startsWith) || x.includes(startsWith));
    if (!t) throw new Error(`Dialog "${startsWith}" not found for ${slug}`);
    return t;
  };
  const drop = (text, ...prefixes) =>
    text
      .split(/\n\s*\n/)
      .filter((p) => !prefixes.some((pre) => p.trim().startsWith(pre)))
      .join("\n\n");

  const sw = details["switch"];

  offers.push({
    id: "wireless-switch-reward-800",
    category: "wireless-promo",
    title: "Up to $800 Reward Card Switcher Offer",
    headline: "Switch to AT&T and get up to $800 per line to help pay off your phone",
    price: null,
    conditions: ["Up to $800 via AT&T Visa Reward Card (redemption required)", "Requires port-in of a new line with eligible postpaid service", "Restrictions apply"],
    finePrint: dlg("switch", "Up to $800 Reward Card Switcher Offer Details"),
    sourceUrl: "https://www.att.com/wireless/switch-and-save/",
    retrievedAt: sw.retrievedAt,
    expiresAt: null,
  });

  offers.push({
    id: "wireless-byod-credit-360",
    category: "wireless-promo",
    title: "BYOD Bill Credit Switcher Offer",
    headline: "Bring your own smartphone and save up to $360 per line",
    price: null,
    conditions: [line("byod", "Req. port-in (transfer) of new line.", "other terms apply.")],
    finePrint: dlg("switch", "BYOD Bill Credit Switcher Offer:"),
    sourceUrl: "https://www.att.com/wireless/switch-and-save/",
    retrievedAt: sw.retrievedAt,
    expiresAt: null,
  });

  const newLine = line("switch", "New line discount: Limited time.", "AT&T Points Plus® Card from Citi.");
  offers.push({
    id: "wireless-new-line-5-off",
    category: "wireless-promo",
    title: "Unlimited Your Way new line discount",
    headline: "An extra $5/mo. off for 12 months for each new line you add, when you have 4 or more lines",
    price: null,
    conditions: ["Limited time", "Must maintain a minimum of 4 Unlimited Your Way plans", "Taxes and fees extra"],
    finePrint: newLine,
    features: [
      "AT&T Elite 2.0: $65.00/mo. per line when you get 4 lines (was $80.00)",
      "AT&T Premium 2.0: $45.00/mo. per line when you get 4 lines (was $60.00)",
      "AT&T Extra 2.0: $35.00/mo. per line when you get 4 lines (was $50.00)",
      "AT&T Value 2.0: $25.00/mo. per line when you get 4 lines (was $40.00)",
    ],
    sourceUrl: "https://www.att.com/wireless/switch-and-save/",
    retrievedAt: pages["switch"].retrievedAt,
    expiresAt: null,
  });

  offers.push({
    id: "wireless-trade-in-samsung-z8",
    category: "wireless-promo",
    title: "Samsung Galaxy Z Flip8 and Z Fold8 Series Trade-in Offer",
    headline: "Up to $1,200 off Galaxy Z Flip8, Z Fold8, Z Fold8 Ultra with an eligible trade-in",
    price: null,
    conditions: ["New and existing customers activating a new line or upgrading", "Requires eligible trade-in and eligible unlimited plan", "0% APR 36-month installment plan; credits over the installment term"],
    finePrint: dlg("switch", "Samsung Galaxy Z Flip8 and Z Fold8 Series Trade-in Offer"),
    sourceUrl: "https://www.att.com/wireless/switch-and-save/",
    retrievedAt: sw.retrievedAt,
    expiresAt: null,
  });

  offers.push({
    id: "wireless-trade-in-iphone-18",
    category: "wireless-promo",
    title: "iPhone 17, iPhone 18 Pro Series & iPhone Duo Trade-in Offer",
    headline: "Up to $1,200 off iPhone 18 Pro, iPhone 18 Pro Max and iPhone Duo with an eligible trade-in",
    price: null,
    conditions: ["New and existing customers activating a new line or upgrading", "Requires eligible trade-in and eligible unlimited plan", "0% APR 36-month installment plan; credits over the installment term"],
    finePrint: dlg("home", "iPhone 17, iPhone 18 Pro Series & iPhone Duo Trade-in Offer"),
    sourceUrl: "https://www.att.com/",
    retrievedAt: pages["home"].retrievedAt,
    expiresAt: null,
  });

  offers.push({
    id: "wireless-appreciation-savings",
    category: "wireless-promo",
    title: "AT&T Appreciation Savings℠",
    headline: "Military, veterans, retired responders, teachers and their families can save up to 20% on wireless",
    price: null,
    conditions: [line("bundles", "Req. proof of eligibility & eligible plan.", "Terms apply.")],
    finePrint: drop(dlg("bundles", "MILITARY & VETERAN:"), "The appearance of U.S. Department of War visual information"),
    sourceUrl: "https://www.att.com/bundles/",
    retrievedAt: details["bundles"].retrievedAt,
    expiresAt: null,
  });
}
