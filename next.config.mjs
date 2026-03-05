/** @type {import('next').NextConfig} */
// Cache bust: 2026-02-20

const isGithubActions = process.env.GITHUB_ACTIONS || false
const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || ''

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,

  // Static export for GitHub Pages; Vercel supports SSR natively
  ...(isGithubActions && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Only set basePath and assetPrefix for GitHub Pages
  ...(isGithubActions && {
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
  }),

  // Expose base path to client components for manual asset references (e.g. <video src>)
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? `/${repo}` : '',
  },

  experimental: {
    optimizePackageImports: ['framer-motion', 'react-svg-worldmap'],
  },

  // Deduplicate Three.js — prevents "Multiple instances" warning from react-globe.gl
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      three: new URL('./node_modules/three', import.meta.url).pathname,
    }
    return config
  },

  // Turbopack config (required to avoid webpack-vs-turbopack warning in Next 16)
  turbopack: {},
}

export default nextConfig
