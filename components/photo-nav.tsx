import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PhotoNav() {
  return (
    <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between" style={{ viewTransitionName: "photo-nav" }}>
      <Link
        href="/"
        scroll={false}
        transitionTypes={["nav-back"]}
        className="p-3.5 rounded-full bg-white/10 dark:bg-black/25 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/20 dark:hover:bg-black/35 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm"
        aria-label="Back to gallery"
      >
        <ArrowLeft size={18} />
      </Link>
    </div>
  );
}
