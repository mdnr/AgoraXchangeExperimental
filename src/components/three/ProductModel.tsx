"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ProductModelProps {
  url: string;
  profile: {
    useDraco: boolean;
    dracoDecoderPath?: string;
  };
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Loads a single GLB/glTF model with optional Draco mesh compression.
 * Signals the parent when the model is ready or fails to load.
 *
 * `useGLTF.preload` (below) can be used for future lazy-loading / CDN flows.
 */
export function ProductModel({ url, profile, onLoad, onError }: ProductModelProps) {
  const notifiedRef = useRef(false);

  // `useDraco` accepts a boolean (CDN path auto) or a custom decoder path string.
  // Prefix a local decoder path with the GitHub Pages base path so the decoder
  // files resolve when hosted from a sub-directory.
  const draco: string | boolean = profile.useDraco
    ? (profile.dracoDecoderPath
        ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${profile.dracoDecoderPath}`
        : true)
    : false;

  const model = useGLTF(url, draco);

  // Derive a fitted clone (normalized to a unit box, centered at origin) from
  // the shared loader cache without mutating it.
  const fitted = useMemo(() => {
    if (!model.scene) return null;
    const clone = model.scene.clone(true);

    // 1. Recenter: subtract the geometry center so the world origin is the
    //    exact middle of the model.
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.copy(center).multiplyScalar(-1);

    // 2. Normalize scale to a unit box. Scaling now happens around the
    //    geometry center (already at the origin), keeping the model centered.
    const recenteredBox = new THREE.Box3().setFromObject(clone);
    const size = recenteredBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      clone.scale.setScalar(1 / maxDim);
    }

    return clone;
  }, [model.scene]);

  useEffect(() => {
    if (fitted) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onLoad?.();
      }
    } else {
      onError?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitted]);

  if (!fitted) {
    return null;
  }

  return <primitive object={fitted} />;
}

/** Future lazy-loading hook — prefetch a model into the shared loader cache. */
export function preloadModel(url: string, dracoPath?: boolean | string) {
  useGLTF.preload(url, dracoPath);
}