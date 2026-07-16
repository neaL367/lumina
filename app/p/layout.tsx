import type { ReactNode } from "react";

export default function PLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full min-h-dvh bg-[#f3f3f3] dark:bg-zinc-950">
      {children}
    </main>
  );
}
