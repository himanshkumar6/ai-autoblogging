import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const topics = [
  "Bitcoin price prediction",
  "Top trending cryptocurrencies today",
  "Best side hustles in 2026",
  "AI tools for making money",
  "Personal finance tips for beginners"
];

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  // We use GET for cron jobs usually, but Vercel Cron sends GET requests.
  try {
    // 1. Pick a random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const baseUrl = new URL(request.url).origin;
    
    // 2. Generate Blog Post
    console.log(`[Auto-Run] Generating post for topic: ${topic}`);
    let postResponse = await fetch(`${baseUrl}/api/generate-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    
    // Simple Retry Logic for Claude
    if (!postResponse.ok) {
      console.warn(`[Auto-Run] First attempt failed. Retrying in 10s...`);
      await sleep(10000); // Wait 10 seconds to avoid rate limits
      postResponse = await fetch(`${baseUrl}/api/generate-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      if (!postResponse.ok) throw new Error("Failed to generate post after retry");
    }

    const postData = await postResponse.json();
    const slug = generateSlug(postData.title);
    
    // 3. Save to Supabase
    console.log(`[Auto-Run] Saving post to DB with slug: ${slug}`);
    
    // Ensure slug doesn't conflict by adding random string if exists
    // (For MVP, just append date if conflict is found, but let's try direct insert first)
    const { data: insertedPost, error: insertError } = await supabase
      .from('posts')
      .insert([
        { 
          title: postData.title, 
          slug: slug, 
          content: postData.content, 
          meta_description: postData.meta 
        }
      ])
      .select()
      .single();
      
    if (insertError) {
      // Very basic duplicate handling: append random numbers
      if (insertError.code === '23505') { // Unique violation
        const newSlug = `${slug}-${Math.floor(Math.random() * 10000)}`;
        const { error: retryError } = await supabase
          .from('posts')
          .insert([
            { title: postData.title, slug: newSlug, content: postData.content, meta_description: postData.meta }
          ]);
        if (retryError) throw new Error(`DB Insert Error after retry: ${retryError.message}`);
      } else {
        throw new Error(`DB Insert Error: ${insertError.message}`);
      }
    }

    // 4. Generate Tweet
    console.log(`[Auto-Run] Generating tweet`);
    const postUrl = `${baseUrl}/blog/${slug}`;
    const tweetResponse = await fetch(`${baseUrl}/api/generate-tweet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: postData.content, url: postUrl })
    });

    if (!tweetResponse.ok) throw new Error("Failed to generate tweet");
    const tweetData = await tweetResponse.json();

    // 5. Post to X (Twitter) using local python API route
    console.log(`[Auto-Run] Posting to X via Twikit endpoint`);
    try {
      const xResponse = await fetch(`${baseUrl}/api/post-tweet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet: tweetData.tweet })
      });

      if (!xResponse.ok) {
        const errorText = await xResponse.text();
        console.error(`[Auto-Run] Failed to post to X: ${errorText}`);
        // We do not throw here so we don't crash the whole cron if only twitter fails.
      } else {
        // Update DB tweeted status
        console.log(`[Auto-Run] Tweet posted successfully. Updating DB.`);
        const { error: updateError } = await supabase
          .from('posts')
          .update({ tweeted: true })
          .eq('slug', slug);
          
        if (updateError) console.error("Failed to update tweet status in DB");
      }
    } catch (e) {
      console.error("[Auto-Run] Error calling post-tweet:", e);
    }

    return NextResponse.json({ success: true, slug, tweet: tweetData.tweet });
  } catch (error: any) {
    console.error(`[Auto-Run] Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
