"use client";

import { useRouter } from "next/navigation";

interface SortSelectProps {
  defaultValue: string;
  basePath: string;
}

export function SortSelect({ defaultValue, basePath }: SortSelectProps) {
  const router = useRouter();

  return (
    <select
      defaultValue={defaultValue}
      className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none"
      onChange={(e) => {
        const val = e.target.value;
        const sep = basePath.includes("?") ? "&" : "?";
        router.push(val === "featured" ? basePath : `${basePath}${sep}sort=${val}`);
      }}
    >
      <option value="featured">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}