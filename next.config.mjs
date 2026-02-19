/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force cache bust
  experimental: {
    turbo: {},
  },
}

export default nextConfig
