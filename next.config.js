/** @type {import('next').NextConfig} */
// Removed `output: 'export'` because we now rely on full SSR (e.g. /search uses dynamic data).
// Static export mode cannot include pages marked `dynamic = "force-dynamic"` or doing
// uncached data fetching. If you still need a purely static build for some deployment target,
// either (a) convert /search to a client-side fetched page or (b) deploy to a platform that
// supports the Next.js Node/Edge runtime.
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // can switch to false to enable Next Image Optimization later
    remotePatterns: [
      {
        protocol: "https",
        hostname: "petsetu-dev.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
