import { getSupabase } from "@/lib/supabase-core";
import Container from "@/components/Container";
import BlogCard from "@/components/BlogCard";
import Sidebar from "@/components/Sidebar";
import HeroButtons from "@/components/HeroButtons";
import AdSlot from "@/components/AdSlot";
import { getAllSettings } from "./actions/settings";

import Pagination from "@/components/Pagination";

export const revalidate = 60; // Refresh page data every 60 seconds

interface Props {
  searchParams: { page?: string };
}

export default async function Home({ searchParams }: Props) {
  const settings = await getAllSettings();
  const page = parseInt(searchParams.page || "1");
  const postsPerPage = 6;
  const from = (page - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  const supabase = getSupabase();
  
  // 1. Fetch Paginated Posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, meta_description, content, image_url, created_at, tweeted")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  // 2. Fetch Total Count for Pagination
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const totalPages = Math.ceil((count || 0) / postsPerPage);

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">Autonomous Intelligence Feed</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.95] drop-shadow-sm">
              NexusPulse <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                The New Frontier
              </span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl leading-relaxed text-gray-500 dark:text-white/40 max-w-2xl mx-auto font-bold tracking-tight">
              Real-time intelligence from the intersection of financial markets, cosmic discoveries, and the future of technology.
            </p>
            <div className="mt-12 flex justify-center scale-110 sm:scale-125">
              <HeroButtons />
            </div>

            {/* TOP AD PLACEMENT */}
            <div className="mt-20 w-full flex justify-center min-h-[90px]">
              <AdSlot adCode={settings.ads?.ad_top_banner} minHeight="90px" />
            </div>


          </div>
        </Container>
      </section>
      
      {/* Removed old Top Banner Container */}



      {/* Main Content Layout */}
      <Container className="pb-24 pt-8 text-black" >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 relative z-10" id="latest-posts">
          
          {/* Main Feed */}
          <div className="min-w-0 flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-black tracking-tight text-primary dark:text-white">Intelligence Streams</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-black/10 dark:from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {posts?.map((post: any, i: number) => (
                <div key={post.id} className="contents">
                  <BlogCard 
                    post={post}
                    index={i}
                    priority={i < 2}
                  />

                </div>
              ))}
            </div>

            {(!posts || posts.length === 0) ? (
              <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                <p className="text-gray-400 font-display text-xl">Awaiting the next wave of intelligence...</p>
              </div>
            ) : (
              <div className="mt-16">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}

            {/* BOTTOM AD PLACEMENT */}
            <div className="mt-12 mb-8 flex justify-center w-full min-h-[90px]">
              <AdSlot adCode={settings.ads?.ad_bottom_banner} minHeight="90px" />
            </div>
          </div>

          {/* Sidebar - Clean of ads */}
          <div className="w-full lg:w-[300px]">
            <Sidebar 
              trendingPosts={posts ? posts.slice(0, 4) : []} 
              adCode={settings.ads?.ad_sidebar}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
