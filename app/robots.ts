import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/api/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/checkout", "/cart", "/login", "/signup"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
