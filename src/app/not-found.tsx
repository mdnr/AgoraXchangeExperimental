import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
        404 — Not found
      </p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-md text-neutral-600">
        The page may have moved, or the product no longer exists. Take a look at the catalogue
        instead.
      </p>
      <Link
        href="/catalogue"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
      >
        Browse catalogue
      </Link>
    </div>
  );
}