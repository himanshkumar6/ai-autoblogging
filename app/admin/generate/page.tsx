"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminGenerate() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsLoading(true);
    setError("");
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!result) return;
    setIsLoading(true);
    try {
      // Slugify title
      const slug = result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const { error: dbError } = await supabase
        .from("posts")
        .insert([{
          title: result.title,
          slug: slug,
          content: result.content,
          meta_description: result.meta,
          published: true, // Auto publish from manual interface for now
          tweeted: false
        }]);
        
      if (dbError) throw new Error(dbError.message);
      
      setSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 mb-2 tracking-tight">AI Generator</h1>
          <p className="text-gray-500 dark:text-white/40 font-medium">Force the model to draft an article on a specific topic.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-md p-8 rounded-2xl border border-gray-100 dark:border-white/5 mb-8 shadow-xl dark:shadow-2xl">
        <form onSubmit={handleGenerate} className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., The impact of Quantum Computing on Bitcoin hashing..."
            className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !topic}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl disabled:opacity-50 hover:shadow-[0_4px_20px_rgba(124,58,237,0.3)] dark:hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all active:scale-95 flex items-center justify-center min-w-[200px]"
          >
            {isLoading && !result ? "Synthesizing..." : "Generate Draft"}
          </button>
        </form>
        {error && <p className="text-red-500 dark:text-red-400 mt-4 text-sm font-semibold">{error}</p>}
      </div>

      {result && (
        <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/5 p-8 md:p-10 rounded-2xl shadow-xl dark:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-sm uppercase tracking-widest font-bold text-gray-500 dark:text-white/40 mb-4">Review Content</h2>
            <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold mb-3">{result.title}</p>
            <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed max-w-3xl">{result.meta}</p>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none text-base text-gray-800 dark:text-white/70 mb-10 max-h-96 overflow-y-auto pr-6 custom-scrollbar" dangerouslySetInnerHTML={{ __html: result.content }} />
          
          <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-white/5">
            {saved ? (
              <span className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2">
                Successfully Published!
              </span>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="bg-gray-900 dark:bg-white text-white dark:text-black font-bold px-10 py-3.5 rounded-xl hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all flex items-center justify-center min-w-[220px]"
              >
                {isLoading ? "Saving Pipeline..." : "Approve & Publish"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
