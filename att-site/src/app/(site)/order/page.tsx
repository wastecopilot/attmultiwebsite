import { pageMetadata } from "@/lib/seo";
import { offers } from "@/data/offers";
import { ORDERABLE_PLANS } from "@/data/order-plans";
import { orderTimeouts, serviceConfigured } from "@/lib/order/service";
import { PageHeader } from "@/components/ui/Sections";
import { OrderFlow } from "@/components/order/OrderFlow";

export const metadata = pageMetadata({
  title: "Order AT&T Internet Online | Authorized Retailer",
  description: "Choose your AT&T Internet plan, check the monthly price at your address and send your order request online.",
  path: "/order",
  noindex: true,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Online order flow. Reading searchParams makes this page render per request, so it is never cached
 * (Next.js sends Cache-Control: private, no-cache, no-store). It is noindex and not in the sitemap.
 */
export default async function OrderPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const planId = typeof sp.plan === "string" ? sp.plan : "";
  const rawSource = typeof sp.source === "string" ? sp.source : "";
  // Only a site path is passed on to analytics; anything else is reported as "other".
  const source = /^\/[A-Za-z0-9/_-]{0,100}$/.test(rawSource) ? rawSource : rawSource ? "other" : "direct";
  const orderable = ORDERABLE_PLANS.flatMap((plan) => {
    const offer = offers.find((o) => o.id === plan.offerId);
    return offer ? [{ offer, plan }] : [];
  });
  return (
    <>
      <PageHeader
        trail={[{ name: "Order", path: "/order" }]}
        eyebrow="Order Online"
        title="Order AT&T Internet"
        intro="Choose your plan, check the monthly price at your address and send your order request. A specialist completes the credit check and payment with you."
      />
      <section className="section" aria-label="Order steps">
        <div className="container-x">
          <OrderFlow
            initialOffer={offers.find((o) => o.id === planId) ?? null}
            orderable={orderable}
            source={source}
            onlineAvailable={serviceConfigured()}
            timeouts={orderTimeouts()}
          />
        </div>
      </section>
    </>
  );
}
