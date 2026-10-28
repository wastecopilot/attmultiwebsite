"use client";

import { useSyncExternalStore } from "react";
import { ZipCheck } from "./ZipCheck";
import type { Locale } from "@/data/i18n";

export interface PlanSummary {
  title: string;
  service: string;
  price?: string;
  value: number;
}

const subscribe = () => () => {};
const readSearch = () => window.location.search;

/**
 * ZIP check for the availability pages. Visitors arriving from an Order Now button
 * (?intent=order&plan=<offer id>&source=<page>) get the ZIP field focused and their selected plan shown
 * below it; the plan id is carried into the ZIP check's tracking and its Call Now button.
 */
export function AvailabilityZip({ plans, placement, locale = "en" }: { plans: Record<string, PlanSummary>; placement: string; locale?: Locale }) {
  // Read after hydration (empty on the server) so the static page stays cacheable.
  const search = useSyncExternalStore(subscribe, readSearch, () => "");
  const params = new URLSearchParams(search);
  const ordering = params.get("intent") === "order";
  const planId = params.get("plan") ?? "";
  const plan = ordering ? plans[planId] : undefined;
  const es = locale === "es";
  return (
    <>
      <ZipCheck placement={placement} offerId={plan ? planId : undefined} value={plan?.value ?? 0} locale={locale} autoFocus={ordering} />
      {plan ? (
        <div className="mt-5 rounded-xl border border-border bg-brand-tint p-4" role="status">
          <p className="text-sm font-semibold text-ink-muted">{es ? "Plan seleccionado" : "Selected plan"}</p>
          <p className="mt-1 font-bold text-ink">{plan.title}</p>
          <p className="text-sm text-ink-muted">
            {plan.service}
            {plan.price ? ` · ${plan.price}` : ""}
          </p>
        </div>
      ) : null}
    </>
  );
}
