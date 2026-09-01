import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-5 py-12 md:flex md:items-start md:justify-between">
        {/* Brand */}
        <div className="mb-8 md:mb-0">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold tracking-tight">
              L
            </span>
            <span className="text-lg font-bold tracking-tight">Lumière</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-neutral-600 leading-relaxed">
            Premium products brought to life through interactive 3D visualization.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12 text-sm">
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Products</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/catalogue" className="transition hover:text-neutral-900">Catalogue</Link></li>
              <li><Link href="/catalogue" className="transition hover:text-neutral-900">New arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Company</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><span className="cursor-default">About</span></li>
              <li><span className="cursor-default">Support</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Lumière. All rights reserved.
        </div>
      </div>
    </footer>
  );
}