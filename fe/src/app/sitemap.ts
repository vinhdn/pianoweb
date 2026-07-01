import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/san-pham`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [productsRes, categories] = await Promise.all([
      api.getProducts({ limit: "200" }),
      api.getCategories(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = productsRes.data.map((p) => ({
      url: `${base}/san-pham/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${base}/danh-muc/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
