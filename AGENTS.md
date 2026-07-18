<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->

# Lumina — Photo Gallery

- Package manager: **Bun** (`bun.lock`). Run `bun run dev`, `bun run build`, `bun run typecheck`.
- Cache Components enabled (`cacheComponents: true`). Pages are dynamic by default; use `"use cache"` + `cacheLife()` to opt into caching.
- PPR (Partial Prerendering) is active. Structure components so static chrome is outside `<Suspense>` and dynamic content streams behind boundaries.
- Turbopack is the default bundler. Do not pass `--webpack`.
- React Compiler is enabled (`reactCompiler: { compilationMode: "annotation" }`).
- View Transitions are enabled (`experimental.viewTransition`).
- Key patterns:
  - Server Components by default. Add `"use client"` only when the component needs hooks, event handlers, or browser APIs.
  - `"use cache"` + `cacheLife()` for data fetching functions that should be cached.
  - `<Suspense>` boundaries separate static shell from streaming content.
  - `params` and `searchParams` are Promises — always `await` them inside the Suspense boundary, not at the page top.
  - `export const instant = false` on a route opts it out of PPR validation (use as escape hatch, not default).
