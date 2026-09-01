"use client";

export function ViewerLoading({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-neutral-900" />
      </div>
      <p className="text-xs font-medium tracking-wide text-neutral-600 uppercase">
        Loading 3D model…
      </p>
    </div>
  );
}
