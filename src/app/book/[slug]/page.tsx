import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBookSlugs, getBookBySlug } from "@/lib/notion";
import { markdownToHtml, formatDate, getCoverUrl, getAmazonUrl } from "@/lib/utils";
import RatingDisplay from "@/components/RatingDisplay";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Book Not Found" };

  return {
    title: `${book.title} by ${book.author} | Book Notes`,
    description: book.summary || `Notes on ${book.title} by ${book.author}`,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const coverSrc = book.coverImage || getCoverUrl(book.isbn);
  const contentHtml = markdownToHtml(book.content);

  return (
    <article>
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-gray-600 no-underline mb-6 inline-block"
      >
        &larr; All books
      </Link>

      <div className="flex gap-6 mb-8">
        {coverSrc && (
          <img
            src={coverSrc}
            alt=""
            className="w-32 h-auto rounded shadow-md flex-shrink-0"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-lg text-gray-500 mt-1">by {book.author}</p>
          <div className="mt-3 flex items-center gap-4">
            <RatingDisplay rating={book.rating} />
            {book.dateRead && (
              <span className="text-sm text-gray-400">
                Read: {formatDate(book.dateRead)}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
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
      </div>

      {book.summary && (
        <p className="text-gray-600 italic border-l-2 border-gray-200 pl-4 mb-8">
          {book.summary}
        </p>
      )}

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-10 pt-4 border-t border-gray-200 flex gap-4 text-sm text-gray-400">
        {book.isbn && (
          <a
            href={getAmazonUrl(book.isbn)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            Amazon
          </a>
        )}
        {book.doi && (
          <a
            href={book.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            DOI
          </a>
        )}
      </div>
    </article>
  );
}
