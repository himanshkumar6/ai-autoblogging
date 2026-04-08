"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { updatePost } from "@/app/admin/(dashboard)/posts/actions";

export default function EditPostForm({ post }: { post: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: post.title || "",
    meta_description: post.meta_description || "",
    content: post.content || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updatePost(post.id, formData);
      if (result.success) {
        setSuccess(true);
        // router.refresh(); // Not strictly needed if server action handled revalidation
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to update post");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <Link 
          href="/admin/posts"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white/90 transition-all font-black text-sm uppercase tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </Link>

        {success && (
          <div className="flex items-center gap-2 text-green-500 font-black text-sm uppercase tracking-widest animate-in zoom-in duration-300">
            <CheckCircle className="w-4 h-4" />
            Changes Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-8 bg-white/80 dark:bg-white/[0.02] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-black text-gray-500 dark:text-white/40 tracking-[0.2em] mb-3">Blog Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-gray-500 dark:text-white/40 tracking-[0.2em] mb-3">Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                placeholder="Brief SEO description"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-gray-500 dark:text-white/40 tracking-[0.2em] mb-3">Full Article Content (HTML)</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono leading-relaxed"
                placeholder="Enter HTML content..."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-purple-600/5 rounded-2xl border border-purple-500/20">
          <div className="text-sm">
            <p className="font-black text-purple-900 dark:text-purple-300">Ready to update?</p>
            <p className="text-purple-700/60 dark:text-purple-400/40 font-bold">Saving will regenerate the slug and revalidate the public pages.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {error && <span className="text-xs text-red-500 font-bold">{error}</span>}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
