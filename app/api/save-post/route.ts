export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
    // Auth check — only logged-in admin can save posts
    const supabase = createClient();
    const supabaseAdmin = getSupabaseAdmin();
    const { data: { user } } = await supabase.auth.getUser();

    const ADMIN_EMAILS = [
      "admin@cryptonews.local",
      process.env.ADMIN_EMAIL || "",
    ].filter(Boolean);

    const isAuthorized = user && ADMIN_EMAILS.includes(user.email || "");
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, meta, published = true } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

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

    const { data: post, error: dbError } = await supabaseAdmin
      .from("posts")
      .insert([{
        title,
        slug,
        content,
        meta_description: meta,
        published,
        tweeted: false,
      }])
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ success: true, slug: post.slug });
  } catch (error: any) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: error.message || "Failed to save post" }, { status: 500 });
  }
}
