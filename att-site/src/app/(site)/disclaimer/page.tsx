import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { company, disclosure } from "@/data/site";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata = pageMetadata({
  title: "Disclaimer: Independent Authorized Retailer of AT&T",
  description: `This website is operated by ${company.legalName}, an independent authorized retailer of AT&T services. It is not AT&T's official website.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" path="/disclaimer" intro="Please read this disclosure about who operates this website and how AT&T information is presented.">
      <h2>1. Independent authorized retailer</h2>
      <p>
        <strong>{disclosure.full}</strong>
      </p>
      <p>
        {company.legalName} is not owned or operated by AT&amp;T Inc. or its affiliates. The official AT&amp;T website is <a href="https://www.att.com/" rel="nofollow noopener" target="_blank">att.com</a>
        <span className="sr-only"> (opens in a new tab)</span>.
      </p>

      <h2>2. Trademark notice</h2>
      <p>{disclosure.trademark}</p>
      <p>This website does not display AT&amp;T logos. Product names are used only to identify the AT&amp;T services discussed.</p>

      <h2>3. Prices, offers and availability</h2>
      <ul>
        <li>
          All prices and promotions are published by AT&amp;T and may change without notice.
        </li>
        <li>Prices exclude taxes and fees unless stated, and many require AutoPay and paperless billing, a minimum number of lines, an eligible plan or a trade-in, as described in each offer&apos;s details.</li>
        <li>Service availability, speeds and eligibility depend on your address and on AT&amp;T&apos;s terms. Speeds are based on a wired connection; actual speeds may vary.</li>
        <li>Where a summary on this website differs from AT&amp;T&apos;s published terms, AT&amp;T&apos;s terms apply.</li>
      </ul>

      <h2>4. No guarantee of results</h2>
      <p>Information on this website is general and is not a quote. The services, prices and discounts available to you are confirmed for your address before you make any decision.</p>

      <h2>5. Related policies</h2>
      <p>
        <Link href="/terms">Terms of Use</Link> · <Link href="/privacy">Privacy Policy</Link> · <Link href="/cookie-policy">Cookie Policy</Link>
      </p>
    </LegalPage>
  );
}
