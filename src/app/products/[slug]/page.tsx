import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products, formatPrice } from "@/data/products";
import { ProductGallery } from "@/components/three/ProductGallery";
import { ProductVariantPicker } from "@/components/ui/ProductVariantPicker";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);
  const fallbackRelated = products
    .filter((p) => p.slug !== product.slug && !related.some((r) => r.slug === p.slug))
    .slice(0, Math.max(0, 3 - related.length));
  const relatedProducts = [...related, ...fallbackRelated];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-5 pt-8 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <Link href="/" className="transition hover:text-neutral-700">Home</Link>
          <span>/</span>
          <Link href="/catalogue" className="transition hover:text-neutral-700">Catalogue</Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </div>
      </nav>

      {/* Product main */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery + optional 3D viewer */}
          <div>
            <ProductGallery
              images={product.images}
              modelUrl={product.model3d}
              scale={product.modelScale ?? 1.6}
              position={product.modelPosition ?? [0, 0, 0]}
              productName={product.name}
              autoRotate
            />
          </div>

          {/* Info */}
          <div className="lg:pl-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-600">
                {product.category}
              </span>
              {product.badge && (
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
              )}
              {!product.inStock && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Out of stock
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-neutral-600">{product.tagline}</p>

            <p className="mt-6 text-3xl font-bold text-neutral-900">
              {formatPrice(product)}
            </p>

            {/* Variant selector */}
            {product.variants.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium text-neutral-700">Color</p>
                <ProductVariantPicker variants={product.variants} />
              </div>
            )}

            <p className="mt-8 leading-relaxed text-neutral-600">
              {product.description}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to cart" : "Sold out"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-8 py-3.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                Save to wishlist
              </button>
            </div>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-neutral-100 py-6 text-center">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Free ship</p>
                <p className="text-xs text-neutral-600">Orders over $50</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">30 days</p>
                <p className="text-xs text-neutral-600">Free returns</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">2 years</p>
                <p className="text-xs text-neutral-600">Warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {product.features.length > 0 && (
        <section className="bg-neutral-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Why you&apos;ll love it
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((f, i) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      {product.specifications.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Specifications
          </h2>
          <div className="mt-8 divide-y divide-neutral-100">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-4 py-4 text-sm">
                <div className="text-neutral-600">{spec.label}</div>
                <div className="font-medium text-neutral-900">{spec.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {(related.length > 0 || fallbackRelated.length > 0) && (
        <section className="bg-neutral-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              You may also like
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={p.heroImage}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-600">
                      {p.category}
                    </p>
                    <h3 className="mt-1 font-semibold text-neutral-900">{p.name}</h3>
                    <p className="mt-1 text-sm font-bold">{formatPrice(p)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}