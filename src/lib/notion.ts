import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { BookEntry, BookDetail } from "./types";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

type Properties = PageObjectResponse["properties"];
type PropertyValue = Properties[string];

function getRichText(prop: PropertyValue | undefined): string {
  if (prop?.type === "rich_text") {
    return (prop.rich_text as RichTextItemResponse[])
      .map((t) => t.plain_text)
      .join("");
  }
  if (prop?.type === "title") {
    return (prop.title as RichTextItemResponse[])
      .map((t) => t.plain_text)
      .join("");
  }
  return "";
}

function getNumber(prop: PropertyValue | undefined): number {
  if (prop?.type === "number") return prop.number ?? 0;
  return 0;
}

function getMultiSelect(prop: PropertyValue | undefined): string[] {
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function getUrl(prop: PropertyValue | undefined): string | null {
  if (prop?.type === "url") return prop.url;
  return null;
}

function getDate(prop: PropertyValue | undefined): string | null {
  if (prop?.type === "date") return prop.date?.start ?? null;
  return null;
}

function getFileUrl(prop: PropertyValue | undefined): string | null {
  if (prop?.type === "files" && prop.files.length > 0) {
    const file = prop.files[0];
    if (file.type === "file") return file.file.url;
    if (file.type === "external") return file.external.url;
  }
  return null;
}

function getSelect(prop: PropertyValue | undefined): string | null {
  if (prop?.type === "select") return prop.select?.name ?? null;
  return null;
}

function pageToBookEntry(page: PageObjectResponse): BookEntry {
  const p = page.properties;
  return {
    id: page.id,
    title: getRichText(p["Book Title"]),
    author: getRichText(p["Author"]),
    rating: getNumber(p["Rating"]),
    categories: getMultiSelect(p["Category"]),
    summary: getRichText(p["Summary"]),
    coverImage: getFileUrl(p["Cover Image"]),
    slug: getRichText(p["Slug"]),
    dateRead: getDate(p["Date Read"]),
    isbn: getRichText(p["ISBN"]) || null,
  };
}

export async function getAllBooks(): Promise<BookEntry[]> {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  // Paginate through all results
  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Rating", direction: "descending" }],
      start_cursor: cursor,
    });

    results.push(
      ...response.results.filter(
        (r): r is PageObjectResponse => "properties" in r
      )
    );

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results.map(pageToBookEntry);
}

export async function getAllBookSlugs(): Promise<string[]> {
  const books = await getAllBooks();
  return books.map((b) => b.slug).filter(Boolean);
}

export async function getBookBySlug(
  slug: string
): Promise<BookDetail | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Status", select: { equals: "Published" } },
      ],
    },
  });

  const page = response.results.find(
    (r): r is PageObjectResponse => "properties" in r
  );
  if (!page) return null;

  const entry = pageToBookEntry(page);

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);

  return {
    ...entry,
    doi: getUrl(page.properties["DOI"]),
    content: mdString.parent,
  };
}

export async function getAllCategories(): Promise<string[]> {
  const books = await getAllBooks();
  const categories = new Set<string>();
  books.forEach((b) => b.categories.forEach((c) => categories.add(c)));
  return Array.from(categories).sort();
}
