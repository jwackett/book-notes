"use client";

import { useState, useMemo } from "react";
import type { BookEntry, SortOption } from "@/lib/types";
import BookCard from "./BookCard";
import CategoryFilter from "./CategoryFilter";
import SortControls from "./SortControls";

interface BookListProps {
  books: BookEntry[];
  categories: string[];
}

export default function BookList({ books, categories }: BookListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const filteredAndSorted = useMemo(() => {
    let result = books;

    if (selectedCategory) {
      result = result.filter((b) => b.categories.includes(selectedCategory));
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "date":
          if (!a.dateRead && !b.dateRead) return 0;
          if (!a.dateRead) return 1;
          if (!b.dateRead) return -1;
          return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [books, selectedCategory, sortBy]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <SortControls current={sortBy} onChange={setSortBy} />
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          No books found in this category.
        </p>
      ) : (
        <div>
          {filteredAndSorted.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
