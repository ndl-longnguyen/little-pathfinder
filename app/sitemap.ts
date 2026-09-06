export const dynamic = 'force-static'

import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/levels", "/game", "/animal-home", "/stickers", "/free-play", "/settings"]
  return routes.map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1.0 : 0.8,
  }))
}
