"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { geoMercator, geoPath } from "d3-geo"
import countriesSource from "react-svg-worldmap/dist/countries.geo.js"

interface WorldMapComponentProps {
  visible: boolean
}

type RawCountry = {
  N: string
  I: string
  C: number[][][][]
}

type GeoFeature = {
  type: "Feature"
  properties: { NAME: string; ISO_A2: string }
  geometry: {
    type: "MultiPolygon"
    coordinates: number[][][][]
  }
}

type RouteAccent = "primary" | "secondary"

type MapNodeId =
  | "uae"
  | "london"
  | "zurich"
  | "newyork"
  | "saopaulo"
  | "singapore"
  | "tokyo"
  | "johannesburg"

type MapNode = {
  id: MapNodeId
  label: string
  lon: number
  lat: number
  kind: "hub" | "market"
  labelDx: number
  labelDy: number
  showOnMobile?: boolean
}

type ProjectedNode = MapNode & { x: number; y: number }

type Route = {
  id: string
  from: MapNodeId
  to: MapNodeId
  accent: RouteAccent
}

const VIEWBOX = { width: 1000, height: 520 } as const
const PADDING = 20

const COLORS = {
  bg: "hsl(210 20% 98%)",
  panel: "hsl(0 0% 100%)",
  ink: "hsl(220 15% 22%)",
  text: "hsl(220 10% 45%)",
  textSoft: "hsl(220 10% 55%)",
  primary: "hsl(28 95% 62%)",
  primarySoft: "hsl(28 95% 62% / 0.24)",
  secondary: "hsl(192 45% 55%)",
  secondarySoft: "hsl(192 45% 55% / 0.24)",
  land: "hsl(210 16% 93%)",
  landStroke: "hsl(210 14% 84%)",
  landMuted: "hsl(210 14% 95%)",
} as const

const mapNodes: MapNode[] = [
  {
    id: "uae",
    label: "RAK / Dubai",
    lon: 55.3,
    lat: 25.2,
    kind: "hub",
    labelDx: 12,
    labelDy: -14,
    showOnMobile: true,
  },
  {
    id: "london",
    label: "London",
    lon: -0.1276,
    lat: 51.5072,
    kind: "market",
    labelDx: -64,
    labelDy: -16,
  },
  {
    id: "zurich",
    label: "Zurich",
    lon: 8.5417,
    lat: 47.3769,
    kind: "market",
    labelDx: -54,
    labelDy: -10,
  },
  {
    id: "newyork",
    label: "New York",
    lon: -74.006,
    lat: 40.7128,
    kind: "market",
    labelDx: -76,
    labelDy: -8,
    showOnMobile: true,
  },
  {
    id: "saopaulo",
    label: "Sao Paulo",
    lon: -46.6333,
    lat: -23.5505,
    kind: "market",
    labelDx: -68,
    labelDy: 20,
  },
  {
    id: "singapore",
    label: "Singapore",
    lon: 103.8198,
    lat: 1.3521,
    kind: "market",
    labelDx: 12,
    labelDy: 18,
    showOnMobile: true,
  },
  {
    id: "tokyo",
    label: "Tokyo",
    lon: 139.6917,
    lat: 35.6895,
    kind: "market",
    labelDx: 12,
    labelDy: -12,
  },
  {
    id: "johannesburg",
    label: "Johannesburg",
    lon: 28.0473,
    lat: -26.2041,
    kind: "market",
    labelDx: 12,
    labelDy: 20,
  },
]

const routes: Route[] = [
  { id: "uae-london", from: "uae", to: "london", accent: "primary" },
  { id: "uae-zurich", from: "uae", to: "zurich", accent: "secondary" },
  { id: "uae-newyork", from: "uae", to: "newyork", accent: "primary" },
  { id: "uae-saopaulo", from: "uae", to: "saopaulo", accent: "secondary" },
  { id: "uae-singapore", from: "uae", to: "singapore", accent: "primary" },
  { id: "uae-tokyo", from: "uae", to: "tokyo", accent: "secondary" },
  { id: "uae-johannesburg", from: "uae", to: "johannesburg", accent: "primary" },
]

const highlightedCountries = new Set([
  "AE",
  "GB",
  "CH",
  "US",
  "CA",
  "BR",
  "MX",
  "SG",
  "JP",
  "CN",
  "AU",
  "ZA",
  "EG",
  "DE",
  "FR",
  "IT",
])

const secondaryCountries = new Set(["AE", "SG", "JP"])

const regions = [
  { name: "North America", percent: "25%", desc: "Treaty and specialty capacity access" },
  { name: "Europe", percent: "22%", desc: "Lloyd's and continental relationships" },
  { name: "Middle East", percent: "14%", desc: "Regional hub and execution center" },
  { name: "Asia Pacific", percent: "18%", desc: "Growth markets and facultative support" },
  { name: "Latin America", percent: "15%", desc: "Emerging market placements" },
  { name: "Africa", percent: "6%", desc: "Frontier risk market connectivity" },
]

