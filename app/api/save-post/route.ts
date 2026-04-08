export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminAuth } from "@/lib/auth";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAdminAuth(request);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access. Admin privileges required." }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { title, content, meta, image_url, published = true } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Persist provided image_url (can be null in clean state)
    const finalImageUrl = image_url || null;

    let slug = generateSlug(title);
    
    // Check for duplicate slug and append random suffix if needed
    const { data: existing } = await supabaseAdmin
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    console.log(`[Save-Post] Persisting blog: ${title} with slug: ${slug}`);

    const { data: post, error: dbError } = await supabaseAdmin
      .from("posts")
      .insert([{
        title,
        slug,
        content,
        meta_description: meta,
        image_url: finalImageUrl,
        published,
        tweeted: false,
      }])
      .select()
      .single();

    if (dbError) {
      console.error("[Save-Post] DB Error:", dbError.message);
      throw new Error(`DB Error: ${dbError.message}`);
    }

    return NextResponse.json({ success: true, slug: post.slug, post_id: post.id });
  } catch (error: any) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: error.message || "Failed to save post" }, { status: 500 });
  }
}
