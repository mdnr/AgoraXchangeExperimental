"use client";

interface ViewerControlsProps {
  visible: boolean;
  onReset: () => void;
  hint: string;
}

export function ViewerControls({ visible, onReset, hint }: ViewerControlsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 pb-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="rounded-full bg-white/80 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
        {hint}
      </span>
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="hidden text-[11px] font-medium text-neutral-600 sm:inline">
          Controls
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-neutral-800"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset view
        </button>
      </div>
    </div>
  );
}
