"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-16" aria-label="Pagination">
      {/* Previous Page */}
      <Link
        href={currentPage > 1 ? `/?page=${currentPage - 1}#latest-posts` : "#"}
        className={`group flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-300 ${
          currentPage > 1
            ? "border-black/5 dark:border-white/10 bg-white/5 hover:bg-accent-cyan hover:border-accent-cyan hover:text-[#0a0a0f] text-gray-900 dark:text-white"
            : "border-black/5 dark:border-white/5 bg-transparent text-gray-300 dark:text-white/10 cursor-not-allowed"
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-[2rem] bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={`/?page=${page}#latest-posts`}
              className={`flex items-center justify-center min-w-[3rem] h-10 px-4 rounded-xl text-sm font-black transition-all duration-300 ${
                isActive
                  ? "bg-accent-cyan text-[#0a0a0f] shadow-lg shadow-accent-cyan/20"
                  : "text-gray-500 dark:text-white/40 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Page */}
      <Link
        href={currentPage < totalPages ? `/?page=${currentPage + 1}#latest-posts` : "#"}
        className={`group flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-300 ${
          currentPage < totalPages
            ? "border-black/5 dark:border-white/10 bg-white/5 hover:bg-accent-cyan hover:border-accent-cyan hover:text-[#0a0a0f] text-gray-900 dark:text-white"
            : "border-black/5 dark:border-white/5 bg-transparent text-gray-300 dark:text-white/10 cursor-not-allowed"
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </nav>
  );
}
