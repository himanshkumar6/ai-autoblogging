import { MetadataRoute } from "next";
import { getServerSupabase } from "@/lib/supabase-core";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cryptonewsai.vercel.app";
  const supabase = getServerSupabase();

  // 1. Fetch all published blog posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, created_at, focus_keyword")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // 2. Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/markets`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 3. Dynamic blog routes
  // Recent posts (last 7 days) get higher priority
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dynamicRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => {
    const postDate = new Date(post.created_at);
    const isRecent = postDate > sevenDaysAgo;

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: isRecent ? "daily" : "weekly",
      priority: isRecent ? 0.9 : 0.8, // Recent = higher priority
    };
  });

  return [...staticRoutes, ...dynamicRoutes];
}
