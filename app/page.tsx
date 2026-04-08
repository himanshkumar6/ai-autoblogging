import { getSupabase } from "@/lib/supabase";
import Container from "@/components/Container";
import BlogCard from "@/components/BlogCard";
import Sidebar from "@/components/Sidebar";
import HeroButtons from "@/components/HeroButtons";

export const revalidate = 60; // Refresh page data every 60 seconds

export default async function Home() {
  const supabase = getSupabase();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, meta_description, content, created_at, tweeted")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Live Crypto Market Feed</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.95] drop-shadow-sm">
              CryptoNews <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple">
                Market Insights
              </span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl leading-relaxed text-gray-500 dark:text-white/40 max-w-2xl mx-auto font-bold tracking-tight">
              Curated daily market analysis and on-chain breakthroughs, distilled into high-impact articles.
            </p>
            <div className="mt-12 flex justify-center scale-110 sm:scale-125">
              <HeroButtons />
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Layout */}
      <Container className="pb-24 pt-8 text-black" >
        <div className="flex flex-col lg:flex-row gap-12 relative z-10" id="latest-posts">
          
          {/* Main Feed */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-black tracking-tight text-primary">Market Feeds</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-black/10 dark:from-white/10 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {!posts || posts.length === 0 ? (
                <div className="col-span-full py-24 text-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg">
                  <div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-secondary text-lg font-medium">Synchronizing on-chain data models...</p>
                </div>
              ) : (
                posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))
              )}
            </div>
          </div>

          <Sidebar trendingPosts={posts ? posts.slice(0, 4) : []} />

        </div>
      </Container>
    </>
  );
}
