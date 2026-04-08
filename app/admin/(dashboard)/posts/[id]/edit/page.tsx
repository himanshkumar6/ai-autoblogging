import { notFound, redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import EditPostForm from "@/components/EditPostForm";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = [
  "admin@cryptonews.local",
  process.env.ADMIN_EMAIL || ""
].filter(Boolean);

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Double check security on page load
  const supabaseServer = createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    redirect("/admin/login");
  }

  // 2. Fetch the post data
  const supabase = getSupabaseAdmin();
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, meta_description, content, slug")
    .eq("id", id)
    .single();

  if (error || !post) {
    console.error("[Edit Page] Failed to fetch post:", error?.message);
    notFound();
  }

  return (
    <div className="pt-2">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-4 sm:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 mb-2 tracking-tight">
            Edit Post
          </h1>
          <p className="text-gray-500 dark:text-white/40 font-bold text-sm md:text-base underline underline-offset-8 decoration-purple-500/30">
            {post.title}
          </p>
        </div>
      </div>

      <EditPostForm post={post} />
    </div>
  );
}
