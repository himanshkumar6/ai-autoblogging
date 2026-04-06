import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon, Share2 } from "lucide-react";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import ReadingProgress from "@/components/ReadingProgress";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

        <GlassCard className="p-6 md:p-12 border-t border-b sm:border-r sm:border-l border-black/10 dark:border-white/10 !bg-white/70 dark:!bg-[#15151f]/60 backdrop-blur-3xl shadow-xl shadow-black/5 dark:shadow-black/50">
          
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary font-medium mb-8">
              <span className="px-3 py-1 rounded-full bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-blue-300 border border-accent-blue/20">
                Market Intel
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </time>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="flex items-center tracking-wide text-accent-cyan">
                {readTime} min read
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-[1.15] mb-6 text-balance drop-shadow-sm">
              {post.title}
            </h1>
            
            <p className="text-xl text-secondary leading-relaxed mb-10 font-medium">
              {post.meta_description}
            </p>

            {/* Author Block */}
            <div className="flex items-center justify-between py-6 border-t border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-cyan via-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
                  <span className="text-white font-black text-lg">AI</span>
                </div>
                <div>
                  <p className="text-base font-bold text-primary leading-none mb-1">Cyber Analyst Model</p>
                  <p className="text-sm text-secondary font-medium tracking-wide">Autonomous Engine</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-secondary hover:text-white hover:bg-[#1DA1F2] hover:shadow-lg hover:shadow-[#1DA1F2]/30 transition-all duration-300 active:scale-95" aria-label="Share on X" title="Share on X">
                  <Twitter size={18} />
                </button>
                <button className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-secondary hover:text-white hover:bg-[#0077b5] hover:shadow-lg hover:shadow-[#0077b5]/30 transition-all duration-300 active:scale-95 hidden sm:block" aria-label="Share on LinkedIn" title="Share on LinkedIn">
                  <Linkedin size={18} />
                </button>
                <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-1 hidden sm:block" />
                <button className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-secondary hover:text-primary dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 active:scale-95" aria-label="Copy Link" title="Copy Link">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* Article Body Content */}
          {/* We ensure high readability by modifying prose colors */}
          <div 
            className="prose prose-lg sm:prose-xl mx-auto dark:prose-invert 
                       prose-headings:font-black prose-headings:tracking-tight 
                       prose-a:text-accent-cyan hover:prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
                       prose-p:text-primary prose-strong:text-primary
                       max-w-none leading-[1.85]"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

        </GlassCard>
      </Container>
    </article>
  );
}
