import Link from "next/link";

export function GalleryHeader() {
  return (
    <header
      className="fixed top-4 left-4 right-4 z-50 sm:top-5 sm:left-6 sm:right-6"
      style={{ viewTransitionName: "gallery-header" }}
    >
      <nav
        aria-label="Primary navigation"
        className="gallery-glass-surface mx-auto flex max-w-[1600px] items-center justify-between rounded-2xl px-3 py-2.5"
      >
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60"
          aria-label="Neal367's Photography home"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-950 text-[10px] font-semibold tracking-tight text-white transition-transform duration-300 group-hover:rotate-3 dark:bg-white dark:text-zinc-950">
            N
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Neal367&apos;s
            </span>
            <span className="mt-1 text-sm font-medium tracking-tight text-zinc-950 dark:text-white">
              Photography
            </span>
          </span>
        </Link>

      </nav>
    </header>
  );
}
