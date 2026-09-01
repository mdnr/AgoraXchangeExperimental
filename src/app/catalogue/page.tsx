"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, getCategories } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SortSelect } from "@/components/ui/SortSelect";

export default function CataloguePage() {
  return (
    <Suspense>
      <Catalogue />
    </Suspense>
  );
}

function Catalogue() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;

  const categories = ["All", ...getCategories()];

  const filtered =
    category && category !== "All"
      ? products.filter((p) => p.category === category)
      : [...products];

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const baseCatalogPath = category && category !== "All"
    ? `/catalogue?category=${encodeURIComponent(category)}`
    : "/catalogue";

  return (
    <>
      {/* Page header */}
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">
            Catalogue
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
            All products
          </h1>
          <p className="mt-4 max-w-lg text-neutral-600">
            Every product shown below includes a fully interactive 3D view. Rotate, zoom and inspect
            the details before you buy.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = (category ?? "All") === c;
              const href = c === "All" ? "/catalogue" : `/catalogue?category=${encodeURIComponent(c)}`;
              return (
                <Link
                  key={c}
                  href={href}
                  className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-600">Sort</span>
            <SortSelect defaultValue={sort ?? "featured"} basePath={baseCatalogPath} />
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg font-semibold text-neutral-900">No products in this category yet.</p>
            <Link href="/catalogue" className="mt-3 inline-block text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900">
              View all products
            </Link>
          </div>
        )}
      </section>
    </>
  );
}