import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-transparent border-t border-gray-100 dark:border-white/10 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-secondary text-sm font-medium text-center md:text-left">
            © {new Date().getFullYear()} Crypto News. Autonomous AI Engine.
          </div>
          <div className="flex gap-8 justify-center md:justify-end">
            <Link href="/privacy" className="text-sm text-secondary hover:text-accent-cyan transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-secondary hover:text-accent-cyan transition-colors">Terms</Link>
            <Link href="/about" className="text-sm text-secondary hover:text-accent-cyan transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
