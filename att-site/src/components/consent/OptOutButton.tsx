"use client";

import { useEffect, useState } from "react";
import { readConsent, saveConsent } from "@/lib/consent";

/** One-click opt-out of sale/sharing (turns advertising cookies off for this browser, keeps the analytics choice). */
export function OptOutButton() {
  const [optedOut, setOptedOut] = useState<boolean | null>(null);
  useEffect(() => {
    const c = readConsent();
    setOptedOut(c ? !c.ads : false);
  }, []);
  return (
    <div className="not-prose mt-4 rounded-xl border border-border bg-surface-alt p-5">
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => {
          const c = readConsent();
          saveConsent({ analytics: c ? c.analytics : true, ads: false });
          setOptedOut(true);
        }}
      >
        Opt out of sale or sharing on this browser
      </button>
      <p className="mt-3 text-sm text-ink-muted" role="status" aria-live="polite">
        {optedOut === null ? "" : optedOut ? "Status: you have opted out on this browser. Advertising cookies are off." : "Status: advertising cookies are currently allowed on this browser."}
      </p>
    </div>
  );
}
