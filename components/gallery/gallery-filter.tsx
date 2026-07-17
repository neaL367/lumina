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
    if (!selectedYear) return "All Memory";
    if (selectedMonth === null) return selectedYear;
    return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
  }, [selectedYear, selectedMonth]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto select-none">
      {/* Toggle Pill */}
      <button
        onClick={() => setFilterExpanded(!filterExpanded)}
        className={`flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/70 dark:bg-zinc-950/65 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/40 text-[10px] text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:dark:text-white hover:bg-white/90 dark:hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] font-sans tracking-widest uppercase font-semibold ${
          filterExpanded ? "scale-[1.02] border-zinc-300 dark:border-zinc-700" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${filterExpanded ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
        <span>{activeFilterLabel}</span>
      </button>

      {/* Dropdown Menu */}
      {filterExpanded && (
        <div className="absolute top-[calc(100%+8px)] flex flex-col gap-4 p-4 rounded-3xl bg-white/80 dark:bg-zinc-950/75 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/45 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] min-w-[320px] max-w-[90vw] animate-in fade-in slide-in-from-top-3 duration-300 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-sans">
              Filter by Date
            </span>
            <button
              onClick={() => {
                handleFilterChange(null, null);
                setFilterExpanded(false);
              }}
              className="text-[9px] font-bold uppercase tracking-wider text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Year Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 px-1">
              Year
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleFilterChange(null, null)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedYear === null
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm scale-105"
                    : "bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                }`}
              >
                ALL
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleFilterChange(year, null)}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedYear === year
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm scale-105"
                      : "bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Month Section */}
          <div className={`flex flex-col gap-2 transition-all duration-300 ${selectedYear ? "opacity-100 max-h-48" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"}`}>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 px-1 border-t border-zinc-150/40 dark:border-zinc-800/40 pt-3">
              Month
            </span>
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              <button
                onClick={() => handleFilterChange(selectedYear, null)}
                className={`col-span-4 py-1.5 rounded-lg text-[9px] uppercase font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer text-center ${
                  selectedMonth === null
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                    : "bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                }`}
              >
                ALL MONTHS
              </button>
              {MONTH_NAMES.map((name, index) => {
                const isAvailable = months.includes(index);
                return (
                  <button
                    key={name}
                    disabled={!isAvailable}
                    onClick={() => handleFilterChange(selectedYear, index)}
                    className={`py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer text-center ${
                      !isAvailable
                        ? "opacity-20 cursor-not-allowed text-zinc-400 dark:text-zinc-650"
                        : selectedMonth === index
                        ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm scale-105"
                        : "bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
