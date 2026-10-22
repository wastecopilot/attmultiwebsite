/**
 * AT&T Guarantee® terms shown on the Fiber, Internet Air and Wireless pages. Wording follows
 * https://www.att.com/why-att/guarantee/ (research/raw/pages-2026-10-22/guarantee.txt); the notes are AT&T's
 * own conditions, copied verbatim. Re-check together with offers.ts.
 */
export interface GuaranteeItem {
  title: string;
  text: string;
  note: string;
}

export const guarantee = {
  sourceUrl: "https://www.att.com/why-att/guarantee/",
  retrievedAt: "2026-10-22T10:29:55.599Z",
  intro: "The AT&T Guarantee® covers AT&T Fiber, AT&T Internet Air and AT&T wireless at no extra charge.",
  items: {
    internet: {
      title: "Home Internet Outage Credit",
      text: "If an AT&T Fiber or AT&T Internet Air network interruption lasts 20 minutes or more, AT&T credits a full day of service.",
      note: "Restrictions and exclusions apply.",
    },
    wireless: {
      title: "Wireless Outage Credit",
      text: "If there is a qualifying wireless network interruption, AT&T credits a full day of service.",
      note: "Credit for wireless downtime lasting 60 minutes or more caused by a single incident impacting 8 or more towers. Must be connected to impacted tower at onset of outage. Restrictions and exclusions apply.",
    },
    backup: {
      title: "Internet Backup Included",
      text: "With AT&T Fiber and an AT&T wireless plan, backup internet is included at no extra cost: if fiber goes down, wireless steps up.",
      note: "AT&T Fiber only. Requires eligible wireless service, activation, and power source; speeds vary; AT&T may slow data speeds if the network is busy. Backup may not be available in all locations.",
    },
  } satisfies Record<string, GuaranteeItem>,
};

export type GuaranteeKey = keyof typeof guarantee.items;
