/** @type {import('next').NextConfig} */
// Cache bust: 2026-02-20
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {},
    optimizePackageImports: ['framer-motion', 'react-svg-worldmap'],
  },
}

export default nextConfig
