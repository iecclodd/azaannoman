import type { MetadataRoute } from "next";
import { infoPages } from "@/data/pages";
import { CONTENT_UPDATED, RESUME_PATH, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/", ...Object.keys(infoPages).map((slug) => `/${slug}`)].map((path) => ({
      url: new URL(path, SITE_URL).href, lastModified: CONTENT_UPDATED,
    })),
    { url: `${SITE_URL}${RESUME_PATH}`, lastModified: "2026-10-04" },
  ];
}
