import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PhotoNav() {
  return (
    <header
      className="gallery-navbar fixed inset-x-0 top-0 z-50 h-16"
      style={{ viewTransitionName: "photo-nav" }}
    >
      <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          scroll={false}
          transitionTypes={["nav-back"]}
          className="gallery-glass-control flex size-10 items-center justify-center rounded-xl"
          aria-label="Back to gallery"
        >
          <ArrowLeft size={17} />
        </Link>
        <span className="absolute left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          Photo detail
        </span>
      </div>
    </header>
  );
}
