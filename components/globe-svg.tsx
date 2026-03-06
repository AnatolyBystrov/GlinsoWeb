"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { geoPath } from "d3-geo"
// d3-geo v2 has these but @types may lag — cast via namespace import
import * as _d3geo from "d3-geo"
const { geoOrthographic, geoGraticule } = _d3geo as any
import { motion } from "framer-motion"
import countriesSource from "react-svg-worldmap/dist/countries.geo.js"

/* ── Types ── */
type RawCountry = { N: string; I: string; C: number[][][][] }
type GeoFeature = {
  type: "Feature"
  properties: { NAME: string; ISO_A2: string }
  geometry: { type: "MultiPolygon"; coordinates: number[][][][] }
}

/* ── Countries data ── */
const rawCountries = ((countriesSource as any)?.features ?? []) as RawCountry[]
const geoFeatures: GeoFeature[] = rawCountries.map((raw) => ({
  type: "Feature",
  properties: { NAME: raw.N, ISO_A2: raw.I },
  geometry: { type: "MultiPolygon", coordinates: raw.C },
}))

/* ── Highlighted countries by region (matching statistics) ── */
// Europe (blue) — 30%
const EUROPE  = new Set(["GB","FR","DE","CH","NL","BE","IT","ES","SE","NO","AT","DK","PL","FI","IE","PT","GR","RO","HU","CZ"])
// Asia Pacific (blue) — 28%
const ASIA    = new Set(["JP","AU","CN","MY","IN","KR","TH","ID","NZ"])
// Africa (green) — 20%
const AFRICA  = new Set(["ZA","EG","NG","KE","MA","GH","ET","TZ","UG","CI","DZ","AO","LY","SD","TN","SN","CM","MZ","ZW","ZM","BF"])
// Latin America (orange) — 12%
const LATAM   = new Set(["BR","MX","AR","CO","CL","PE","VE","EC","BO","PY","UY"])
// North America (orange) — 4%
const NORTHAM = new Set(["US","CA"])
// Hub UAE
const HUB     = new Set(["AE"])

/* ── City nodes — match regions in statistics ── */
const CITIES = [
  // HUB (blue)
  { id: "uae",          lon: 55.3,   lat: 25.2,   label: "GLINSO HQ",   hub: true,  color: "#0097c4" },
  // Europe — blue (30%)
  { id: "london",       lon: -0.13,  lat: 51.51,  label: "London",      hub: false, color: "#0097c4" },
  { id: "zurich",       lon: 8.54,   lat: 47.38,  label: "Zurich",      hub: false, color: "#0097c4" },
  { id: "paris",        lon: 2.35,   lat: 48.86,  label: "Paris",       hub: false, color: "#0097c4" },
  // Asia Pacific — blue (28%)
  { id: "singapore",    lon: 103.82, lat: 1.35,   label: "Singapore",   hub: false, color: "#0097c4" },
  { id: "tokyo",        lon: 139.65, lat: 35.68,  label: "Tokyo",       hub: false, color: "#0097c4" },
  { id: "sydney",       lon: 151.21, lat: -33.87, label: "Sydney",      hub: false, color: "#0097c4" },
  // Africa — green (20%)
  { id: "johannesburg", lon: 28.0,   lat: -26.2,  label: "Johannesburg",hub: false, color: "#33a35c" },
  { id: "cairo",        lon: 31.24,  lat: 30.06,  label: "Cairo",       hub: false, color: "#33a35c" },
  // Latin America — orange (12%)
  { id: "saopaulo",     lon: -46.63, lat: -23.55, label: "São Paulo",   hub: false, color: "#f5821f" },
  // North America — orange (4%)
  { id: "newyork",      lon: -74.01, lat: 40.71,  label: "New York",    hub: false, color: "#f5821f" },
]

const ARCS = CITIES.filter((c) => !c.hub).map((c) => ({
  from: [55.3, 25.2] as [number, number],
  to:   [c.lon, c.lat] as [number, number],
  color: c.color,
}))

const SIZE = 560
const CX = SIZE / 2
const CY = SIZE / 2
const R = SIZE * 0.42

/* ── Back-face visibility: returns 0 when behind globe, 1 when fully front ── */
function getPointVisibility(lon: number, lat: number, rot: [number, number]): number {
  const toRad = Math.PI / 180
  const viewLon = -rot[0] * toRad
  const viewLat = -rot[1] * toRad
  const pLon = lon * toRad
  const pLat = lat * toRad
  const dot =
    Math.cos(viewLat) * Math.cos(pLat) * Math.cos(pLon - viewLon) +
    Math.sin(viewLat) * Math.sin(pLat)
  // smooth fade near the limb (dot 0..0.15 → opacity 0..1)
  return Math.max(0, Math.min(1, dot / 0.15))
}

