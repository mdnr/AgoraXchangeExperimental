"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ProductViewer } from "./ProductViewer";
import type { ProductViewerProps } from "./ProductViewer";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps extends ProductViewerProps {
  images: GalleryImage[];
}

const ACCEPTED_EXTENSIONS = [".glb", ".gltf"];

/**
 * Product media gallery: shows a clickable thumbnail strip that swaps the main
 * image. The 3D view is optional — activated via a corner button and exited
 * with a dedicated back button. The WebGL canvas/GLB only loads on demand.
 *
 * Supports uploading your own GLB/glTF so you can preview a custom model in the
 * viewer. The uploaded file is kept in the browser only (blob URL) and is
 * cleared when leaving the page.
 */
export function ProductGallery({
  images,
  modelUrl,
  scale,
  position,
  productName,
  autoRotate,
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [active3D, setActive3D] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Revoke any blob URL created for an uploaded model on unmount.
    return () => {
      if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    };
  }, [uploadedUrl]);

  const current = images[selected];
  const activeModelUrl = uploadedUrl ?? modelUrl;

  const handleFile = (file: File | null) => {
    setUploadError(null);
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setUploadError(
        `Unsupported file type "${ext || "?"}". Please upload a .glb or .gltf model.`
      );
      return;
    }
    if (file.size > 60 * 1024 * 1024) {
      setUploadError("Model is too large (max 60 MB).");
      return;
    }

    // Replace any previous uploaded model URL.
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    const url = URL.createObjectURL(file);
    setUploadedUrl(url);
    setUploadedName(file.name);
    setActive3D(true);
  };

  const clearUpload = () => {
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedUrl(null);
    setUploadedName(null);
    // Reset viewer so the product model reloads.
    setActive3D(false);
  };

  return (
    <div>
      {/* Main media area */}
      <div className="product-viewer relative overflow-hidden rounded-2xl bg-neutral-100">
        <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]">
          {active3D ? (
            <>
              <ProductViewer
                modelUrl={activeModelUrl}
                scale={scale}
                position={position}
                productName={productName}
                autoRotate={autoRotate}
                height="100%"
              />
              {/* Exit 3D */}
              <button
                type="button"
                onClick={() => setActive3D(false)}
                className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to photos
              </button>
              {/* Uploaded model chip */}
              {uploadedUrl && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="max-w-[160px] truncate sm:max-w-[220px]">
                    Your model{uploadedName ? ` · ${uploadedName}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={clearUpload}
                    aria-label="Clear uploaded model"
                    className="ml-0.5 grid h-5 w-5 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Image
                src={current.src}
                alt={current.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Image counter */}
              <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
                {selected + 1} / {images.length}
              </span>
              {/* Optional 3D, corner button */}
              <button
                type="button"
                onClick={() => setActive3D(true)}
                className="group absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-lg shadow-black/10 transition hover:scale-105 hover:bg-neutral-100"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </span>
                View in 3D
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload error */}
      {uploadError && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {uploadError}
        </p>
      )}

      {/* Thumbnail strip + upload tile */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setSelected(i);
              setActive3D(false);
            }}
            aria-pressed={i === selected && !active3D}
            aria-label={`View image ${i + 1}: ${img.alt}`}
            className={`overflow-hidden rounded-xl border bg-neutral-100 transition ${
              i === selected && !active3D
                ? "border-neutral-900 ring-2 ring-neutral-900"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </button>
        ))}

        {/* Upload your own model */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-3 py-4 text-neutral-600 transition hover:border-neutral-500 hover:bg-neutral-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-xs font-semibold">Upload</span>
          <span className="text-[10px] text-neutral-600">your own .glb</span>
        </button>
      </div>
    </div>
  );
}