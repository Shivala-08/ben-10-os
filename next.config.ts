import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['three', 'gsap', 'framer-motion']
  }
};

export default nextConfig;
