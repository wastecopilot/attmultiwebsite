import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Servicio de teléfono residencial AT&T Phone",
  description: "AT&T Phone, servicio digital de teléfono residencial: Unlimited North America por $24.99/mes durante 12 meses, International Plus II y AT&T Phone – Advanced.",
  path: "/es/phone",
});

export default function SpanishPhonePage() {
  const plans = offersBy("phone").filter((p) => p.price);
  const advanced = getOffer("phone-advanced");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Teléfono", path: "/es/phone" },
        ]}
        image="homePhoneHero"
        eyebrow="AT&T Phone"
        title="Servicio de teléfono residencial de AT&T"
        intro="AT&T Phone es un servicio digital de teléfono residencial que se presta a través de una conexión de internet de AT&T. Conserve su número y su teléfono, con más funciones de llamada."
      >
        <CheckList
          className="mt-6 text-ink"
          items={["Más de 25 funciones, como buzón de voz, identificador de llamadas, llamada en espera, desvío de llamadas, llamada de tres vías y bloqueo de llamadas", "Larga distancia ilimitada en EE. UU., México, Canadá y más", "Detección de ubicación E911"]}
        />
      </PageHeader>

      <section className="section" aria-labelledby="es-phone-plans-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Planes y precios"
            id="es-phone-plans-title"
            title="Planes de AT&T Phone"
            intro="Precios por 12 meses para clientes residenciales nuevos de AT&T Phone. AT&T Phone puede requerir una conexión de internet de AT&T con costo adicional."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
            {plans.map((p) => (
              <PlanCard key={p.id} offer={p} locale="es" />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="es-phone-advanced-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            eyebrow="AT&T Phone – Advanced"
            id="es-phone-advanced-title"
            title="Conserve su teléfono residencial actual"
            intro="En lugar de las líneas telefónicas tradicionales, AT&T Phone – Advanced usa la red celular de AT&T o una conexión de banda ancha para prestar el servicio telefónico residencial. Funciona con hasta seis dispositivos y es compatible con su teléfono actual. El precio mensual se confirma por teléfono."
          />
          <PromoCard offer={advanced} locale="es" />
        </div>
      </section>

      <section className="section" aria-labelledby="es-phone-power-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow="Información importante" id="es-phone-power-title" title="Cortes de energía y servicio 911" />
          <div className="card p-6" data-reveal>
            <p className="text-ink">
              AT&amp;T indica que el servicio AT&amp;T Phone se presta a través de una conexión de Protocolo de Internet y funciona con la electricidad de su hogar. A menos que usted proporcione la
              energía de respaldo necesaria, el servicio AT&amp;T Phone, incluidas las llamadas al 911, no funcionará durante un corte de energía.
            </p>
          </div>
        </div>
      </section>

      <CallBand placement="es-phone-band" title="Conserve su número de teléfono residencial" text="Llame para revisar los planes de AT&T Phone y el servicio de internet de AT&T disponible en su dirección." offerId={plans[0].id} value={plans[0].price?.amount} locale="es" />
      <JsonLd data={offersJsonLd(plans, "/es/phone")} />
    </>
  );
}
