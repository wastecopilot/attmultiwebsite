import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { company, disclosure } from "@/data/site";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata = pageMetadata({
  title: "Terms of Use | Authorized Internet Retailer",
  description: `Terms that apply to your use of this website, operated by ${company.legalName}, an independent authorized retailer of AT&T services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" intro="Please read these terms before using this website. By using the website you agree to them.">
      <h2>1. About this website</h2>
      <p>
        This website is operated by {company.legalName}, {company.streetAddress}, {company.locality}, {company.region} {company.postalCode}. {disclosure.full}
      </p>

      <h2>2. Information about AT&amp;T services, prices and offers</h2>
      <ul>
        <li>Prices, promotions, plan features and terms shown on this website are published by AT&amp;T. They are shown with the date they were verified on att.com and may change at any time without notice.</li>
        <li>Prices exclude taxes and fees unless stated. Availability, speeds and eligibility depend on your address, credit approval and AT&amp;T&apos;s terms.</li>
        <li>AT&amp;T services are subject to AT&amp;T&apos;s own service agreements and policies, which govern any service you choose.</li>
        <li>Nothing on this website is an offer that can be accepted by using the website. A call-back request does not create a purchase or any obligation.</li>
      </ul>

      <h2>3. Use of the website</h2>
      <p>You agree to use the website lawfully, to provide accurate information in any form, and not to interfere with the website&apos;s operation or security, or to collect information from it by automated means.</p>

      <h2>4. Intellectual property and trademarks</h2>
      <p>{disclosure.trademark}</p>
      <p>The text, layout and original graphics of this website belong to {company.legalName} or its licensors. You may view and print pages for personal, non-commercial use.</p>

      <h2>5. Links to other websites</h2>
      <p>Links to att.com and other websites are provided for reference. We are not responsible for the content or practices of other websites.</p>

      <h2>6. Disclaimer of warranties</h2>
      <p>
        The website is provided &ldquo;as is&rdquo;. We work to keep information accurate and current but do not warrant that it is complete, error-free or up to date at the time you read it. The
        terms published by AT&amp;T prevail over any summary on this website.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>To the fullest extent permitted by law, {company.legalName} is not liable for indirect, incidental or consequential loss arising from use of the website.</p>

      <h2>8. Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookie-policy">Cookie Policy</Link> explain how we handle personal information.
      </p>

      <h2>9. Governing law</h2>
      <p>These terms are governed by the laws of the State of New York, without regard to its conflict-of-laws rules.</p>

      <h2>10. Changes</h2>
      <p>We may update these terms by posting a new version on this page with a new effective date.</p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </LegalPage>
  );
}
