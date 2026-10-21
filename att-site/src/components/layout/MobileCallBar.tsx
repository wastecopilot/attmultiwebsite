import Link from "next/link";
import { PhoneLink } from "@/components/PhoneLink";
import { env } from "@/lib/env";

/** Fixed click-to-call bar on small screens (hidden from 1024px up, where the header shows the number). */
export function MobileCallBar() {
  return (
    <div className="mobile-call-bar" role="region" aria-label="Call or check availability">
      <PhoneLink placement="mobile-call-bar" className="btn btn-primary btn-sm">
        <span>
          Call <MobileNumber />
        </span>
      </PhoneLink>
      <Link href="/check-availability" className="btn btn-secondary btn-sm">
        Check availability
      </Link>
    </div>
  );
}

function MobileNumber() {
  return <span className="whitespace-nowrap">{env.phoneDisplay}</span>;
}
