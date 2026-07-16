import { useMemo } from "react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface GalleryFilterProps {
  selectedYear: string | null;
  selectedMonth: number | null;
  filterExpanded: boolean;
  setFilterExpanded: (expanded: boolean) => void;
  years: string[];
  months: number[];
  handleFilterChange: (year: string | null, month: number | null) => void;
}

export function GalleryFilter({
  selectedYear,
  selectedMonth,
  filterExpanded,
  setFilterExpanded,
  years,
  months,
  handleFilterChange,
}: GalleryFilterProps) {
  const activeFilterLabel = useMemo(() => {
    if (!selectedYear) return "All memory";
    if (selectedMonth === null) return selectedYear;
    return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
  }, [selectedYear, selectedMonth]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto">
      {!filterExpanded ? (
        <button
          onClick={() => setFilterExpanded(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 dark:bg-black/25 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 text-xs text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/20 dark:hover:bg-black/35 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm font-sans tracking-wider uppercase font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          <span>{activeFilterLabel}</span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2.5 p-3 rounded-2xl bg-white/15 dark:bg-black/30 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/40 shadow-lg min-w-[280px] max-w-[90vw] animate-in fade-in zoom-in-95 duration-200">
          {/* Year Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full justify-center">
            <button
              onClick={() => {
                handleFilterChange(null, null);
                setFilterExpanded(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-semibold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                selectedYear === null
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              All
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleFilterChange(year, null)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedYear === year
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Month Selector (if a year is selected) */}
          {selectedYear && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full justify-center border-t border-zinc-200/20 dark:border-zinc-800/25 pt-2.5">
              <button
                onClick={() => handleFilterChange(selectedYear, null)}
                className={`px-2.5 py-1.5 rounded-md text-[9px] uppercase font-semibold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedMonth === null
                    ? "bg-zinc-900/80 dark:bg-white/80 text-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                All Months
              </button>
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => handleFilterChange(selectedYear, month)}
                  className={`px-2.5 py-1.5 rounded-md text-[9px] font-semibold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedMonth === month
                      ? "bg-zinc-900/80 dark:bg-white/80 text-white dark:text-zinc-950 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  {MONTH_NAMES[month]}
                </button>
              ))}
            </div>
          )}

          {/* Close Button / Collapse Indicator */}
          <button
            onClick={() => setFilterExpanded(false)}
            className="mt-1 text-[9px] font-semibold font-mono uppercase tracking-widest text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-white cursor-pointer px-3 py-1 rounded hover:bg-zinc-100/10 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
