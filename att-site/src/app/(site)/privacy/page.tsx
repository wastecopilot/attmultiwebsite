import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { LegalPage } from "@/components/ui/LegalPage";
import { PhoneLink } from "@/components/PhoneLink";
import { CookieSettingsLink } from "@/components/consent/CookieBanner";

export const metadata = pageMetadata({
  title: "Privacy Policy | Authorized Internet Retailer",
  description: `How ${company.legalName} collects, uses and protects personal information on this website, and the privacy choices and rights available to you.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" intro={`This policy explains how ${company.legalName} handles personal information collected through this website.`}>
      <h2>1. Who we are</h2>
      <p>
        This website is operated by {company.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), {company.streetAddress}, {company.locality}, {company.region} {company.postalCode}. We are an
        independent authorized retailer of AT&amp;T services and are not AT&amp;T Inc. This policy covers this website only. It does not cover AT&amp;T&apos;s websites or services, which are
        governed by AT&amp;T&apos;s own privacy notices.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you give us</h3>
      <p>When you call or email us, we receive the information you choose to share, such as your name, telephone number, service address and the services you are interested in.</p>
      <h3>Information collected automatically</h3>
      <ul>
        <li>Technical information such as browser type, device type, pages viewed and the referring page, collected by Google Analytics when analytics cookies are allowed.</li>
        <li>Advertising measurement information, such as Google Ads click identifiers (gclid, gbraid, wbraid) and campaign (utm) parameters, used to measure calls and enquiries that come from our ads, when advertising cookies are allowed.</li>
        <li>Your cookie choice, stored in a strictly necessary cookie.</li>
      </ul>
      <p>The ZIP code entered in the availability tool stays in your browser and is not sent to us or to analytics providers.</p>

      <h2>3. How we use information</h2>
      <ul>
        <li>To respond to your enquiry about AT&amp;T services.</li>
        <li>To measure and improve the website and our advertising, subject to your cookie choices.</li>
        <li>To comply with legal obligations and to protect our rights.</li>
      </ul>
      <p>We do not use the information you provide for any purpose that is unrelated to your enquiry.</p>

      <h2>4. How we share information</h2>
      <ul>
        <li>
          <strong>Service providers</strong> that host the website, provide analytics and advertising measurement (Google), or store enquiries for us, under contracts that limit their use of the
          information.
        </li>
        <li>
          <strong>AT&amp;T</strong>, where needed for the AT&amp;T services you choose, limited to the information required.
        </li>
        <li>
          <strong>Authorities</strong> where the law requires it.
        </li>
      </ul>
      <p>
        Allowing advertising cookies may be considered &ldquo;sharing&rdquo; for cross-context behavioral advertising under California law. You can opt out at any time; see our{" "}
        <Link href="/do-not-sell-or-share">Do Not Sell or Share My Personal Information</Link> page. We do not sell personal information for money.
      </p>

      <h2>5. Cookies and your choices</h2>
      <p>
        Analytics and advertising cookies are controlled by the cookie banner and can be changed at any time with <CookieSettingsLink className="underline" />. Visitors in the European Economic
        Area, the United Kingdom and Switzerland see these cookies off by default. In the United States they are on by default and you can turn them off; a Global Privacy Control signal from your
        browser is honored as an opt-out of advertising cookies. Details are in our <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>

      <h2>6. Calls and email</h2>
      <p>
        When you call or email us, we use the details you provide only to respond to your enquiry about AT&amp;T services. You may ask us at any time not to contact you again by
        emailing <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>

      <h2>7. Retention</h2>
      <p>
        We keep enquiry information only as long as needed to respond to you and to meet legal and record-keeping obligations. Your cookie choice is stored for 12
        months; advertising click identifiers for up to 90 days.
      </p>

      <h2>8. Security</h2>
      <p>We use reasonable administrative, technical and physical safeguards. The website is served over HTTPS. No method of transmission or storage is completely secure.</p>

      <h2>9. Your privacy rights</h2>
      <p>
        Depending on where you live, including California and other U.S. states with consumer privacy laws, you may have the right to know, access, correct or delete personal information, to opt
        out of the sale or sharing of personal information and of targeted advertising, and not to be discriminated against for exercising these rights. To make a request, email{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a> or call <PhoneLink placement="privacy" />. We will verify your request using the information you provide and respond within the time
        required by law. You may use an authorized agent.
      </p>

      <h2>10. Children</h2>
      <p>This website is not directed to children under 16, and we do not knowingly collect their personal information.</p>

      <h2>11. Changes to this policy</h2>
      <p>We will post any changes on this page and update the effective date.</p>

      <h2>12. Contact</h2>
      <p>
        {company.legalName}, {company.streetAddress}, {company.locality}, {company.region} {company.postalCode} · <a href={`mailto:${company.email}`}>{company.email}</a>
      </p>
    </LegalPage>
  );
}
