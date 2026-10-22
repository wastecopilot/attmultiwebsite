import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PlanCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Internet Air: internet 5G para el hogar",
  description: "AT&T Internet Air: internet para el hogar a través de la red 5G de AT&T por $55/mes con AutoPay y factura sin papel. Llame para confirmar el servicio.",
  path: "/es/internet/internet-air",
});

export default function SpanishInternetAirPage() {
  const air = getOffer("internet-air");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Internet", path: "/es/internet" },
          { name: "AT&T Internet Air", path: "/es/internet/internet-air" },
        ]}
        image="airHero"
        eyebrow="AT&T Internet Air"
        title="AT&T Internet Air: internet 5G para el hogar"
        intro="Internet para el hogar a través de la red 5G de AT&T. Se instala conectando el AT&T All-Fi Hub incluido, sin visita de técnico y sin contrato anual. La disponibilidad depende de la cobertura 5G de AT&T en su dirección."
        aside={<PlanCard offer={air} featured headingLevel="h2" locale="es" />}
      />

      <section className="section" aria-labelledby="es-air-fit-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading eyebrow="Resumen del plan" id="es-air-fit-title" title="Un plan sencillo" />
          <CheckList
            className="text-ink"
            items={[
              "Internet para el hogar ilimitado, sin límite de datos, a través de la red 5G de AT&T",
              "Instalación por cuenta propia con el AT&T All-Fi Hub incluido",
              "Sin contrato anual",
              "AutoPay y factura sin papel requeridos; no disponible en todas las áreas",
              "AT&T puede reducir temporalmente la velocidad de datos si la red está congestionada",
            ]}
          />
        </div>
      </section>

      <CallBand placement="es-air-band" title="Confirme AT&T Internet Air en su dirección" text="Llame para confirmar si AT&T Internet Air o AT&T Fiber está disponible en su dirección." offerId={air.id} value={air.price?.amount} locale="es" />
      <JsonLd data={offersJsonLd([air], "/es/internet/internet-air")} />
    </>
  );
}
