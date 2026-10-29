import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { offers } from "@/data/offers";
import { ONLINE_ORDER_CATEGORIES, portalNameForOffer } from "@/data/order-plans";
import { orderTimeouts, serviceConfigured } from "@/lib/order/service";
import { partnerOrderUrl } from "@/lib/order/partner";
import { PageHeader } from "@/components/ui/Sections";
import { OrderFlow } from "@/components/order/OrderFlow";

export const metadata = pageMetadata({
  title: "Order AT&T Internet Online | Authorized Retailer",
  description: "See the AT&T Internet plans and prices available at your address, choose your options and send your order request online.",
  path: "/order",
  noindex: true,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Online order flow. Reading searchParams makes this page render per request, so it is never cached
 * (Next.js sends Cache-Control: private, no-cache, no-store). It is noindex and not in the sitemap.
 * With ATTSPOC_PARTNER_URL set, every visitor is sent straight to AT&T's partner order page instead.
 */
export default async function OrderPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const partner = partnerOrderUrl();
  if (partner) redirect(partner);
  const rawPlan = typeof sp.plan === "string" ? sp.plan : "";
  // Only an offer id or a portal plan id (letters, digits, dashes) is used; anything else is ignored.
  const planId = /^[a-z0-9-]{2,80}$/.test(rawPlan) ? rawPlan : "";
  const initialOffer = offers.find((o) => o.id === planId) ?? null;
  // The att.com plans (offers.ts) that can be ordered online: the portal only says which are available.
  const onlinePlans = offers.filter((o) => o.price && portalNameForOffer(o.id));
  const rawSource = typeof sp.source === "string" ? sp.source : "";
  // Only a site path is passed on to analytics; anything else is reported as "other".
  const source = /^\/[A-Za-z0-9/_-]{0,100}$/.test(rawSource) ? rawSource : rawSource ? "other" : "direct";
  return (
    <>
      <PageHeader
        trail={[{ name: "Order", path: "/order" }]}
        eyebrow="Order Online"
        title="Order AT&T Internet"
        intro="Enter your service address to see which AT&T Internet plans are available there, choose your options and complete your order."
      />
      <section className="section" aria-label="Order steps">
        <div className="container-x">
          <OrderFlow
            initialOffer={initialOffer}
            plans={onlinePlans}
            planParam={planId}
            planOrderableOnline={!initialOffer || ONLINE_ORDER_CATEGORIES.has(initialOffer.category)}
            source={source}
            onlineAvailable={serviceConfigured()}
            timeouts={orderTimeouts()}
          />
        </div>
      </section>
    </>
  );
}
