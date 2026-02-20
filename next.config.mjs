/** @type {import('next').NextConfig} */
// Cache bust: 2026-02-20
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {},
  },
}

export default nextConfig
