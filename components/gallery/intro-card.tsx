import { memo } from "react";
import { Github, Twitter } from "lucide-react";

export const IntroCard = memo(function IntroCard(): React.JSX.Element {
  return (
    <div className="w-full h-full rounded-3xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10 shadow-2xl flex flex-col justify-between items-start">
      <div className="my-auto flex flex-col gap-4">
        <div>
          <h1 className="text-zinc-900 dark:text-white font-sans text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
            {`Neal367's`} <br />
            {`Photography`}
          </h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          {`A curated collection of favorite memories, transient moments, and cinematic street photography captured through the lens.❣️`}
        </p>
      </div>
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50 w-full">
        <a
          href={`https://github.com/neal367`}
          target={`_blank`}
          rel={`noopener noreferrer`}
          className={`text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`}
        >
          <Github className={`w-5 h-5`} />
          <span className={`sr-only`}>{`GitHub`}</span>
        </a>

        <a
          href={`https://twitter.com/NL367`}
          target={`_blank`}
          rel={`noopener noreferrer`}
          className={`text-zinc-500 transition-colors hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400`}
        >
          <Twitter className={`w-5 h-5`} />
          <span className={`sr-only`}>{`Twitter`}</span>
        </a>
      </div>
    </div>
  );
});
