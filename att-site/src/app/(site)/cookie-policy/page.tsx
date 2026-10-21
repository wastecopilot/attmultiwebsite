import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { LegalPage } from "@/components/ui/LegalPage";
import { CookieSettingsLink } from "@/components/consent/CookieBanner";

export const metadata = pageMetadata({
  title: "Cookie Policy | Authorized Internet Retailer",
  description: "Which cookies this website uses for necessary functions, analytics and advertising measurement, how long they last, and how to change your choice.",
  path: "/cookie-policy",
});

const cookies = [
  { name: "att_consent", provider: "This website", category: "Strictly necessary", purpose: "Stores your cookie choice.", duration: "12 months" },
  { name: "att_attr", provider: "This website", category: "Advertising", purpose: "Keeps Google Ads click identifiers and campaign parameters so a later call or enquiry can be attributed to the ad.", duration: "90 days" },
  { name: "_ga, _ga_*", provider: "Google Analytics", category: "Analytics", purpose: "Distinguishes visitors and sessions to measure site use.", duration: "Up to 2 years" },
  { name: "_gcl_au, _gcl_aw, _gcl_gb", provider: "Google Ads", category: "Advertising", purpose: "Measures calls and conversions that follow an ad click.", duration: "Up to 90 days" },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" path="/cookie-policy" intro="This policy describes the cookies and similar technologies used on this website and how you can control them.">
      <h2>1. Your choice</h2>
      <p>
        The cookie banner lets you accept all cookies, reject non-essential cookies, or choose by category. Your choice is stored for 12 months. You can change it at any time with{" "}
        <CookieSettingsLink className="underline" />, which also appears in the footer of every page.
      </p>
      <h2>2. Defaults by region</h2>
      <ul>
        <li>European Economic Area, United Kingdom and Switzerland: analytics and advertising cookies are off until you allow them.</li>
        <li>United States and other regions: analytics and advertising cookies are on by default and you can turn them off. If your browser sends a Global Privacy Control signal, advertising cookies are off by default.</li>
      </ul>
      <p>We use Google Consent Mode. When a category is off, Google tags do not set cookies for that category and send only cookieless signals as described by Google.</p>
      <h2>3. Cookies we use</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Cookie</th>
            <th scope="col">Provider</th>
            <th scope="col">Category</th>
            <th scope="col">Purpose</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((c) => (
            <tr key={c.name}>
              <td>
                <code>{c.name}</code>
              </td>
              <td>{c.provider}</td>
              <td>{c.category}</td>
              <td>{c.purpose}</td>
              <td>{c.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>4. Browser controls</h2>
      <p>You can also block or delete cookies in your browser settings. Blocking strictly necessary cookies means the website cannot remember your choice.</p>
      <h2>5. More information</h2>
      <p>
        See our <Link href="/privacy">Privacy Policy</Link> and <Link href="/do-not-sell-or-share">Do Not Sell or Share My Personal Information</Link>. Questions:{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </LegalPage>
  );
}
