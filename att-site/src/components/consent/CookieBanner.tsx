"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/components/ui/AppLink";
import { readConsent, saveConsent } from "@/lib/consent";
import type { Locale } from "@/data/i18n";

const COPY = {
  en: {
    region: "Cookie consent",
    banner: "We use cookies for site analytics and advertising measurement. Choose whether to allow them.",
    policy: "Cookie Policy",
    acceptAll: "Accept all",
    reject: "Reject non-essential",
    manage: "Manage preferences",
    title: "Cookie preferences",
    desc: "Your choice is stored on this device for 12 months. You can change it at any time from the \u201cCookie settings\u201d link in the footer.",
    legend: "Cookie categories",
    necessary: "Strictly necessary",
    necessaryDesc: "Required for the site to work and to remember this choice. Always on.",
    analytics: "Analytics",
    analyticsDesc: "Measures page visits and site performance (Google Analytics).",
    ads: "Advertising",
    adsDesc: "Measures calls and enquiries that come from our ads (Google Ads), including click identifiers kept for up to 90 days.",
    save: "Save preferences",
    cancel: "Cancel",
    accepted: "All cookies accepted.",
    rejected: "Non-essential cookies rejected.",
    saved: "Cookie preferences saved.",
    settings: "Cookie settings",
  },
  es: {
    region: "Consentimiento de cookies",
    banner: "Usamos cookies para analizar el sitio y medir la publicidad. Elija si desea permitirlas.",
    policy: "Política de cookies (en inglés)",
    acceptAll: "Aceptar todas",
    reject: "Rechazar las no esenciales",
    manage: "Administrar preferencias",
    title: "Preferencias de cookies",
    desc: "Su elección se guarda en este dispositivo durante 12 meses. Puede cambiarla en cualquier momento desde el enlace \u201cConfiguración de cookies\u201d en el pie de página.",
    legend: "Categorías de cookies",
    necessary: "Estrictamente necesarias",
    necessaryDesc: "Necesarias para que el sitio funcione y para recordar esta elección. Siempre activas.",
    analytics: "Analítica",
    analyticsDesc: "Mide las visitas a las páginas y el rendimiento del sitio (Google Analytics).",
    ads: "Publicidad",
    adsDesc: "Mide las llamadas y consultas que provienen de nuestros anuncios (Google Ads), incluidos los identificadores de clic que se guardan hasta 90 días.",
    save: "Guardar preferencias",
    cancel: "Cancelar",
    accepted: "Se aceptaron todas las cookies.",
    rejected: "Se rechazaron las cookies no esenciales.",
    saved: "Se guardaron las preferencias de cookies.",
    settings: "Configuración de cookies",
  },
} as const;

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
export function CookieBanner({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale];
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
    // The dialog's checkboxes are synced from the stored choice in openDialog().
    if (readConsent()) markChosen(); // re-apply after React strict-mode remounts in development
    else document.documentElement.setAttribute("data-consent", "unset");
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
      <section className="cookie-banner" aria-label={t.region} data-testid="cookie-banner">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-sm text-ink">
            {t.banner}{" "}
            <Link href="/cookie-policy" className="link">
              {t.policy}
            </Link>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => choose({ analytics: true, ads: true }, t.accepted)}>
              {t.acceptAll}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose({ analytics: false, ads: false }, t.rejected)}>
              {t.reject}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={(e) => openDialog(e.currentTarget)}>
              {t.manage}
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
            choose({ analytics, ads }, t.saved);
          }}
        >
          <h2 id="consent-title" className="text-xl font-bold text-ink">
            {t.title}
          </h2>
          <p id="consent-desc" className="mt-2 text-sm text-ink-muted">
            {t.desc}
          </p>
          <fieldset className="mt-5 space-y-4">
            <legend className="sr-only">{t.legend}</legend>
            <div className="consent-row">
              <input id="c-necessary" type="checkbox" checked disabled aria-describedby="c-necessary-d" />
              <div>
                <label htmlFor="c-necessary" className="font-semibold text-ink">
                  {t.necessary}
                </label>
                <p id="c-necessary-d" className="text-sm text-ink-muted">
                  {t.necessaryDesc}
                </p>
              </div>
            </div>
            <div className="consent-row">
              <input id="c-analytics" type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} aria-describedby="c-analytics-d" />
              <div>
                <label htmlFor="c-analytics" className="font-semibold text-ink">
                  {t.analytics}
                </label>
                <p id="c-analytics-d" className="text-sm text-ink-muted">
                  {t.analyticsDesc}
                </p>
              </div>
            </div>
            <div className="consent-row">
              <input id="c-ads" type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} aria-describedby="c-ads-d" />
              <div>
                <label htmlFor="c-ads" className="font-semibold text-ink">
                  {t.ads}
                </label>
                <p id="c-ads-d" className="text-sm text-ink-muted">
                  {t.adsDesc}
                </p>
              </div>
            </div>
          </fieldset>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary btn-sm">
              {t.save}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose({ analytics: true, ads: true }, t.accepted)}>
              {t.acceptAll}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose({ analytics: false, ads: false }, t.rejected)}>
              {t.reject}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={closeDialog}>
              {t.cancel}
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
export function CookieSettingsLink({ className, locale = "en" }: { className?: string; locale?: Locale }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("att:open-consent"))}>
      {COPY[locale].settings}
    </button>
  );
}
