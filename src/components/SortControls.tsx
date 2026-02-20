"use client";

import type { SortOption } from "@/lib/types";

interface SortControlsProps {
  current: SortOption;
  onChange: (sort: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Rating" },
  { value: "date", label: "Date Read" },
  { value: "title", label: "Title" },
];

export default function SortControls({ current, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-gray-400 mr-1">Sort:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-0.5 rounded transition-colors ${
            current === opt.value
              ? "text-gray-900 font-medium"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
