import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { ui } from "@/data/i18n";
import { CallPanel, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { ClockIcon, DocumentIcon, MapPinIcon, PhoneIcon } from "@/components/ui/Icons";

export const metadata = pageMetadata({
  title: "Contacto: hable con un especialista de AT&T",
  description: `Comuníquese con ${company.legalName}, distribuidor autorizado independiente de servicios de AT&T, por teléfono o correo electrónico.`,
  path: "/es/contact",
});

export default function SpanishContactPage() {
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Contacto", path: "/es/contact" },
        ]}
        image="contactHero"
        eyebrow="Contacto"
        title="Contáctenos"
        intro="Nuestros especialistas le ayudan con servicio nuevo de AT&T: AT&T Fiber, AT&T Internet Air, servicio inalámbrico de AT&T y AT&T Phone."
      />
      <section className="section" aria-labelledby="es-contact-title">
        <div className="container-x">
          <SectionHeading eyebrow="Datos de contacto" id="es-contact-title" title="Cómo comunicarse con nosotros" />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <li className="card flex gap-4 p-5">
              <PhoneIcon className="h-6 w-6 shrink-0 text-brand-strong" />
              <div>
                <p className="font-bold text-ink">Teléfono</p>
                <PhoneLink placement="es-contact-card" className="link text-lg font-semibold" />
              </div>
            </li>
            <li className="card flex gap-4 p-5">
              <ClockIcon className="h-6 w-6 shrink-0 text-brand-strong" />
              <div>
                <p className="font-bold text-ink">Horario (hora del Este)</p>
                <p className="text-ink-muted">{ui.es.hours}</p>
              </div>
            </li>
            <li className="card flex gap-4 p-5">
              <DocumentIcon className="h-6 w-6 shrink-0 text-brand-strong" />
              <div className="min-w-0">
                <p className="font-bold text-ink">Correo electrónico</p>
                <a href={`mailto:${company.email}`} className="link break-all">
                  {company.email}
                </a>
              </div>
            </li>
            <li className="card flex gap-4 p-5">
              <MapPinIcon className="h-6 w-6 shrink-0 text-brand-strong" />
              <div>
                <p className="font-bold text-ink">Dirección</p>
                <address className="not-italic text-ink-muted">
                  {company.legalName}
                  <br />
                  {company.streetAddress}
                  <br />
                  {company.locality}, {company.region} {company.postalCode}
                </address>
              </div>
            </li>
          </ul>
          <p className="mt-6 text-sm text-ink-muted">Atendemos solicitudes de servicio nuevo de AT&amp;T únicamente y no tenemos acceso a cuentas, facturas ni registros de servicio existentes de AT&amp;T.</p>
          <div className="mt-12">
            <CallPanel id="es-contact-call" title="Hable con un especialista hoy" text="Llame para conocer la disponibilidad, los precios y las promociones vigentes en su dirección. Sin obligación de compra." placement="es-contact-panel" locale="es" />
          </div>
        </div>
      </section>
    </>
  );
}
