"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold tracking-tight">
            L
          </span>
          <span className="text-lg font-bold tracking-tight">
            Lumière
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-neutral-600 transition hover:text-neutral-900">Home</Link>
          <Link href="/catalogue" className="text-neutral-600 transition hover:text-neutral-900">Catalogue</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/catalogue"
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Shop now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 px-5 py-5 space-y-3 bg-white">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-neutral-700">Home</Link>
          <Link href="/catalogue" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-neutral-700">Catalogue</Link>
          <Link
            href="/catalogue"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block w-full rounded-full bg-neutral-900 px-5 py-2.5 text-center text-sm font-medium text-white"
          >
            Shop now
          </Link>
        </div>
      )}
    </header>
  );
}