"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useGalleryContext } from "@/components/gallery/gallery-provider";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function GalleryFilter() {
  const { state, actions } = useGalleryContext();
  const {
    selectedYear,
    selectedMonth,
    filterExpanded,
    years,
    months,
    items,
  } = state;
  const { handleFilterChange, setFilterExpanded } = actions;

  const activeFilterLabel = useMemo(() => {
    if (!selectedYear) return "All memories";
    if (selectedMonth === null) return selectedYear;
    return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (!filterExpanded) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterExpanded(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [filterExpanded, setFilterExpanded]);

  const resetFilter = () => {
    handleFilterChange(null, null);
    setFilterExpanded(false);
  };

  return (
    <div
      className="fixed top-[8.25rem] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center pointer-events-auto select-none sm:top-[7rem]"
      style={{ viewTransitionName: "gallery-filter" }}
    >
      <button
        type="button"
        onClick={() => setFilterExpanded(!filterExpanded)}
        aria-expanded={filterExpanded}
        aria-haspopup="dialog"
        className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
          filterExpanded
            ? "border-zinc-400/60 bg-white/90 text-zinc-950 dark:border-zinc-600/70 dark:bg-zinc-900/90 dark:text-white"
            : "border-zinc-200/50 bg-white/65 text-zinc-700 hover:border-zinc-300/70 hover:bg-white/90 dark:border-zinc-800/50 dark:bg-zinc-950/65 dark:text-zinc-300 dark:hover:border-zinc-700/70 dark:hover:bg-zinc-900/90"
        }`}
      >
        <span className="text-zinc-400 dark:text-zinc-500">Archive</span>
        <span className="h-3 w-px bg-zinc-300/70 dark:bg-zinc-700/70" />
        <span>{activeFilterLabel}</span>
        <ChevronDown size={13} className={`text-zinc-400 transition-transform duration-300 ${filterExpanded ? "rotate-180" : ""}`} />
      </button>

      {filterExpanded && (
        <div
          role="dialog"
          aria-label="Filter memories by date"
          className="absolute top-[calc(100%+0.6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/90 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.14)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-zinc-800/60 dark:bg-zinc-950/90 dark:shadow-[0_28px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-start justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800/60">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                Memory index
              </p>
              <p className="mt-1 text-sm font-medium tracking-tight text-zinc-950 dark:text-white">
                {items.length} {items.length === 1 ? "memory" : "memories"}
              </p>
            </div>
            {(selectedYear || selectedMonth !== null) && (
              <button
                type="button"
                onClick={resetFilter}
                className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          <div className="mt-4">
            <p className="mb-2 px-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
              Year
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FilterOption active={selectedYear === null} onClick={() => handleFilterChange(null, null)}>
                All
              </FilterOption>
              {years.map((year) => (
                <FilterOption key={year} active={selectedYear === year} onClick={() => handleFilterChange(year, null)}>
                  {year}
                </FilterOption>
              ))}
            </div>
          </div>

          {selectedYear && (
            <div className="mt-4 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
              <p className="mb-2 px-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
                {selectedYear} / Month
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                <FilterOption
                  className="col-span-4"
                  active={selectedMonth === null}
                  onClick={() => {
                    handleFilterChange(selectedYear, null);
                    setFilterExpanded(false);
                  }}
                >
                  All months
                </FilterOption>
                {MONTH_NAMES.map((name, index) => {
                  const available = months.includes(index);
                  return (
                    <FilterOption
                      key={name}
                      disabled={!available}
                      active={selectedMonth === index}
                      onClick={() => {
                        handleFilterChange(selectedYear, index);
                        setFilterExpanded(false);
                      }}
                    >
                      {name}
                    </FilterOption>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterOption({
  active,
  disabled = false,
  className = "",
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[10px] font-mono tracking-wider transition-all duration-200 ${className} ${
        disabled
          ? "cursor-not-allowed opacity-20"
          : active
            ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
            : "bg-zinc-100/70 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-950 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
