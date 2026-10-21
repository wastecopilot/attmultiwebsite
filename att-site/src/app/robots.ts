import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Served at /att/robots.txt. Search engines only read the domain-root /robots.txt, so the root file
// must also allow /att/ and list this sitemap (see HANDOVER.md, "Deploying under /att").
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/att/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
