"use client";

import { useState } from "react";
import { ZipCheck } from "./ZipCheck";
import { LeadForm } from "./LeadForm";

/** /check-availability: ZIP entry → call CTA and the lead form (ZIP prefilled). Never shows an availability result. */
export function AvailabilityFlow({ offerId, value }: { offerId: string; value: number }) {
  const [zip, setZip] = useState("");
  return (
    <div className="space-y-8">
      <div className="card p-6 md:p-8">
        <h2 className="text-2xl font-bold text-ink">Step 1: Your ZIP code</h2>
        <div className="mt-4">
          <ZipCheck placement="availability" offerId={offerId} value={value} onChecked={setZip} showFormLink={false} />
        </div>
      </div>
      <div id="request" className="scroll-mt-28">
        <LeadForm offerId={offerId} value={value} defaultZip={zip} heading="Step 2: Request a call back" headingLevel="h2" />
      </div>
    </div>
  );
}
