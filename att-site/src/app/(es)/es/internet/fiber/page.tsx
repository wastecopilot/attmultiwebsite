import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Planes de internet AT&T Fiber y precios",
  description: "Planes de AT&T Fiber desde $50/mes con AutoPay: Internet 300, 500, 1000 y 5000, con precio menor al combinarlos con un plan inalámbrico elegible de AT&T.",
  path: "/es/internet/fiber",
});

export default function SpanishFiberPage() {
  const tiers = offersBy("fiber");
  const bundle = getOffer("bundle-fiber-wireless");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Internet", path: "/es/internet" },
          { name: "AT&T Fiber", path: "/es/internet/fiber" },
        ]}
        image="fiberHero"
        eyebrow="AT&T Fiber"
        title="Planes de internet AT&T Fiber"
        intro="Internet por fibra óptica con velocidades de carga y descarga iguales, de hasta 5 GIG donde esté disponible. El precio es menor al combinarlo con un plan inalámbrico elegible de AT&T."
      >
        <CheckList
          className="mt-6 text-ink"
          items={["Velocidades de carga y descarga iguales", "Sin contrato anual ni límite de datos", "Wi-Fi AT&T All-Fi incluido en todos los planes", "Precio menor con un plan inalámbrico ilimitado elegible de AT&T"]}
        />
      </PageHeader>

      <section className="section" aria-labelledby="es-fiber-plans-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Planes y precios"
            id="es-fiber-plans-title"
            title="Velocidades de AT&T Fiber"
            intro="Los precios incluyen el descuento de $10/mes por AutoPay y factura sin papel. Internet 500, 1000 y 5000 incluyen un descuento de 12 meses para clientes nuevos; después se aplica la tarifa regular. Las condiciones y los detalles de cada oferta se muestran tal como AT&T los publica, en inglés."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t) => (
              <PlanCard key={t.id} offer={t} featured={t.id === "fiber-1000"} badge={t.id === "fiber-1000" ? "Destacado" : undefined} locale="es" />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="es-fiber-bundle-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            eyebrow="Combinar y ahorrar"
            id="es-fiber-bundle-title"
            title="AT&T Fiber con servicio inalámbrico"
            intro="Con un plan inalámbrico ilimitado elegible de AT&T, AT&T descuenta $15/mes en Internet 300 o 500, $20/mes en Internet 1000 y $25/mes en Internet 5000. El descuento comienza dentro de 3 facturas."
          />
          <PromoCard offer={bundle} locale="es" />
        </div>
      </section>

      <CallBand placement="es-fiber-band" title="Confirme AT&T Fiber en su dirección" text="La disponibilidad de AT&T Fiber se confirma por dirección. Llame para confirmar las velocidades y los precios disponibles." offerId="fiber-1000" value={70} locale="es" />
      <JsonLd data={offersJsonLd(tiers, "/es/internet/fiber")} />
    </>
  );
}
