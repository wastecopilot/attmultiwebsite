import type { ReactNode } from "react";
import { LEGAL_EFFECTIVE_DATE } from "@/data/site";
import { PageHeader } from "./Sections";

/** Shared layout for policy pages: breadcrumb, H1, effective date and readable prose. */
export function LegalPage({ title, path, intro, children }: { title: string; path: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <>
      <PageHeader
        trail={[{ name: title, path }]}
        title={title}
        intro={
          <>
            {intro ? <span className="block">{intro}</span> : null}
            <span className="mt-2 block text-base">Effective date: {LEGAL_EFFECTIVE_DATE}</span>
          </>
        }
      />
      <div className="container-x py-12 md:py-16">
        <div className="prose-legal">{children}</div>
      </div>
    </>
  );
}
