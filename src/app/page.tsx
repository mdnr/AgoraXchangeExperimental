import Image from "next/image";
import Link from "next/link";
import { products, getFeaturedProducts } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════ */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-28 md:py-36">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Copy */}
            <div className="relative z-10">
              <p className="animate-fade-up delay-100 inline-block rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
                New Collection · 2026
              </p>
              <h1 className="animate-fade-up delay-200 mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white">
                See Products <br />
                in a New Light
              </h1>
              <p className="animate-fade-up delay-300 mt-5 max-w-md text-base sm:text-lg leading-relaxed text-white/60">
                Explore every curve and material with interactive 3D models. Rotate, zoom, and experience
                our premium collection before you decide.
              </p>

              <div className="animate-fade-up mt-8 flex flex-wrap gap-4">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 shadow-lg shadow-black/10"
                >
                  Browse catalogue
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`#featured`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View featured
                </Link>
              </div>

              {/* Trust badges */}
              <div className="animate-fade-up mt-10 flex items-center gap-6 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Free shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  2-year warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  30-day returns
                </span>
              </div>
            </div>

            {/* Hero image mosaic */}
            <div className="relative hidden md:block">
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  {featured.slice(0, 1).map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="group relative block overflow-hidden rounded-2xl bg-white/10 backdrop-blur"
                    >
                      <Image
                        src={p.heroImage}
                        alt={p.name}
                        width={400}
                        height={500}
                        className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </Link>
                  ))}
                </div>
                <div className="space-y-4">
                  {featured.slice(1, 2).map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="group relative block overflow-hidden rounded-2xl bg-white/10 backdrop-blur"
                    >
                      <Image
                        src={p.heroImage}
                        alt={p.name}
                        width={400}
                        height={500}
                        className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </Link>
                  ))}
                  <Link
                    href="/catalogue"
                    className="group flex h-[196px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:bg-white/10"
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-white/40 transition group-hover:text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                      <span className="mt-2 block text-xs font-medium text-white/60">
                        View all {products.length} products
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════════ */}
      <section id="featured" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">Featured</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
              Hand-picked for you
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition hover:text-neutral-500"
          >
            View all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ALL PRODUCTS
          ═══════════════════════════════════════════════ */}
      <section className="bg-neutral-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-600">Collection</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                Explore everything
              </h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to see it for real?
          </h2>
          <p className="relative mt-4 text-base text-white/50 max-w-md mx-auto">
            Rotate, zoom and explore every detail in our interactive 3D viewer.
          </p>
          <div className="relative mt-8">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 shadow-lg shadow-black/20"
            >
              Browse catalogue
              <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}