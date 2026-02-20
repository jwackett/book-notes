import Link from "next/link";
import type { BookEntry } from "@/lib/types";
import RatingDisplay from "./RatingDisplay";
import { getCoverUrl } from "@/lib/utils";

interface BookCardProps {
  book: BookEntry;
}

export default function BookCard({ book }: BookCardProps) {
  const coverSrc = book.coverImage || getCoverUrl(book.isbn);

  return (
    <Link
      href={`/book/${book.slug}`}
      className="flex gap-4 py-5 border-b border-gray-100 no-underline hover:bg-gray-50 -mx-3 px-3 rounded transition-colors"
    >
      {coverSrc ? (
        <img
          src={coverSrc}
          alt=""
          className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No cover</span>
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
        <div className="mt-2">
          <RatingDisplay rating={book.rating} />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {book.categories.map((cat) => (
            <span
              key={cat}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
