export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: NavLink[] = [
  { href: "/internet", label: "Internet" },
  { href: "/wireless", label: "Wireless" },
  { href: "/phone", label: "Home Phone" },
  { href: "/deals", label: "Deals" },
  { href: "/check-availability", label: "Check Availability" },
];

export const mobileNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Internet",
    links: [
      { href: "/internet", label: "Home internet overview" },
      { href: "/internet/fiber", label: "AT&T Fiber" },
      { href: "/internet/internet-air", label: "AT&T Internet Air" },
    ],
  },
  {
    heading: "Wireless",
    links: [
      { href: "/wireless", label: "Wireless overview" },
      { href: "/wireless/plans", label: "Unlimited plans" },
      { href: "/wireless/deals", label: "Phone deals" },
      { href: "/wireless/switch", label: "Switch to AT&T" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/phone", label: "AT&T Phone (home phone)" },
      { href: "/deals", label: "All current deals" },
      { href: "/check-availability", label: "Check availability" },
      { href: "/moving", label: "Moving to a new home" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Internet",
    links: [
      { href: "/internet", label: "Home internet" },
      { href: "/internet/fiber", label: "AT&T Fiber plans" },
      { href: "/internet/internet-air", label: "AT&T Internet Air" },
      { href: "/check-availability", label: "Check availability" },
      { href: "/moving", label: "Moving to a new home" },
      { href: "/availability", label: "AT&T Fiber by state" },
    ],
  },
  {
    heading: "Wireless & Phone",
    links: [
      { href: "/wireless", label: "AT&T Wireless" },
      { href: "/wireless/plans", label: "Unlimited plans" },
      { href: "/wireless/deals", label: "Phone deals" },
      { href: "/wireless/switch", label: "Switch to AT&T" },
      { href: "/phone", label: "AT&T Phone (home phone)" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/deals", label: "Current deals" },
      { href: "/about", label: "About us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/sitemap-page", label: "Site map" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/do-not-sell-or-share", label: "Do Not Sell or Share My Personal Information" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/disclaimer", label: "Disclaimer" },
];
