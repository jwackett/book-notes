import { marked } from "marked";

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCoverUrl(isbn: string | null): string | null {
  if (!isbn) return null;
  const cleanIsbn = isbn.replace(/-/g, "");
  return `https://books.google.com/books/content?vid=isbn:${cleanIsbn}&printsec=frontcover&img=1&zoom=1`;
}

// Amazon Associates affiliate tag — replace with your tag when you have one
const AMAZON_AFFILIATE_TAG = "jordanwackett-20";

export function getAmazonUrl(isbn: string): string {
  const cleanIsbn = isbn.replace(/-/g, "");
  const params = new URLSearchParams({ k: cleanIsbn });
  if (AMAZON_AFFILIATE_TAG) params.set("tag", AMAZON_AFFILIATE_TAG);
  return `https://www.amazon.com/s?${params.toString()}`;
}
