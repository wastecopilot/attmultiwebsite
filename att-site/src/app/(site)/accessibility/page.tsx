import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { LegalPage } from "@/components/ui/LegalPage";
import { PhoneLink } from "@/components/PhoneLink";

export const metadata = pageMetadata({
  title: "Accessibility Statement | Authorized Internet Retailer",
  description: `${company.legalName} aims for this website to meet WCAG 2.2 Level AA. Read about the measures we take and how to report an accessibility barrier.`,
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" path="/accessibility" intro="We want everyone to be able to use this website, including people who rely on assistive technology.">
      <h2>1. Our standard</h2>
      <p>This website is designed to conform to the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA.</p>
      <h2>2. Measures we take</h2>
      <ul>
        <li>Semantic page structure with landmarks, one main heading per page and a logical heading order.</li>
        <li>A &ldquo;Skip to main content&rdquo; link and full keyboard operation, with a visible focus indicator.</li>
        <li>Text and background colors tested for at least 4.5:1 contrast (3:1 for large text and interface components).</li>
        <li>Form fields with visible labels and clear error messages.</li>
        <li>An accessible cookie dialog that traps focus while open, closes with Escape and returns focus afterwards.</li>
        <li>Motion effects that are switched off when your device requests reduced motion.</li>
        <li>Automated testing with axe-core and Lighthouse on every page before release.</li>
      </ul>
      <h2>3. Known limitations</h2>
      <p>The full AT&amp;T offer details are long legal texts quoted from AT&amp;T. They are provided as plain text inside expandable sections so they can be read with any screen reader.</p>
      <h2>4. Feedback and assistance</h2>
      <p>
        If you encounter a barrier, or need information from this website in another format, email <a href={`mailto:${company.email}`}>{company.email}</a> or call <PhoneLink placement="accessibility" /> (
        {company.hoursShort}). Please tell us the page address and the problem. We aim to respond within 5 business days.
      </p>
      <h2>5. Assessment</h2>
      <p>This statement was prepared on the effective date shown above, based on automated testing (axe-core, Lighthouse) and keyboard-navigation checks.</p>
    </LegalPage>
  );
}
