import { pageMetadata } from "@/lib/seo";
import { offers } from "@/data/offers";
import type { OfferCategory } from "@/data/offer-types";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Ofertas y promociones actuales de AT&T",
  description: "Promociones actuales de AT&T en internet para el hogar, servicio inalámbrico y teléfono residencial, con las condiciones y los detalles de cada oferta.",
  path: "/es/deals",
});

const groups: { title: string; id: string; categories: OfferCategory[]; intro: string }[] = [
  { title: "AT&T Fiber", id: "es-deals-fiber", categories: ["fiber"], intro: "Incluye el descuento de 12 meses de AT&T en Internet 500, 1000 y 5000, y el precio menor con un plan inalámbrico elegible de AT&T." },
  { title: "Paquetes y complementos", id: "es-deals-bundle", categories: ["bundle", "add-on"], intro: "Ahorre en AT&T Fiber con un plan inalámbrico elegible, aproveche el paquete AT&T 55+ o mejore su equipo Wi-Fi." },
  { title: "AT&T Internet Air", id: "es-deals-air", categories: ["internet-air"], intro: "Internet 5G para el hogar con un plan sencillo." },
  { title: "Planes inalámbricos de AT&T", id: "es-deals-wireless-plans", categories: ["wireless-plan"], intro: "Por línea con 4 líneas, después del descuento por AutoPay y factura sin papel." },
  { title: "Promociones inalámbricas de AT&T", id: "es-deals-wireless-promos", categories: ["wireless-promo"], intro: "Ofertas para cambiarse, descuentos por línea nueva, ofertas de canje de teléfonos y ahorros para grupos." },
  { title: "AT&T Phone", id: "es-deals-phone", categories: ["phone"], intro: "Precios por 12 meses para clientes residenciales nuevos de AT&T Phone, y AT&T Phone – Advanced." },
];

export default function SpanishDealsPage() {
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Ofertas", path: "/es/deals" },
        ]}
        image="dealsHero"
        eyebrow="Ofertas actuales"
        title="Ofertas y promociones actuales de AT&T"
        intro="Promociones de AT&T en internet para el hogar, servicio inalámbrico y teléfono residencial. Las condiciones y los requisitos de elegibilidad aparecen con cada oferta, tal como AT&T los publica, en inglés."
      />
      {groups.map((g, i) => {
        const list = offers.filter((o) => g.categories.includes(o.category));
        return (
          <section key={g.id} className={`section ${i % 2 ? "section-alt" : ""}`} aria-labelledby={g.id}>
            <div className="container-x">
              <SectionHeading id={g.id} title={g.title} intro={g.intro} />
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {list.map((o) => (o.price && o.category !== "add-on" ? <PlanCard key={o.id} offer={o} locale="es" /> : <PromoCard key={o.id} offer={o} locale="es" />))}
              </div>
            </div>
          </section>
        );
      })}
      <CallBand placement="es-deals-band" title="Revise las ofertas con un especialista" text="Llame para confirmar qué promociones de AT&T están disponibles en su dirección." locale="es" />
      <JsonLd data={offersJsonLd(offers, "/es/deals")} />
    </>
  );
}
