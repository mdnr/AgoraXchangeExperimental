import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 inline-block rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold text-white uppercase tracking-wider">
            {product.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100 backdrop-blur">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-600">
              {product.category}
            </p>
            <h3 className="mt-1 truncate text-base font-semibold text-neutral-900">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
              {product.tagline}
            </p>
          </div>
          <span className="shrink-0 text-lg font-bold text-neutral-900">
            {formatPrice(product)}
          </span>
        </div>

        {/* Color variants */}
        {product.variants.length > 0 && (
          <div className="mt-4 flex items-center gap-1.5">
            {product.variants.map((v) => (
              <span
                key={v.id}
                title={v.name}
                className="inline-block h-4 w-4 rounded-full border border-neutral-200"
                style={{ backgroundColor: v.color }}
              />
            ))}
            <span className="ml-1 text-[11px] text-neutral-600">
              {product.variants.length} colors
            </span>
          </div>
        )}

        {/* 3D badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Interactive 3D
        </div>
      </div>
    </Link>
  );
}