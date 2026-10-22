import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Internet para el hogar de AT&T: Fiber e Internet Air",
  description: "Compare AT&T Fiber y AT&T Internet Air: velocidades, precios y condiciones publicadas por AT&T. Llame para confirmar el servicio en su dirección.",
  path: "/es/internet",
});

export default function SpanishInternetPage() {
  const fiber = getOffer("fiber-1000");
  const air = getOffer("internet-air");
  const bundle = getOffer("bundle-fiber-wireless");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Internet", path: "/es/internet" },
        ]}
        image="internetHero"
        eyebrow="Internet para el hogar de AT&T"
        title="Planes de internet para el hogar de AT&T"
        intro="AT&T ofrece dos servicios de internet para el hogar: AT&T Fiber, por cable de fibra óptica, y AT&T Internet Air, a través de la red 5G de AT&T. El servicio disponible depende de su dirección."
      />

      <section className="section" aria-labelledby="es-internet-compare-title">
        <div className="container-x">
          <SectionHeading eyebrow="Comparar" id="es-internet-compare-title" title="AT&T Fiber y AT&T Internet Air" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
            <PlanCard offer={fiber} locale="es" />
            <PlanCard offer={air} locale="es" />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
            <div>
              <h3 className="text-lg font-bold text-ink">AT&amp;T Fiber</h3>
              <CheckList className="mt-3 text-ink-muted" items={["Velocidades de carga y descarga iguales", "Hasta 5 GIG donde esté disponible", "Sin contrato anual ni límite de datos"]} />
              <Link href="/es/internet/fiber" className="link mt-4 inline-block font-semibold">
                Ver planes de AT&amp;T Fiber
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">AT&amp;T Internet Air</h3>
              <CheckList className="mt-3 text-ink-muted" items={["Internet para el hogar a través de la red 5G de AT&T", "Instalación por cuenta propia con el AT&T All-Fi Hub incluido", "Sin contrato anual"]} />
              <Link href="/es/internet/internet-air" className="link mt-4 inline-block font-semibold">
                Ver AT&amp;T Internet Air
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="es-internet-bundle-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading eyebrow="Combinar y ahorrar" id="es-internet-bundle-title" title="AT&T Fiber con servicio inalámbrico" intro="Con un plan inalámbrico ilimitado elegible de AT&T, AT&T descuenta el cargo mensual de AT&T Fiber." />
          <PromoCard offer={bundle} locale="es" />
        </div>
      </section>

      <CallBand placement="es-internet-band" title="Confirme el servicio en su dirección" text="Llame para confirmar si AT&T Fiber o AT&T Internet Air está disponible en su dirección." offerId={fiber.id} value={fiber.price?.amount} locale="es" />
      <JsonLd data={offersJsonLd([fiber, air], "/es/internet")} />
    </>
  );
}
