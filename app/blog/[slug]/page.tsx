import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon, Share2, Image as ImageIcon } from "lucide-react";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import ReadingProgress from "@/components/ReadingProgress";

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

export default async function BlogPostPage({ params }: Props) {
  const supabase = getSupabase();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content);

  return (
    <article className="min-h-screen pt-8 pb-24 relative z-10">
      <ReadingProgress />
      
      <Container className="max-w-[800px]">
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

        <GlassCard className="p-8 md:p-16 border-t border-b sm:border border-black/5 dark:border-white/5 !bg-white/40 dark:!bg-[#0a0a0f]/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
          
          {post.image_url && (
            <div className="relative w-full aspect-[16/9] -mx-8 -mt-8 mb-16 md:-mx-16 md:-mt-16 overflow-hidden bg-white/5 border-b border-black/5 dark:border-white/5">
              <Image 
                src={post.image_url} 
                alt={post.title} 
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-16 flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[11px] font-black uppercase tracking-[0.2em] mb-10">
              <span className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                Market Intel
              </span>
              <span className="text-gray-300 dark:text-white/20">/</span>
              <time dateTime={post.created_at} className="text-gray-500 dark:text-white/40">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </time>
              <span className="text-gray-300 dark:text-white/20">/</span>
              <span className="text-accent-blue dark:text-accent-purple">
                {readTime} min read
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95] mb-10 text-balance text-center mx-auto max-w-4xl">
              {post.title}
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-500 dark:text-white/40 italic leading-relaxed mb-12 font-body font-medium tracking-tight text-center mx-auto max-w-2xl">
              {post.meta_description}
            </p>

            {/* Author Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-10 border-t border-b border-black/5 dark:border-white/5 gap-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-0.5 flex items-center justify-center shadow-xl">
                   <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple flex items-center justify-center">
                    <span className="text-white font-display font-black text-xl tracking-tighter">Ai</span>
                   </div>
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-2 flex items-center gap-2">
                    Cyber Analyst Model
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/30 font-bold tracking-widest uppercase font-display">Autonomous Intelligence Engine</p>
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

          {/* Article Body Content */}
          <div 
            className="prose prose-lg sm:prose-2xl mx-auto dark:prose-invert font-body
                       prose-headings:font-display prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white
                       prose-p:text-gray-800 dark:prose-p:text-white/70 prose-p:leading-[1.8]
                       prose-strong:text-gray-900 dark:prose-strong:text-white
                       prose-a:text-accent-cyan hover:prose-a:text-accent-blue prose-a:no-underline
                       prose-img:rounded-[2.5rem] prose-img:shadow-2xl
                       editorial-content
                       max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

        </GlassCard>
      </Container>
    </article>
  );
}
