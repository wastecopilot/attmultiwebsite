import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { company } from "@/data/site";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";
import { AirIcon, FiberIcon, HomePhoneIcon, MapPinIcon, ShieldIcon, WirelessIcon } from "@/components/ui/Icons";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Fiber, Internet Air y planes inalámbricos",
  description: "Compare los planes de AT&T Fiber, AT&T Internet Air, servicio inalámbrico y AT&T Phone con un distribuidor autorizado independiente de servicios de AT&T.",
  path: "/es",
});

const services = [
  { href: "/es/internet/fiber", name: "AT&T Fiber", icon: FiberIcon, text: "Internet por fibra óptica con velocidades de carga y descarga iguales, de hasta 5 GIG donde esté disponible.", link: "Ver planes de AT&T Fiber" },
  { href: "/es/internet/internet-air", name: "AT&T Internet Air", icon: AirIcon, text: "Internet para el hogar a través de la red 5G de AT&T, con instalación por cuenta propia y sin contrato anual.", link: "Ver AT&T Internet Air" },
  { href: "/es/wireless", name: "AT&T Wireless", icon: WirelessIcon, text: "Planes Unlimited Your Way que se pueden combinar en todas las líneas de una misma cuenta.", link: "Ver planes ilimitados" },
  { href: "/es/phone", name: "AT&T Phone", icon: HomePhoneIcon, text: "Servicio digital de teléfono residencial a través de una conexión de internet de AT&T.", link: "Ver planes de AT&T Phone" },
];

export default function SpanishHomePage() {
  const featured = getOffer("fiber-1000");
  const promos = [getOffer("bundle-55-plus"), getOffer("bundle-fiber-wireless"), getOffer("wireless-switch-reward-800")];
  return (
    <>
      <PageHeader
        trail={[{ name: "Inicio", path: "/es" }]}
        image="homeHero"
        eyebrow="Distribuidor autorizado de servicios de AT&T"
        title="Planes de AT&T Fiber, Internet Air y servicio inalámbrico"
        intro="Compare los planes de internet para el hogar, servicio inalámbrico y teléfono residencial de AT&T, y hable con un especialista sobre los servicios y precios disponibles en su dirección."
        aside={<PlanCard offer={featured} featured badge="Oferta destacada" headingLevel="h2" locale="es" />}
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <PhoneLink placement="es-hero" offerId={featured.id} value={featured.price?.amount} className="btn btn-primary btn-lg" label="Llamar ahora" />
          <OrderButton placement="es-hero" offerId={featured.id} value={featured.price?.amount} planName={featured.title} className="btn btn-secondary btn-lg" locale="es" />
        </div>
      </PageHeader>

      <section className="border-y border-border bg-surface" aria-labelledby="es-zip-title">
        <div className="container-x grid gap-6 py-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="flex items-start gap-4">
            <MapPinIcon className="mt-1 h-7 w-7 shrink-0 text-brand-strong" />
            <div>
              <h2 id="es-zip-title" className="text-xl font-bold text-ink">
                Verifique la disponibilidad del servicio
              </h2>
              <p className="mt-1 text-ink-muted">AT&amp;T confirma el servicio para cada dirección. Ingrese su código postal para comenzar.</p>
            </div>
          </div>
          <ZipCheck placement="es-home-zip" locale="es" />
        </div>
      </section>

      <section className="section" aria-labelledby="es-services-title">
        <div className="container-x">
          <SectionHeading eyebrow="Servicios de AT&T" id="es-services-title" title="Internet, servicio inalámbrico y teléfono residencial" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <article key={s.href} className="card flex flex-col p-6" data-reveal>
                  <Icon className="h-9 w-9 text-brand-strong" />
                  <h3 className="mt-4 text-xl font-bold text-ink">{s.name}</h3>
                  <p className="mt-2 text-ink-muted">{s.text}</p>
                  <Link href={s.href} className="link mt-auto pt-5 font-semibold">
                    {s.link}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="es-deals-title">
        <div className="container-x">
          <SectionHeading eyebrow="Ofertas actuales" id="es-deals-title" title="Promociones actuales de AT&T" intro="AT&T fija los precios promocionales y los requisitos de elegibilidad. Los términos de cada oferta se muestran tal como AT&T los publica, en inglés." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {promos.map((p) => (
              <PromoCard key={p.id} offer={p} locale="es" />
            ))}
          </div>
          <p className="mt-6">
            <Link href="/es/deals" className="link font-semibold">
              Ver todas las ofertas
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="es-why-title">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Por qué elegirnos"
            id="es-why-title"
            title="Un especialista para internet, servicio inalámbrico y teléfono"
            intro={`${company.legalName} es un distribuidor autorizado independiente de servicios de AT&T. Nuestros especialistas revisan con usted los planes y promociones de AT&T y confirman los servicios disponibles en su dirección.`}
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: ShieldIcon, title: "Precios publicados por AT&T", text: "Los planes y promociones se presentan tal como AT&T los publica." },
              { icon: MapPinIcon, title: "Disponibilidad por dirección", text: "La disponibilidad del servicio se confirma para su dirección." },
              { icon: ShieldIcon, title: "Términos completos", text: "Cada precio se muestra con sus condiciones y los detalles de la oferta." },
              { icon: WirelessIcon, title: "Ahorro al combinar servicios", text: "Un plan inalámbrico elegible de AT&T reduce el precio de AT&T Fiber." },
            ].map((b) => (
              <li key={b.title} className="card p-5" data-reveal>
                <b.icon className="h-7 w-7 text-brand-strong" />
                <p className="mt-3 font-bold text-ink">{b.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallBand placement="es-home-band" title="¿Listo para revisar sus opciones?" text="Llame para conocer la disponibilidad, los precios y las promociones vigentes en su dirección. Sin obligación de compra." offerId={featured.id} value={featured.price?.amount} locale="es" />
      <JsonLd data={offersJsonLd([featured, ...promos], "/es")} />
    </>
  );
}