function routeColor(accent: RouteAccent) {
  return accent === "primary" ? COLORS.primary : COLORS.secondary
}

function routeSoft(accent: RouteAccent) {
  return accent === "primary" ? COLORS.primarySoft : COLORS.secondarySoft
}

function toGeoJSONFeature(raw: RawCountry): GeoFeature {
  return {
    type: "Feature",
    properties: { NAME: raw.N, ISO_A2: raw.I },
    geometry: {
      type: "MultiPolygon",
      coordinates: raw.C,
    },
  }
}

const rawCountries = ((countriesSource as { features?: RawCountry[] })?.features ?? []) as RawCountry[]
const geoFeatures: GeoFeature[] = rawCountries.map(toGeoJSONFeature)
const featureCollection = { type: "FeatureCollection", features: geoFeatures } as const

const projection = geoMercator().fitExtent(
  [
    [PADDING, PADDING],
    [VIEWBOX.width - PADDING, VIEWBOX.height - PADDING],
  ],
  featureCollection
)

const pathBuilder = geoPath(projection)

const countryPaths = geoFeatures
  .map((feature) => ({
    code: feature.properties.ISO_A2,
    name: feature.properties.NAME,
    d: pathBuilder(feature) as string | null,
  }))
  .filter((item) => Boolean(item.d)) as { code: string; name: string; d: string }[]

function projectPoint(lon: number, lat: number) {
  const point = projection([lon, lat]) as [number, number] | null
  if (!point) return { x: 0, y: 0 }
  return { x: point[0], y: point[1] }
}

const projectedNodes: ProjectedNode[] = mapNodes.map((node) => ({
  ...node,
  ...projectPoint(node.lon, node.lat),
}))

const projectedNodeMap = Object.fromEntries(projectedNodes.map((node) => [node.id, node])) as Record<MapNodeId, ProjectedNode>

