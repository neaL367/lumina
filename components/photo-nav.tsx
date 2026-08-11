import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PhotoNav() {
  return (
    <div
      className="fixed top-4 left-4 right-4 z-50 sm:top-5 sm:left-6 sm:right-6"
      style={{ viewTransitionName: "photo-nav" }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <Link
          href="/"
          scroll={false}
          transitionTypes={["nav-back"]}
          className="gallery-glass-surface gallery-glass-control flex size-11 items-center justify-center rounded-2xl shadow-sm"
          aria-label="Back to gallery"
        >
          <ArrowLeft size={17} />
        </Link>
        <span className="gallery-glass-surface hidden rounded-full px-3 py-2 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 sm:block">
          Photo detail
        </span>
      </div>
    </div>
  );
}
