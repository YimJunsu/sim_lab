import type { MetadataRoute } from "next";

const baseUrl = "https://simlab.kr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/fortune/result",
          "/menu/result",
          "/ideal-type/test",
          "/ideal-type/result",
          "/animal-test/test",
          "/animal-test/result",
          "/mymood/test-mymood",
          "/mymood/result-mymood",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}