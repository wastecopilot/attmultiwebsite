import Link from "@/components/ui/AppLink";
import { PhoneLink } from "@/components/PhoneLink";

/** Fixed click-to-call bar on small screens (hidden from 1024px up, where the header shows the number). */
export function MobileCallBar() {
  return (
    <div className="mobile-call-bar" role="region" aria-label="Call or check availability">
      <PhoneLink placement="mobile-call-bar" className="btn btn-primary btn-sm" label="Call Now" />
      <Link href="/check-availability" className="btn btn-secondary btn-sm">
        Check Availability
      </Link>
    </div>
  );
}

