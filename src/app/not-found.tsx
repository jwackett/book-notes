import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Book not found
      </h2>
      <p className="text-gray-500 mb-6">
        The book you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        &larr; Back to all books
      </Link>
    </div>
  );
}
