import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "ufs.sh",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
