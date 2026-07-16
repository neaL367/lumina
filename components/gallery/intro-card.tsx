import { memo } from "react";
import { Github, Twitter } from "lucide-react";

export const IntroCard = memo(function IntroCard(): React.JSX.Element {
  'use memo'
  return (
    <div className="flex flex-col justify-center items-start gap-4 select-none">
      <h1 className="flex flex-col tracking-tight leading-none" style={{ fontFamily: "var(--font-geist-sans)" }}>
        <span className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium tracking-[0.15em] uppercase">
          Neal367&apos;s
        </span>
        <span className="text-zinc-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.1]">
          Photography
        </span>
      </h1>
      <div className="w-8 h-[1.5px] bg-zinc-300 dark:bg-zinc-700" />
      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-[220px] font-normal">
        A curated collection of favorite memories, transient moments, and cinematic street photography captured through the lens.
      </p>
      <div className="flex items-center gap-3 pt-1">
        <a
          href={`https://github.com/neal367`}
          target={`_blank`}
          rel={`noopener noreferrer`}
          className="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white cursor-pointer"
        >
          <Github className="w-4 h-4" />
          <span className="sr-only">GitHub</span>
        </a>
        <a
          href={`https://twitter.com/NL367`}
          target={`_blank`}
          rel={`noopener noreferrer`}
          className="text-zinc-400 transition-colors hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer"
        >
          <Twitter className="w-4 h-4" />
          <span className="sr-only">Twitter</span>
        </a>
      </div>
    </div>
  );
});
