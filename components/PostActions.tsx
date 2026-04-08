"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Edit3, Loader2 } from "lucide-react";
import { deletePost } from "@/app/admin/(dashboard)/posts/actions";

export default function PostActions({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deletePost(id);
      if (!result.success) {
        setError(result.error || "Failed to delete post");
        setIsDeleting(false);
        setShowConfirm(false);
      }
      // revalidatePath in server action will update the list
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-4">
      {error && <span className="text-[10px] text-red-500 font-bold uppercase">{error}</span>}
      
      {!showConfirm ? (
        <>
          <Link
            href={`/admin/posts/${id}/edit`}
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-all text-xs font-black border-b-2 border-transparent hover:border-purple-500 pb-0.5"
          >
            <Edit3 className="w-3 H-3" />
            Edit
          </Link>
          
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all text-xs font-black border-b-2 border-transparent hover:border-red-500 pb-0.5"
          >
            <Trash2 className="w-3 H-3" />
            Delete
          </button>
        </>
      ) : (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-200">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Are you sure?</span>
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 font-black text-xs flex items-center gap-1 uppercase tracking-widest disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "YES"}
          </button>
          <button
            disabled={isDeleting}
            onClick={() => setShowConfirm(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-white/40 dark:hover:text-white/70 font-black text-xs uppercase tracking-widest"
          >
            NO
          </button>
        </div>
      )}
    </div>
  );
}
