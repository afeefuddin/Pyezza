import type { MetadataRoute } from "next";

const u = (params?: { pathname?: string }) => {
  const url = new URL("https://pyezza.live");
  url.pathname = params?.pathname ?? "";

  return url.toString();
};

export default async function sitemap() {
  return [
    {
      url: u(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: u({ pathname: "/privacy" }),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ] satisfies MetadataRoute.Sitemap;
}
