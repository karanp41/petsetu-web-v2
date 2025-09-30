import { fetchPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

// Generate an XML sitemap for Next.js App Router
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    "",
    "/search",
    "/profile",
    "/privacy-policy",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Dynamic post routes: fetch a reasonable number to keep sitemap light
  // If you have many posts, consider splitting into sitemap index files.
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const { results } = await fetchPosts({
      page: 1,
      limit: 200,
      postType: "all",
    });
    postEntries = results
      .filter((p) => p && p._id && p.isActive && !p.isDeleted)
      .map((p) => ({
        url: `${base}/post/${p._id}`,
        changeFrequency: "daily",
        priority: 0.8,
        lastModified: p.createdAt ? new Date(p.createdAt) : undefined,
      }));
  } catch {
    // If the API is unavailable during build, just return static routes
  }

  return [...routes, ...postEntries];
}
