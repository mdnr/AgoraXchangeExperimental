/**
 * Central configuration for 3D model loading.
 *
 * Kept separate from the viewer so future features (Draco/KTX2 compression,
 * multiple quality levels, CDN hosting, lazy loading) can be introduced here
 * without touching the reusable viewer component.
 */

export interface ModelQualityProfile {
  /** Enable the model's Draco mesh compression loader. */
  useDraco: boolean;
  /** Load Draco decoder from local /public or a CDN. */
  dracoDecoderPath?: string;
  /** Enable KTX2 texture transcoding. */
  useMeshopt?: boolean;
}

// TODO(future): select profile based on device / connection speed.
export const modelQualityProfiles: Record<string, ModelQualityProfile> = {
  high: {
    useDraco: true,
    dracoDecoderPath: "/draco/",
    useMeshopt: true,
  },
  medium: {
    useDraco: true,
    dracoDecoderPath: "/draco/",
    useMeshopt: false,
  },
  low: {
    useDraco: false,
    useMeshopt: false,
  },
};

export const defaultModelQuality = "high";

/**
 * Resolves the final URL for a model. Prefixes the GitHub Pages base path so
 * assets inside /public are fetchable when the app is hosted in a sub-directory
 * (e.g. /LumireXchangeExperimental/models/...). Locally this is a no-op.
 */
export function resolveModelUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") ? `${base}${path}` : path;
}

export const viewerConfig = {
  /** Background environment used to light the model. */
  environment: "studio" as "studio" | "city" | "sunset",
  /** Base horizontal FOV for the default camera. */
  fov: 42,
  /** Near / far clipping planes. */
  near: 0.01,
  far: 100,
  /** Interaction sensitivity multipliers. */
  rotateSpeed: 0.8,
  zoomSpeed: 1,
  minDistance: 0.5,
  maxDistance: 12,
};
