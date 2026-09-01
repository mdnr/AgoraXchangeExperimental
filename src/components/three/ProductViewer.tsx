"use client";

import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type ElementRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
} from "@react-three/drei";
import { Group } from "three";
import {
  defaultModelQuality,
  modelQualityProfiles,
  resolveModelUrl,
  viewerConfig,
} from "@/lib/modelConfig";
import { ProductModel } from "./ProductModel";
import { ViewerLoading } from "./ViewerLoading";
import { ViewerControls } from "./ViewerControls";

export interface ProductViewerProps {
  /** Source URL/path of the GLB/glTF model. */
  modelUrl: string;
  /** Optional scale multiplier for small/large models. */
  scale?: number;
  /** Optional position offset [x, y, z] to center the model. */
  position?: [number, number, number];
  /** Fallback title for accessibility. */
  productName?: string;
  /** Enable auto-rotate when idle. */
  autoRotate?: boolean;
  /** Optional quality profile ("high" | "medium" | "low"). */
  quality?: keyof typeof modelQualityProfiles;
  /** Height in pixels of the viewer container. */
  height?: number | string;
  className?: string;
}

/**
 * Reusable, self-contained 3D product viewer.
 *
 * Renders any GLB/glTF model with rotate / zoom / pan controls, loading and
 * error states, and a reset-camera action. It is fully isolated so the same
 * component can display any product's model.
 */
export function ProductViewer({
  modelUrl,
  scale = 1,
  position = [0, 0, 0],
  productName = "Product",
  autoRotate = true,
  quality = defaultModelQuality,
  height = 520,
  className = "",
}: ProductViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modelKey, setModelKey] = useState(0);
  const profile = modelQualityProfiles[quality] ?? modelQualityProfiles.high;

  const resolvedUrl = useMemo(() => resolveModelUrl(modelUrl), [modelUrl]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const resetView = useCallback(() => {
    // Bump the key to remount the model + reset camera transform.
    setModelKey((k) => k + 1);
    setIsLoading(true);
    setHasError(false);
  }, []);

  const retry = useCallback(() => {
    resetView();
  }, [resetView]);

  return (
    <div
      className={`product-viewer relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-200 ${className}`}
      style={{ height }}
      role="application"
      aria-label={`Interactive 3D view of ${productName}`}
    >
      <CanvasErrorBoundary key={modelKey} onError={handleError}>
        <Canvas
          key={modelKey}
          camera={{ fov: viewerConfig.fov, near: viewerConfig.near, far: viewerConfig.far, position: [0, 0, 4] }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <Scene
              modelUrl={resolvedUrl}
              scale={scale}
              position={position}
              profile={profile}
              autoRotate={autoRotate}
              onLoad={handleLoad}
              onError={handleError}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>

      <ViewerLoading visible={isLoading && !hasError} />

      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Couldn&apos;t load the 3D model</p>
            <p className="mt-1 text-sm text-neutral-600">The model may be temporarily unavailable.</p>
          </div>
          <button
            onClick={retry}
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Try again
          </button>
        </div>
      )}

      {!hasError && (
        <ViewerControls
          visible={!isLoading}
          onReset={resetView}
          hint={autoRotate ? "Drag to rotate · Scroll to zoom · Right-drag to pan" : "Drag to rotate · Scroll to zoom · Right-drag to pan"}
        />
      )}
    </div>
  );
}

function Scene({
  modelUrl,
  scale,
  position,
  profile,
  autoRotate,
  onLoad,
  onError,
}: {
  modelUrl: string;
  scale: number;
  position: [number, number, number];
  profile: { useDraco: boolean; dracoDecoderPath?: string };
  autoRotate: boolean;
  onLoad: () => void;
  onError: () => void;
}) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls> | null>(null);
  const group = useRef<Group>(null);

  useEffect(() => {
    // Initial look-at after the model mounts.
    const t = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} />
      <directionalLight position={[-5, 4, -4]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 3, 0]} intensity={0.4} />

      <group ref={group} position={position} scale={scale}>
        <ProductModel
          url={modelUrl}
          profile={profile}
          onLoad={onLoad}
          onError={onError}
        />
      </group>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={8} blur={2.4} far={3} />

      <Environment preset="city" resolution={128} frames={1} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableZoom
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minDistance={viewerConfig.minDistance}
        maxDistance={viewerConfig.maxDistance}
        rotateSpeed={viewerConfig.rotateSpeed}
        zoomSpeed={viewerConfig.zoomSpeed}
      />
    </>
  );
}

/**
 * Catches errors thrown while loading/parsing the GLB model (e.g. a rejected
 * suspense promise from `useGLTF`) and surfaces them to the parent via the
 * `onError` callback so the error state renders instead of crashing the page.
 */
class CanvasErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return null; // parent renders the error overlay
    }
    return this.props.children;
  }
}
