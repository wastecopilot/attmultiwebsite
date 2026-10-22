import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Planes inalámbricos ilimitados de AT&T",
  description: "Compare AT&T Elite 2.0, Premium 2.0, Extra 2.0 y Value 2.0: precios por línea con 4 líneas y con una sola línea, más las ofertas actuales para cambiarse a AT&T.",
  path: "/es/wireless",
});

export default function SpanishWirelessPage() {
  const plans = offersBy("wireless-plan");
  const promos = [getOffer("wireless-switch-reward-800"), getOffer("wireless-byod-credit-360"), getOffer("wireless-new-line-5-off")];
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Inalámbrico", path: "/es/wireless" },
        ]}
        image="wirelessHero"
        eyebrow="AT&T Unlimited Your Way"
        title="Planes inalámbricos ilimitados de AT&T"
        intro="Los cuatro planes Unlimited Your Way de AT&T se pueden combinar en cualquier línea de la misma cuenta. Los precios destacados son por línea con 4 líneas, después del descuento de $10/mes por línea por AutoPay y factura sin papel; el precio de una sola línea aparece en cada plan."
      >
        <CheckList
          className="mt-6 text-ink"
          items={["Llamadas, mensajes de texto y datos ilimitados en EE. UU., Canadá y México", "Mensajes de texto ilimitados desde EE. UU. a más de 200 países", "AT&T 5G (requiere plan y dispositivo compatibles)"]}
        />
      </PageHeader>

      <section className="section" aria-labelledby="es-wireless-plans-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Planes y precios"
            id="es-wireless-plans-title"
            title="Elija un plan para cada línea"
            intro="Los precios de una sola línea son las tarifas publicadas por AT&T antes del descuento por AutoPay y factura sin papel. Las condiciones y los detalles de cada oferta se muestran tal como AT&T los publica, en inglés."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((p) => (
              <PlanCard key={p.id} offer={p} featured={p.id === "wireless-elite-2"} badge={p.id === "wireless-elite-2" ? "El mejor plan de AT&T" : undefined} locale="es" />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="es-wireless-promos-title">
        <div className="container-x">
          <SectionHeading eyebrow="Ofertas actuales" id="es-wireless-promos-title" title="Ofertas para cambiarse a AT&T" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {promos.map((p) => (
              <PromoCard key={p.id} offer={p} locale="es" />
            ))}
          </div>
        </div>
      </section>

      <CallBand placement="es-wireless-band" title="Hable con un especialista en servicio inalámbrico" text="Llame para comparar planes para cada línea y confirmar las ofertas de AT&T que le corresponden." offerId={plans[0].id} value={plans[0].price?.amount} locale="es" />
      <JsonLd data={offersJsonLd(plans, "/es/wireless")} />
    </>
  );
}
