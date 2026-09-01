import type { NextConfig } from "next";

// Repo name → deployed sub-path (e.g. https://<user>.github.io/AgoraXchangeExperimental/).
// Leave unset (default "/") for local dev / root deployment.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static export so the site can be served by GitHub Pages (no Node server).
  output: "export",
  trailingSlash: true,
  images: {
    // GitHub Pages cannot run the Next.js image optimizer.
    unoptimized: true,
  },
  ...(basePath
    ? { basePath, assetPrefix: basePath }
    : {}),
};

export default nextConfig;