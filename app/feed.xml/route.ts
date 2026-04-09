import { getServerSupabase } from "@/lib/supabase-core";

export async function GET() {
  const baseUrl = "https://cryptonewsai.vercel.app";
  const supabase = getServerSupabase();

  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, meta_description, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const rssItems = (posts || [])
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.meta_description || ""}]]></description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CryptoNewsAI — Latest Crypto News</title>
    <link>${baseUrl}</link>
    <description>Latest AI-generated crypto news and market analysis</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
