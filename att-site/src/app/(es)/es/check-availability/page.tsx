import { pageMetadata } from "@/lib/seo";
import { CallPanel, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { AvailabilityZip } from "@/components/forms/AvailabilityZip";
import { planSummaries } from "@/data/plan-summaries";

export const metadata = pageMetadata({
  title: "Verifique la disponibilidad de AT&T en su dirección",
  description: "Verifique la disponibilidad de AT&T Fiber, AT&T Internet Air, servicio inalámbrico y AT&T Phone. Ingrese su código postal y llame para confirmar el servicio.",
  path: "/es/check-availability",
});

export default function SpanishCheckAvailabilityPage() {
  return (
    <>
      <PageHeader
        trail={[
          { name: "Inicio", path: "/es" },
          { name: "Disponibilidad", path: "/es/check-availability" },
        ]}
        image="availabilityHero"
        eyebrow="Disponibilidad del servicio"
        title="Verifique el servicio de AT&T en su dirección"
        intro="AT&T confirma la disponibilidad del servicio para cada dirección. Ingrese su código postal para comenzar y luego llame para confirmar los servicios y precios disponibles."
      />
      <section className="section" aria-labelledby="es-avail-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Cómo funciona" id="es-avail-title" title="Dos pasos sencillos" />
            <ol className="mt-6 space-y-5">
              <li className="card p-5">
                <p className="font-bold text-ink">1. Ingrese su código postal</p>
                <p className="mt-1 text-ink-muted">Su código postal identifica el área de servicio de su consulta.</p>
              </li>
              <li className="card p-5">
                <p className="font-bold text-ink">2. Llame para confirmar su dirección</p>
                <p className="mt-1 text-ink-muted">Un especialista confirma los servicios, velocidades y precios de AT&amp;T disponibles en su dirección.</p>
              </li>
            </ol>
            <CheckList className="mt-8 text-ink-muted" items={["Sin obligación de compra", "AT&T Fiber, AT&T Internet Air, servicio inalámbrico de AT&T y AT&T Phone"]} />
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-ink">Ingrese su código postal</h2>
            <div className="mt-5">
              <AvailabilityZip placement="es-availability-zip" plans={planSummaries("es")} locale="es" />
            </div>
          </div>
        </div>
        <div className="container-x mt-12">
          <CallPanel id="es-avail-call" title="¿Prefiere hablar con un especialista?" text="Llame para confirmar la disponibilidad, los precios y las promociones en su dirección." placement="es-availability-panel" locale="es" />
        </div>
      </section>
    </>
  );
}
