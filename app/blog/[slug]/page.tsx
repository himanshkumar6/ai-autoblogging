import { getSupabase } from "@/lib/supabase-core";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon, Share2, Image as ImageIcon } from "lucide-react";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import ReadingProgress from "@/components/ReadingProgress";

import AdUnit from "@/components/AdUnit";
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
        {/* Top Content Leaderboard */}
        <div className="mb-12">
          {settings.adsterraLeaderboard && (
            <div className="hidden md:flex justify-center py-4">
              <AdUnit html={settings.adsterraLeaderboard} />
            </div>
          )}
          {settings.adsterraMobileBanner && (
            <div className="flex md:hidden justify-center py-2">
              <AdUnit html={settings.adsterraMobileBanner} />
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 min-w-0">
            {/* Navigation & Back Link */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="group inline-flex items-center text-sm font-semibold text-secondary hover:text-accent-cyan transition-colors"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/30 transition-colors mr-3">
                  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Back to Feed
              </Link>
            </div>

            <GlassCard className="p-8 md:p-12 border-t border-b sm:border border-black/5 dark:border-white/5 !bg-white/40 dark:!bg-[#0a0a0f]/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
              {/* Article Header */}
              <header className="mb-16 flex flex-col items-center text-center">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[11px] font-black uppercase tracking-[0.2em] mb-10">
                  <span className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                    Market Intel
                  </span>
                  <span className="text-gray-300 dark:text-white/20">/</span>
                  <time dateTime={post.created_at} className="text-gray-700 dark:text-white/40">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </time>
                  <span className="text-gray-300 dark:text-white/20">/</span>
                  <span className="text-accent-blue dark:text-accent-purple font-black">
                    {readTime} min read
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95] mb-10 text-balance text-center mx-auto max-w-4xl">
                  {post.title}
                </h1>
                
                <p className="text-lg text-gray-700 dark:text-white/40 italic leading-relaxed mb-12 font-body font-medium tracking-tight text-center mx-auto max-w-2xl">
                  {post.meta_description}
                </p>

                {/* Author Block */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-10 border-t border-b border-black/5 dark:border-white/5 gap-8">
                  <div className="flex items-center gap-5 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-0.5 flex items-center justify-center shadow-xl shrink-0">
                       <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple flex items-center justify-center">
                        <span className="text-white font-display font-black text-lg tracking-tighter">Ai</span>
                       </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
                        Cyber Analyst Model
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-white/30 font-bold tracking-widest uppercase font-display">Autonomous Intelligence Engine</p>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-white/10" aria-label="Share on X">
                      <Twitter size={14} />
                      Share
                    </button>
                    <button className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all border border-transparent hover:border-white/10" aria-label="Copy Link">
                      <LinkIcon size={14} />
                    </button>
                  </div>
                </div>
              </header>

              {post.image_url && (
                <div className="relative w-full aspect-[16/9] mb-12 overflow-hidden bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-2xl">
                  <Image 
                    src={post.image_url} 
                    alt={post.title} 
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1200px) 100vw, 800px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent opacity-80" />
                </div>
              )}

              {/* Article Body Content */}
              <div 
                className="prose prose-lg sm:prose-xl mx-auto dark:prose-invert font-body
                           prose-headings:font-display prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white
                           prose-p:text-gray-800 dark:prose-p:text-white/70 prose-p:leading-[1.8]
                           prose-strong:text-gray-900 dark:prose-strong:text-white
                           prose-a:text-accent-cyan hover:prose-a:text-accent-blue prose-a:no-underline
                           prose-img:rounded-[2.5rem] prose-img:shadow-2xl
                           editorial-content"
              >
                <div dangerouslySetInnerHTML={{ __html: contentHead }} />
                
                {contentTail && settings.adsterraNative && (
                  <div className="my-12 py-8 border-y border-black/5 dark:border-white/5 flex flex-col items-center gap-2">
                    <AdUnit html={settings.adsterraNative} label="Sponsored Content" />
                  </div>
                )}
                
                {contentTail && <div dangerouslySetInnerHTML={{ __html: contentTail }} />}
              </div>

              {/* Bottom Article Ad */}
              {settings.adsterraBanner && (
                <div className="mt-16 pt-12 border-t border-black/5 dark:border-white/5 flex justify-center">
                  <AdUnit html={settings.adsterraBanner} />
                </div>
              )}
            </GlassCard>
          </div>

          <Sidebar 
            trendingPosts={trendingPosts || []}
            adSkyscraper={settings.adsterraSidebarSkyscraper}
            adSquare={settings.adsterraSidebarSquare}
          />
        </div>
      </Container>
    </article>
  );
}
