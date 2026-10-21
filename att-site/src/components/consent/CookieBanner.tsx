"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { readConsent, saveConsent } from "@/lib/consent";

/**
 * Cookie banner + preferences dialog.
 *
 * - The banner markup is server-rendered and shown by CSS only while no choice is stored
 *   (html[data-consent] is set by the head snippet), so it appears on first paint without layout
 *   shift and never blocks the page: it is a fixed, non-modal region.
 * - "Manage preferences" opens a native <dialog> (focus is moved into it, trapped, Esc closes it, and
 *   focus returns to the control that opened it).
 * - Every change calls gtag('consent','update', …) through saveConsent().
 * - The footer "Cookie settings" link dispatches `att:open-consent` to reopen the dialog.
 */
export function CookieBanner() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);
  const [status, setStatus] = useState("");

  const markChosen = () => document.documentElement.setAttribute("data-consent", "set");

  const openDialog = useCallback((opener: HTMLElement | null) => {
    const stored = readConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setAds(stored.ads);
    }
    openerRef.current = opener;
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      markChosen(); // re-apply after React strict-mode remounts in development
      setAnalytics(stored.analytics);
      setAds(stored.ads);
    } else {
      document.documentElement.setAttribute("data-consent", "unset");
    }
    const open = () => openDialog(document.activeElement as HTMLElement | null);
    window.addEventListener("att:open-consent", open);
    return () => window.removeEventListener("att:open-consent", open);
  }, [openDialog]);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const choose = (choice: { analytics: boolean; ads: boolean }, message: string) => {
    saveConsent(choice);
    markChosen();
    setAnalytics(choice.analytics);
    setAds(choice.ads);
    setStatus(message);
    if (dialogRef.current?.open) closeDialog();
  };

  return (
    <>
      <section className="cookie-banner" aria-label="Cookie consent" data-testid="cookie-banner">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-sm text-ink">
            We use cookies for site analytics and advertising measurement. Choose whether to allow them.{" "}
            <Link href="/cookie-policy" className="link">
              Cookie Policy
            </Link>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => choose({ analytics: true, ads: true }, "All cookies accepted.")}>
              Accept all
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose({ analytics: false, ads: false }, "Non-essential cookies rejected.")}>
              Reject non-essential
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={(e) => openDialog(e.currentTarget)}>
              Manage preferences
            </button>
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="consent-dialog"
        aria-labelledby="consent-title"
        aria-describedby="consent-desc"
        onClose={() => openerRef.current?.focus?.()}
      >
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            choose({ analytics, ads }, "Cookie preferences saved.");
          }}
        >
          <h2 id="consent-title" className="text-xl font-bold text-ink">
            Cookie preferences
          </h2>
          <p id="consent-desc" className="mt-2 text-sm text-ink-muted">
            Your choice is stored on this device for 12 months. You can change it at any time from the &ldquo;Cookie settings&rdquo; link in the footer.
          </p>
          <fieldset className="mt-5 space-y-4">
            <legend className="sr-only">Cookie categories</legend>
            <div className="consent-row">
              <input id="c-necessary" type="checkbox" checked disabled aria-describedby="c-necessary-d" />
              <div>
                <label htmlFor="c-necessary" className="font-semibold text-ink">
                  Strictly necessary
                </label>
                <p id="c-necessary-d" className="text-sm text-ink-muted">
                  Required for the site to work and to remember this choice. Always on.
                </p>
              </div>
            </div>
            <div className="consent-row">
              <input id="c-analytics" type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} aria-describedby="c-analytics-d" />
              <div>
                <label htmlFor="c-analytics" className="font-semibold text-ink">
                  Analytics
                </label>
                <p id="c-analytics-d" className="text-sm text-ink-muted">
                  Measures page visits and site performance (Google Analytics).
                </p>
              </div>
            </div>
            <div className="consent-row">
              <input id="c-ads" type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} aria-describedby="c-ads-d" />
              <div>
                <label htmlFor="c-ads" className="font-semibold text-ink">
                  Advertising
                </label>
                <p id="c-ads-d" className="text-sm text-ink-muted">
                  Measures calls and enquiries that come from our ads (Google Ads), including click identifiers kept for up to 90 days.
                </p>
              </div>
            </div>
          </fieldset>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary btn-sm">
              Save preferences
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose({ analytics: true, ads: true }, "All cookies accepted.")}>
              Accept all
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose({ analytics: false, ads: false }, "Non-essential cookies rejected.")}>
              Reject non-essential
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={closeDialog}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </>
  );
}

/** Footer link that reopens the preferences dialog. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("att:open-consent"))}>
      Cookie settings
    </button>
  );
}
