"use client";

import { useState } from "react";

interface ProductVariantPickerProps {
  variants: { id: string; name: string; color: string; subtitle?: string }[];
}

export function ProductVariantPicker({ variants }: ProductVariantPickerProps) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? null);
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div>
      <div className="mt-3 flex items-center gap-3">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            title={v.name}
            aria-label={v.name}
            onClick={() => setSelectedId(v.id)}
            className="variant-swatch inline-flex h-8 w-8 rounded-full border border-neutral-200"
            style={{ backgroundColor: v.color }}
            data-active={selectedId === v.id}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-neutral-600">
        {selected ? (
          <>
            <span className="font-medium text-neutral-900">{selected.name}</span>
            <span> · {selected.subtitle}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}