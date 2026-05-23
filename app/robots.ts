import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/features/portfolio/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/admin",
      userAgent: "*",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