/* ── Great-circle arc via native d3 geoPath (proper horizon clipping) ── */
function ArcPath({ from, to, color, pathBuilder, index }: {
  from: [number, number]
  to: [number, number]
  color: string
  pathBuilder: any
  index: number
}) {
  const lineString = {
    type: "LineString" as const,
    coordinates: [
      from,
      // interpolate intermediate points so the arc curves properly
      ...Array.from({ length: 30 }, (_, i) => {
        const t = (i + 1) / 32
        // simple spherical interpolation via weighted lon/lat
        return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t] as [number, number]
      }),
      to,
    ],
  }
  const d = pathBuilder(lineString)
  if (!d) return null
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={3}
        strokeOpacity={0.13} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={1.3}
        strokeOpacity={0.90} strokeLinecap="round"
        filter="url(#g-arcglow)" />
      <path d={d} fill="none" stroke={color} strokeWidth={0.85}
        strokeOpacity={0.55} strokeLinecap="round"
        strokeDasharray="3 8"
        style={{ animation: `dashMove ${2.5 + index * 0.25}s linear infinite` }} />
    </g>
  )
}

/* ── Main component ── */
interface GlobeSvgProps { visible: boolean; size?: number }

export default function GlobeSvg({ visible, size = SIZE }: GlobeSvgProps) {
  const [mounted, setMounted] = useState(false)
  const [rot, setRot] = useState<[number, number]>([-30, -20])
  const dragging = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const animRef = useRef<number | null>(null)
  const autoActive = useRef(true)

  useEffect(() => {
    setMounted(true)
    let lastTs = 0
    const tick = (ts: number) => {
      if (autoActive.current) {
        const dt = lastTs ? ts - lastTs : 16
        setRot((r) => [r[0] + dt * 0.012, r[1]])
      }
      lastTs = ts
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = true
    autoActive.current = false
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !lastPos.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setRot((r) => [r[0] + dx * 0.35, Math.max(-80, Math.min(80, r[1] - dy * 0.35))])
  }, [])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    setTimeout(() => { autoActive.current = true }, 2000)
  }, [])

  const projection = useMemo(() =>
    geoOrthographic().scale(R).translate([CX, CY]).rotate([rot[0], rot[1], 0]).clipAngle(90),
    [rot]
  )

  const path = useMemo(() => geoPath(projection), [projection])
  const graticule = useMemo(() => (geoGraticule() as any)(), [])

  /* Country fill styles — computed once, not per-rotation */
  const countryStyles = useMemo(() =>
    geoFeatures.map((f) => {
      const iso = f.properties.ISO_A2
      if (HUB.has(iso))     return { fill: "rgba(0,151,196,0.75)",   stroke: "rgba(0,151,196,0.60)",   sw: 1.0 }
      if (EUROPE.has(iso))  return { fill: "rgba(0,151,196,0.48)",   stroke: "rgba(0,151,196,0.35)",   sw: 0.8 }
      if (ASIA.has(iso))    return { fill: "rgba(0,151,196,0.42)",   stroke: "rgba(0,151,196,0.30)",   sw: 0.8 }
      if (AFRICA.has(iso))  return { fill: "rgba(52,178,98,0.60)",   stroke: "rgba(52,178,98,0.45)",   sw: 0.8 }
      if (LATAM.has(iso))   return { fill: "rgba(245,130,31,0.48)",  stroke: "rgba(245,130,31,0.35)",  sw: 0.8 }
      if (NORTHAM.has(iso)) return { fill: "rgba(245,130,31,0.42)",  stroke: "rgba(245,130,31,0.30)",  sw: 0.8 }
      return { fill: "rgba(55,75,110,0.16)", stroke: "rgba(140,160,190,0.20)", sw: 0.4 }
    }),
    []
  )

  return (
    <div style={{ width: size, height: size, cursor: "grab", userSelect: "none" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ overflow: "visible", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <defs>
            <radialGradient id="g-sphere" cx="36%" cy="30%" r="64%">
              <stop offset="0%"   stopColor="#eef4fc" />
              <stop offset="55%"  stopColor="#d8e8f4" />
              <stop offset="100%" stopColor="#b2c8de" />
            </radialGradient>
            <radialGradient id="g-atmos" cx="50%" cy="50%" r="50%">
              <stop offset="76%"  stopColor="rgba(160,205,240,0)" />
              <stop offset="91%"  stopColor="rgba(140,195,235,0.40)" />
              <stop offset="100%" stopColor="rgba(110,170,220,0)" />
            </radialGradient>
            <clipPath id="g-clip">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
            <filter id="g-shadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="28" floodColor="rgba(40,70,120,0.20)" />
            </filter>
            <filter id="g-arcglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="g-cityglow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Bottom shadow */}
          <ellipse cx={CX} cy={CY + R * 0.92} rx={R * 0.72} ry={R * 0.08}
            fill="rgba(40,70,120,0.10)" style={{ filter: "blur(12px)" }} />

          {/* Sphere */}
          <circle cx={CX} cy={CY} r={R} fill="url(#g-sphere)" filter="url(#g-shadow)" />

          <g clipPath="url(#g-clip)">
            {/* Graticule */}
            <path d={path(graticule) ?? ""} fill="none"
              stroke="rgba(120,160,200,0.18)" strokeWidth={0.55} />

            {/* Countries */}
            {geoFeatures.map((feature, i) => {
              const d = path(feature as any)
              if (!d) return null
              const { fill, stroke, sw } = countryStyles[i]
              return (
                <path key={feature.properties.ISO_A2 + i}
                  d={d} fill={fill} stroke={stroke} strokeWidth={sw} />
              )
            })}

            {/* Arc routes — rendered via d3 geoPath LineString (proper horizon clipping) */}
            {mounted && ARCS.map((arc, i) => (
              <ArcPath key={i} from={arc.from} to={arc.to} color={arc.color}
                pathBuilder={path} index={i} />
            ))}

            {/* City dots */}
            {mounted && CITIES.map((city) => {
              const vis = getPointVisibility(city.lon, city.lat, rot)
              if (vis <= 0) return null
              const pt = projection([city.lon, city.lat])
              if (!pt) return null
              const r = city.hub ? 5 : 3.2
              return (
                <g key={city.id} filter="url(#g-cityglow)" opacity={vis}>
                  <circle cx={pt[0]} cy={pt[1]} r={r + 6}
                    fill={city.color} fillOpacity={0.14} />
                  <circle cx={pt[0]} cy={pt[1]} r={r}
                    fill={city.color} stroke="white" strokeWidth={1.4} />
                  {city.hub && (
                    <circle cx={pt[0]} cy={pt[1]} r={r + 10} fill="none"
                      stroke={city.color} strokeWidth={0.8} strokeOpacity={0.35}
                      strokeDasharray="2 4" />
                  )}
                </g>
              )
            })}

            {/* City labels */}
            {mounted && CITIES.map((city) => {
              const vis = getPointVisibility(city.lon, city.lat, rot)
              if (vis <= 0) return null
              const pt = projection([city.lon, city.lat])
              if (!pt) return null
              const dx = pt[0] - CX, dy = pt[1] - CY
              if (Math.hypot(dx, dy) > R * 0.97) return null
              return (
                <text key={city.id + "-lbl"}
                  x={pt[0] + (city.hub ? 10 : 7)}
                  y={pt[1] - (city.hub ? 10 : 6)}
                  fontSize={city.hub ? 10.5 : 8.5}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight={city.hub ? "700" : "500"}
                  fill={city.color}
                  stroke="rgba(255,255,255,0.92)"
                  strokeWidth={city.hub ? 3.5 : 2.8}
                  paintOrder="stroke"
                  opacity={vis}
                >
                  {city.label}
                </text>
              )
            })}
          </g>

          {/* Atmosphere */}
          <circle cx={CX} cy={CY} r={R} fill="url(#g-atmos)" />

          {/* Specular highlight */}
          <ellipse cx={CX - R * 0.2} cy={CY - R * 0.24} rx={R * 0.28} ry={R * 0.16}
            fill="rgba(255,255,255,0.26)" style={{ filter: "blur(10px)" }} />

          {/* Decorative rings */}
          <circle cx={CX} cy={CY} r={R}      fill="none" stroke="rgba(130,175,220,0.30)" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R + 9}  fill="none" stroke="rgba(130,175,220,0.11)" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R + 18} fill="none" stroke="rgba(130,175,220,0.055)" strokeWidth={0.8} />

        </svg>
      </motion.div>

      <style>{`
        @keyframes dashMove {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
