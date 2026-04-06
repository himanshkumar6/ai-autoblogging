import { supabase } from "@/lib/supabase";
import Container from "@/components/Container";
import BlogCard from "@/components/BlogCard";
import Sidebar from "@/components/Sidebar";
import HeroButtons from "@/components/HeroButtons";

export const revalidate = 60; // Refresh page data every 60 seconds

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, meta_description, created_at, tweeted")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Glow behind hero text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/20 dark:bg-accent-blue/10 blur-[100px] rounded-full point-events-none -z-10" />
        
        <Container>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-primary mb-8 leading-[1.1]">
              Crypto Insights <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple drop-shadow-sm">
                Powered by AI
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-secondary max-w-2xl mx-auto font-medium">
              Enterprise-grade market analysis, on-chain data summaries, and breaking news algorithms running 24/7.
            </p>
            <HeroButtons />
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
