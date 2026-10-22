import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { offersVerifiedAt } from "@/data/offers";

// Landing pages (/lp/*) are excluded: they are noindex templates for paid search.
const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/internet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/internet/fiber", priority: 0.9, changeFrequency: "weekly" },
  { path: "/internet/internet-air", priority: 0.9, changeFrequency: "weekly" },
  { path: "/wireless", priority: 0.9, changeFrequency: "weekly" },
  { path: "/wireless/plans", priority: 0.8, changeFrequency: "weekly" },
  { path: "/wireless/deals", priority: 0.8, changeFrequency: "weekly" },
  { path: "/wireless/switch", priority: 0.8, changeFrequency: "weekly" },
  { path: "/phone", priority: 0.7, changeFrequency: "monthly" },
  { path: "/deals", priority: 0.8, changeFrequency: "weekly" },
  { path: "/check-availability", priority: 0.7, changeFrequency: "monthly" },
  { path: "/moving", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/do-not-sell-or-share", priority: 0.3, changeFrequency: "yearly" },
  { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
  { path: "/sitemap-page", priority: 0.2, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: p.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${p.path}`,
    lastModified: offersVerifiedAt,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
