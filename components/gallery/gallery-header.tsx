import { Github, Twitter } from "lucide-react";

export function GalleryHeader() {
  return (
    <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between" style={{ viewTransitionName: "gallery-header" }}>
      <a
        href="/"
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/70 dark:bg-zinc-950/65 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] select-none"
      >
        <span className="flex flex-col tracking-tight leading-none">
          <span className="text-zinc-500 dark:text-zinc-400 text-[9px] font-medium tracking-[0.15em] uppercase">
            Neal367&apos;s
          </span>
          <span className="text-zinc-900 dark:text-white text-sm font-normal leading-[1.2]">
            Photography
          </span>
        </span>
      </a>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com/neal367"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/70 dark:bg-zinc-950/65 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          aria-label="GitHub"
        >
          <Github size={14} />
        </a>
        <a
          href="https://twitter.com/NL367"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/70 dark:bg-zinc-950/65 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/40 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white/90 dark:hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          aria-label="Twitter"
        >
          <Twitter size={14} />
        </a>
      </div>
    </div>
  );
}
