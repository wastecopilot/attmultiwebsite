import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { LegalPage } from "@/components/ui/LegalPage";
import { OptOutButton } from "@/components/consent/OptOutButton";
import { PhoneLink } from "@/components/PhoneLink";

export const metadata = pageMetadata({
  title: "Do Not Sell or Share My Personal Information",
  description: "California (CCPA/CPRA) and other state privacy rights: how to opt out of the sale or sharing of personal information and targeted advertising on this website.",
  path: "/do-not-sell-or-share",
});

export default function DoNotSellPage() {
  return (
    <LegalPage
      title="Do Not Sell or Share My Personal Information"
      path="/do-not-sell-or-share"
      intro="Your right to opt out of the sale or sharing of personal information under the California Consumer Privacy Act, as amended by the CPRA, and similar state laws."
    >
      <h2>1. What we do</h2>
      <p>
        {company.legalName} does not sell personal information for money. When advertising cookies are allowed, Google Ads tags on this website receive identifiers and browsing information to
        measure our advertising. Under California law this may count as &ldquo;sharing&rdquo; for cross-context behavioral advertising, and in some states as targeted advertising.
      </p>
      <h2>2. Opt out on this browser</h2>
      <p>Use the button below to turn off advertising cookies on this browser. Analytics cookies keep your existing choice.</p>
      <OptOutButton />
      <h2>3. Global Privacy Control</h2>
      <p>If your browser sends a Global Privacy Control (GPC) signal, we treat it as a request to opt out of sale and sharing for that browser, and advertising cookies stay off by default.</p>
      <h2>4. Other ways to opt out</h2>
      <p>
        You can also change your choice with the &ldquo;Cookie settings&rdquo; link in the footer, email <a href={`mailto:${company.email}`}>{company.email}</a> with the subject &ldquo;Do Not Sell or
        Share&rdquo;, or call <PhoneLink placement="do-not-sell" />. An authorized agent may submit a request on your behalf.
      </p>
      <h2>5. Sensitive personal information</h2>
      <p>We do not collect sensitive personal information through this website and do not use personal information to infer characteristics about you.</p>
      <h2>6. No discrimination</h2>
      <p>We will not deny service, charge different prices or provide a different level of service because you exercised a privacy right.</p>
      <p>
        More detail: <Link href="/privacy">Privacy Policy</Link> · <Link href="/cookie-policy">Cookie Policy</Link>
      </p>
    </LegalPage>
  );
}
