import { getSupabase } from "@/lib/supabase-core";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon, Share2, Image as ImageIcon } from "lucide-react";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import ReadingProgress from "@/components/ReadingProgress";
import AdSlot from "@/components/AdSlot";
import AuthorAndShareBlock from "@/components/AuthorAndShareBlock";
import { getAllSettings } from "@/app/actions/settings";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("title, meta_description")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Post Not Found" };

  return {
    title: `${data.title} | Crypto News`,
    description: data.meta_description,
    openGraph: {
      title: data.title,
      description: data.meta_description,
      type: "article",
    },
  };
}

function estimateReadTime(text: string) {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

// Helper to split content at Nth paragraph
function splitContentAtParagraph(content: string, n: number): [string, string | null] {
  const parts = content.split('</p>');
  if (parts.length <= n) return [content, null];
  
  // Re-add the closing tags for the first part
  const firstPart = parts.slice(0, n).join('</p>') + '</p>';
  const secondPart = parts.slice(n).join('</p>');
  
  return [firstPart, secondPart];
}

import Sidebar from "@/components/Sidebar";

export default async function BlogPostPage({ params }: Props) {
  const settings = await getAllSettings();
  const supabase = getSupabase();
  
  // Fetch post
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Fetch trending for sidebar
  const { data: trendingPosts } = await supabase
    .from("posts")
    .select("id, title, slug")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const readTime = estimateReadTime(post.content || "");
  const [contentHead, contentTail] = splitContentAtParagraph(post.content || "", 2);

  return (
    <article className="min-h-screen pt-8 pb-24 relative z-10">
      <ReadingProgress />
      
      <Container>


        <div className="max-w-4xl lg:max-w-none mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 items-start w-full">
          <div className="min-w-0 w-full">
            {/* Navigation & Back Link */}
            <div className="mb-6 lg:mb-8 px-2 sm:px-0">
              <Link 
                href="/" 
                className="group inline-flex items-center text-xs sm:text-sm font-semibold text-secondary hover:text-accent-cyan transition-colors"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/30 transition-colors mr-3">
                  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Back to Feed
              </Link>
            </div>



            <GlassCard className="p-5 sm:p-8 md:p-12 border-t border-b sm:border border-black/5 dark:border-white/5 !bg-white/40 dark:!bg-[#0a0a0f]/40 backdrop-blur-3xl shadow-2xl overflow-hidden w-full max-w-full">
              {/* TOP AD PLACEMENT */}
            <div className="mb-8 w-full flex justify-center">
               <AdSlot adCode={settings.ads?.ad_top_banner} minHeight="90px" />
            </div>
              {/* Article Header */}
              <header className="mb-10 sm:mb-12 flex flex-col items-center text-center">
                <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 text-center">
                  <span className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                    Market Intel
                  </span>
                  <span className="hidden sm:inline text-gray-300 dark:text-white/20">/</span>
                  <time dateTime={post.created_at} className="text-gray-700 dark:text-white/40">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </time>
                  <span className="hidden sm:inline text-gray-300 dark:text-white/20">/</span>
                  <span className="text-accent-blue font-black w-full sm:w-auto mt-2 sm:mt-0">
                    {readTime} min read
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1] sm:leading-[0.95] mb-6 sm:mb-8 text-balance break-words w-full px-2 sm:px-0">
                  {post.title}
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-white/40 italic leading-relaxed mb-8 sm:mb-10 mx-auto max-w-2xl px-2 sm:px-0 text-balance">
                  {post.meta_description}
                </p>

                {/* Author & Share Block (Client Component) */}
                <AuthorAndShareBlock 
                  authorName={settings.authorName}
                  authorDesignation={settings.authorDesignation}
                  authorImage={settings.authorImage}
                  postTitle={post.title}
                />
              </header>

              {post.image_url && (
                <div className="relative w-full aspect-[16/9] mb-8 sm:mb-12 overflow-hidden bg-white/5 rounded-xl sm:rounded-[2rem] border border-black/5 dark:border-white/5 shadow-2xl">
                  <Image 
                    src={post.image_url} 
                    alt={post.title} 
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1200px) 100vw, 800px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent opacity-60" />
                </div>
              )}

              {/* Article Body Content */}
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg mx-auto dark:prose-invert font-body
                           prose-headings:font-display prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white
                           prose-p:text-gray-800 dark:prose-p:text-white/70 prose-p:leading-[1.6] sm:prose-p:leading-[1.7]
                           prose-strong:text-gray-900 dark:prose-strong:text-white
                           prose-a:text-accent-cyan hover:prose-a:text-accent-blue prose-a:no-underline
                           prose-img:rounded-xl sm:prose-img:rounded-[2.5rem] prose-img:shadow-2xl
                           editorial-content break-words w-full max-w-none"
              >
                <div dangerouslySetInnerHTML={{ __html: contentHead }} />
                
                {/* MID-CONTENT AD INJECTION */}
                {contentTail && settings.ads?.ad_mid_content && (
                  <div className="my-8 sm:my-12 py-6 sm:py-8 border-y border-black/5 dark:border-white/5 flex justify-center w-full overflow-hidden">
                    <AdSlot adCode={settings.ads.ad_mid_content} minHeight="250px" />
                  </div>
                )}

                {contentTail && <div dangerouslySetInnerHTML={{ __html: contentTail }} />}
              </div>

              {/* BOTTOM AD PLACEMENT */}
              <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-black/5 dark:border-white/5 w-full flex justify-center">
                <AdSlot adCode={settings.ads?.ad_bottom_banner} minHeight="90px" />
              </div>


            </GlassCard>
          </div>

          <div className="w-full lg:w-[300px]">
            <Sidebar 
              trendingPosts={trendingPosts || []}
              adCode={settings.ads?.ad_sidebar}
            />
          </div>
        </div>
      </Container>
    </article>
  );
}
