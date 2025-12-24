export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-lg">
      
      <div className="relative z-10 w-full max-w-7xl overflow-hidden px-4 md:px-0">
        <div className="relative aspect-3/2 md:aspect-2/1 w-full overflow-hidden rounded-lg bg-zinc-900/50 animate-pulse"></div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden pt-6 pb-4">
        <div className="flex h-14 w-full items-center justify-center gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-3/2 h-12 w-20 shrink-0 rounded-sm bg-zinc-800/50 animate-pulse ${
                i === 4 
                  ? "brightness-110 scale-125 z-10"
                  : "brightness-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}