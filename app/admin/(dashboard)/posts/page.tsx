export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
// Removed unused import

export default async function AdminPosts() {
  const supabase = createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, published, tweeted, created_at, meta_description")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-2">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 mb-2 tracking-tight">Content Pipeline</h1>
          <p className="text-gray-500 dark:text-white/40 font-bold text-sm md:text-base">Manage and monitor all AI-generated articles.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 min-w-[800px]">
            <thead className="bg-gray-50/80 dark:bg-[#0a0a0f]/50 text-[10px] uppercase text-gray-500 dark:text-white/50 border-b border-gray-100 dark:border-white/5 font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Post Title & Context</th>
                <th className="px-6 py-6">Created At</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-6 py-6 text-center">Tweeted</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-gray-500 dark:text-white/40 text-lg font-bold">
                    No generated posts found in pipeline.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 dark:text-white/90 mb-1.5 line-clamp-1 text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500 dark:text-white/40 line-clamp-1 font-bold">{post.meta_description}</p>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-xs text-gray-600 dark:text-white/50 font-black">
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${post.published ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${post.tweeted ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-[#1DA1F2]/10 dark:text-[#1DA1F2] dark:border-[#1DA1F2]/20' : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10'}`}>
                        {post.tweeted ? '✓ Active' : 'Idle'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-all text-xs font-black mr-6 border-b-2 border-transparent hover:border-purple-500">Edit</button>
                      <button className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all text-xs font-black border-b-2 border-transparent hover:border-red-500">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}
