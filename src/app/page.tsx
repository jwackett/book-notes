import { getAllBooks, getAllCategories } from "@/lib/notion";
import BookList from "@/components/BookList";

export const revalidate = 3600;

export default async function HomePage() {
  const [books, categories] = await Promise.all([
    getAllBooks(),
    getAllCategories(),
  ]);

  return (
    <section>
      <p className="text-gray-500 mb-8">
        {books.length} book{books.length !== 1 ? "s" : ""} rated and reviewed.
      </p>
      <BookList books={books} categories={categories} />
    </section>
  );
}
