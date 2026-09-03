import type { NextConfig } from "next";

const allowedDevOrigins = [
  "localhost",
  "127.0.0.1",
  process.env.REPLIT_DEV_DOMAIN,
].filter((origin): origin is string => Boolean(origin));

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins,
};

export default nextConfig;
