"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterOption = {
  id: string;
  label: string;
};

type FiltersBarProps = {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
};

export function FiltersBar({ filters, activeFilter, onFilterChange }: FiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-12 justify-center">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          variant={activeFilter === filter.id ? "gold" : "outline"}
          size="sm"
          className={cn(
            "rounded-full uppercase tracking-wide transition-all text-xs sm:text-sm",
            activeFilter === filter.id
              ? "shadow-lg hover:shadow-xl"
              : "hover:border-[#D4AF37]/50"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
