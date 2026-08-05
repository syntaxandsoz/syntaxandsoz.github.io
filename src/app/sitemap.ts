import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://syntaxandsoz.github.io"; // Change to your actual domain later if needed

  const tools = [
    "panopticon",
    "ghostpixel",
    "stegovault",
    "gpg",
    "b64",
    "airgap",
    "symphony-of-syntax",
    "privacy",
    "newsscraper",
    "metadatacleaner",
  ];

  const toolsUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...toolsUrls,
  ];
}
