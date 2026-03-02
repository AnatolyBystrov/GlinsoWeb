/** @type {import('next').NextConfig} */
// Cache bust: 2026-02-20

import { createRequire } from 'module'
const _require = createRequire(import.meta.url)

const isGithubActions = process.env.GITHUB_ACTIONS || false
const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || ''

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,

  // GitHub Pages deployment
  output: 'export',
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

  // Deduplicate Three.js — react-globe.gl uses three internally; alias ensures
  // only one copy is bundled to avoid the "Multiple instances" warning.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three: _require.resolve('three'),
    }
    return config
  },
}

export default nextConfig