function makeRoutePath(from: ProjectedNode, to: ProjectedNode) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy)
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2

  const lift = Math.max(14, Math.min(72, distance * 0.22))
  const cx1 = from.x + dx * 0.28
  const cy1 = my - lift
  const cx2 = from.x + dx * 0.72
  const cy2 = my - lift - Math.abs(dy) * 0.06

  return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`
}

function NetworkSvg({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern id="gridDots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.9" fill="rgba(130,201,216,0.12)" />
        </pattern>
        <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pointGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {routes.map((route) => (
          <linearGradient id={`route-${route.id}`} key={`gradient-${route.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={routeSoft(route.accent)} />
            <stop offset="22%" stopColor={routeColor(route.accent)} />
            <stop offset="78%" stopColor={routeColor(route.accent)} />
            <stop offset="100%" stopColor={routeSoft(route.accent)} />
          </linearGradient>
        ))}
      </defs>

      <rect x="0" y="0" width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#gridDots)" opacity="0.8" />

      <g opacity="0.95">
        {countryPaths.map((country) => {
          const isHighlighted = highlightedCountries.has(country.code)
          const isSecondary = secondaryCountries.has(country.code)

          const fill = isHighlighted
            ? isSecondary
              ? "hsl(192 45% 55%)"
              : "hsl(28 95% 62%)"
            : COLORS.land

          const fillOpacity = isHighlighted ? (isSecondary ? 0.42 : 0.32) : 0.92
          const stroke = isHighlighted ? "hsl(210 14% 76%)" : COLORS.landStroke
          const strokeOpacity = isHighlighted ? 0.45 : 0.72

          return (
            <path
              key={country.code}
              d={country.d}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeWidth={0.7}
            />
          )
        })}
      </g>

      <g opacity="0.65">
        {countryPaths.map((country) => (
          <path key={`land-shadow-${country.code}`} d={country.d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={0.35} />
        ))}
      </g>

      <g>
        {routes.map((route, index) => {
          const from = projectedNodeMap[route.from]
          const to = projectedNodeMap[route.to]
          const d = makeRoutePath(from, to)
          return (
            <g key={route.id}>
              <path d={d} fill="none" stroke={routeSoft(route.accent)} strokeWidth={1.05} strokeLinecap="round" opacity={0.9} />
              <motion.path
                d={d}
                fill="none"
                stroke={`url(#route-${route.id})`}
                strokeWidth={1.15}
                strokeLinecap="round"
                filter="url(#routeGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={visible ? { pathLength: 1, opacity: 0.95 } : {}}
                transition={{ duration: 0.9, delay: 0.12 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d={d}
                fill="none"
                stroke={routeColor(route.accent)}
                strokeWidth={0.85}
                strokeLinecap="round"
                strokeDasharray="2.2 5.8"
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: [0.15, 0.55, 0.15], strokeDashoffset: [16, 0] } : {}}
                transition={{
                  duration: 2.8,
                  delay: 0.35 + index * 0.08,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </g>
          )
        })}
      </g>

      <g>
        {projectedNodes.map((node, index) => {
          const dot = node.kind === "hub" ? COLORS.secondary : COLORS.primary

          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.kind === "hub" ? 3.2 : 2.3}
                fill={dot}
                stroke="rgba(255,255,255,0.95)"
                strokeWidth={1.1}
                filter="url(#pointGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={visible ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.25, delay: 0.45 + index * 0.04 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />

              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.kind === "hub" ? 6 : 4.8}
                fill="none"
                stroke={dot}
                strokeWidth={0.65}
                initial={{ opacity: 0 }}
                animate={visible ? { r: [node.kind === "hub" ? 6 : 4.8, node.kind === "hub" ? 16 : 11], opacity: [0.5, 0] } : {}}
                transition={{ duration: node.kind === "hub" ? 2.1 : 2.8, delay: 0.55 + index * 0.03, repeat: Infinity, ease: "easeOut" }}
              />

              {node.kind === "hub" && (
                <>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={10}
                    fill="none"
                    stroke={COLORS.secondary}
                    strokeWidth={0.75}
                    strokeDasharray="1.5 4.2"
                    initial={{ opacity: 0 }}
                    animate={visible ? { opacity: [0.18, 0.45, 0.18], rotate: [0, 360] } : {}}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={14}
                    fill="none"
                    stroke={COLORS.primary}
                    strokeWidth={0.45}
                    strokeDasharray="1.2 6"
                    initial={{ opacity: 0 }}
                    animate={visible ? { opacity: [0.08, 0.22, 0.08], rotate: [360, 0] } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                </>
              )}

            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default function WorldMapComponent({ visible }: WorldMapComponentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-10 md:mb-12"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-white/95 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.28)]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 18% 12%, rgba(130,201,216,0.15) 0%, transparent 44%), radial-gradient(circle at 86% 18%, rgba(255,170,90,0.16) 0%, transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,1) 100%)",
            }}
          />

          <div className="relative p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="mb-5 md:mb-6">
              <div>
                <motion.h3
                  initial={{ opacity: 0, x: -12 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.08 }}
                  className="text-xl sm:text-2xl md:text-3xl font-serif font-light tracking-tight"
                  style={{ color: COLORS.ink }}
                >
                  Global Partner Network
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -12 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.14 }}
                  className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed"
                  style={{ color: COLORS.text }}
                >
                  Accurate city positioning via geo projection, with GLINSO route overlays and market highlighting.
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="relative overflow-hidden rounded-xl border border-border/20 bg-[hsl(210_20%_98%)]"
            >
              <div className="relative aspect-[1.55/1] sm:aspect-[1.75/1] lg:aspect-[2.05/1]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 p-2 sm:p-3 md:p-4">
                  <div className="relative h-full w-full overflow-hidden rounded-lg border border-border/10 bg-white/55 shadow-inner">
                    {mounted ? (
                      <NetworkSvg visible={visible} />
                    ) : (
                      <div className="absolute inset-0 bg-[hsl(210_20%_98%)]">
                        <div
                          className="absolute inset-0 opacity-70"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 1px 1px, rgba(130,201,216,0.12) 1px, transparent 0)",
                            backgroundSize: "18px 18px",
                          }}
                        />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse 72% 66% at 50% 46%, transparent 42%, rgba(248,250,252,0.22) 82%, rgba(248,250,252,0.5) 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {regions.map((region, i) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.22, delay: 0.04 * i }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="group relative overflow-hidden rounded-2xl border border-border/20"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.98) 100%)",
              boxShadow: "0 14px 32px -22px rgba(15,23,42,0.2)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 14% 14%, rgba(130,201,216,0.16) 0%, transparent 42%), radial-gradient(circle at 88% 18%, rgba(255,170,90,0.14) 0%, transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.94) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-55"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(130,201,216,0.14) 1px, transparent 0)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

            <div className="relative p-4 md:p-5">
              <div className="mb-2 flex items-end gap-2">
                <span className="font-serif text-2xl md:text-3xl font-light" style={{ color: COLORS.primary }}>
                  {region.percent}
                </span>
                <div className="mb-1 h-px flex-1 bg-gradient-to-r from-[hsl(192_45%_55%/.45)] to-[hsl(28_95%_62%/.35)]" />
              </div>
              <h4 className="text-sm md:text-base font-medium text-foreground mb-2">{region.name}</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{region.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[hsl(192_45%_55%)]" />
                  <span className="h-2 w-2 rounded-full bg-[hsl(28_95%_62%)]" />
                </div>
                <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-muted-foreground">
                  Network Share
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
