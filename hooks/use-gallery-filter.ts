"use client";

import { useState, useMemo } from "react";
import type { PhotoProps } from "@/utils/types";

// Filter photos list based on year and month selection
export function filterPhotosByDate(photos: PhotoProps[], year: string | null, month: number | null): PhotoProps[] {
  return photos.filter((photo) => {
    if (!photo.createdAt) return !year;
    const date = new Date(photo.createdAt);
    if (year && date.getFullYear().toString() !== year) return false;
    if (month !== null && date.getMonth() !== month) return false;
    return true;
  });
}

export function useGalleryFilter(photos: PhotoProps[]) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [filterExpanded, setFilterExpanded] = useState(false);

  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    photos.forEach((photo) => {
      if (photo.createdAt) {
        const year = new Date(photo.createdAt).getFullYear().toString();
        uniqueYears.add(year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a));
  }, [photos]);

  const months = useMemo(() => {
    if (!selectedYear) return [];
    const uniqueMonths = new Set<number>();
    photos.forEach((photo) => {
      if (photo.createdAt) {
        const date = new Date(photo.createdAt);
        if (date.getFullYear().toString() === selectedYear) {
          uniqueMonths.add(date.getMonth());
        }
      }
    });
    return Array.from(uniqueMonths).sort((a, b) => a - b);
  }, [photos, selectedYear]);

  const filteredPhotos = useMemo(() => {
    return filterPhotosByDate(photos, selectedYear, selectedMonth);
  }, [photos, selectedYear, selectedMonth]);

  const items = useMemo(() =>
    filteredPhotos.map((photo) => ({ type: "photo" as const, photo })),
  [filteredPhotos]);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    filterExpanded,
    setFilterExpanded,
    years,
    months,
    filteredPhotos,
    items,
  };
}
