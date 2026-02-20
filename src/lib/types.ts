export interface BookEntry {
  id: string;
  title: string;
  author: string;
  rating: number;
  categories: string[];
  summary: string;
  coverImage: string | null;
  slug: string;
  dateRead: string | null;
  isbn: string | null;
}

export interface BookDetail extends BookEntry {
  doi: string | null;
  content: string;
}

export type SortOption = "rating" | "date" | "title";
