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
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 mb-2 tracking-tight">Content Pipeline</h1>
          <p className="text-gray-500 dark:text-white/40 font-medium">Manage all AI generated posts.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50/80 dark:bg-[#0a0a0f]/50 text-xs text-gray-500 dark:text-white/50 border-b border-gray-100 dark:border-white/5 font-semibold tracking-wider">
              <tr>
                <th className="px-8 py-5">Post Title</th>
                <th className="px-6 py-5">Created At</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-center">Tweeted</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-gray-500 dark:text-white/40 text-base font-medium">
                    No generated posts found. Check your deployment cycle.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900 dark:text-white/90 mb-1.5 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-500 dark:text-white/40 line-clamp-1 font-medium">{post.meta_description}</p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-600 dark:text-white/50 font-medium">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${post.published ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${post.tweeted ? 'bg-blue-100 text-blue-700 dark:bg-[#1DA1F2]/10 dark:text-[#1DA1F2]' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-white/40'}`}>
                        {post.tweeted ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline transition-all text-xs font-bold mr-5">Edit</button>
                      <button className="text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:underline transition-all text-xs font-bold">Delete</button>
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
