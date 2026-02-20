import Link from "next/link";

export default function Header() {
  return (
    <header className="mb-10">
      <Link href="/" className="no-underline">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-700">
          Book Notes
        </h1>
      </Link>
      <p className="text-gray-500 text-sm mt-1">
        Notes and ratings on books I&apos;ve read
      </p>
    </header>
  );
}
