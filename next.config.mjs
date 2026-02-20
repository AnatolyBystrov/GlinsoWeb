/** @type {import('next').NextConfig} */
// Cache bust: 2026-02-20

const isGithubActions = process.env.GITHUB_ACTIONS || false
const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || ''

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,

  // GitHub Pages deployment
  output: 'export',
  images: {
    unoptimized: true,
  },

  // Only set basePath and assetPrefix for GitHub Pages
  ...(isGithubActions && {
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
  }),

  experimental: {
    turbo: {},
    optimizePackageImports: ['framer-motion', 'react-svg-worldmap'],
  },
}

export default nextConfig
