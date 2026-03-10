"use client"

import { useEffect, useRef, useState } from "react"
// d3-geo v2 has these but @types may lag — cast via namespace import
import * as _d3geo from "d3-geo"
const { geoOrthographic, geoGraticule, geoPath } = _d3geo as any
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

/* ── Highlighted countries by region ── */
const EUROPE  = new Set(["GB","FR","DE","CH","NL","BE","IT","ES","SE","NO","AT","DK","PL","FI","IE","PT","GR","RO","HU","CZ"])
const ASIA    = new Set(["JP","AU","CN","MY","IN","KR","TH","ID","NZ"])
const AFRICA  = new Set(["ZA","EG","NG","KE","MA","GH","ET","TZ","UG","CI","DZ","AO","LY","SD","TN","SN","CM","MZ","ZW","ZM","BF"])
const LATAM   = new Set(["BR","MX","AR","CO","CL","PE","VE","EC","BO","PY","UY"])
const NORTHAM = new Set(["US","CA"])
const HUB     = new Set(["AE"])

/* ── City nodes ── */
const CITIES = [
  { id: "uae",          lon: 55.3,   lat: 25.2,   label: "GLINSO HQ",    hub: true,  color: "#0097c4" },
  { id: "london",       lon: -0.13,  lat: 51.51,  label: "London",       hub: false, color: "#0097c4" },
  { id: "zurich",       lon: 8.54,   lat: 47.38,  label: "Zurich",       hub: false, color: "#0097c4" },
  { id: "paris",        lon: 2.35,   lat: 48.86,  label: "Paris",        hub: false, color: "#0097c4" },
  { id: "singapore",    lon: 103.82, lat: 1.35,   label: "Singapore",    hub: false, color: "#0097c4" },
  { id: "tokyo",        lon: 139.65, lat: 35.68,  label: "Tokyo",        hub: false, color: "#0097c4" },
  { id: "sydney",       lon: 151.21, lat: -33.87, label: "Sydney",       hub: false, color: "#0097c4" },
  { id: "johannesburg", lon: 28.0,   lat: -26.2,  label: "Johannesburg", hub: false, color: "#33a35c" },
  { id: "cairo",        lon: 31.24,  lat: 30.06,  label: "Cairo",        hub: false, color: "#33a35c" },
  { id: "saopaulo",     lon: -46.63, lat: -23.55, label: "São Paulo",    hub: false, color: "#f5821f" },
  { id: "newyork",      lon: -74.01, lat: 40.71,  label: "New York",     hub: false, color: "#f5821f" },
]

const HUB_FROM: [number, number] = [55.3, 25.2]

/* Precomputed arc GeoJSON LineStrings (interpolated for smooth great-circle look) */
const ARC_GEOJSON = CITIES.filter(c => !c.hub).map((c, i) => ({
  lineString: {
    type: "LineString" as const,
    coordinates: [
      HUB_FROM,
      ...Array.from({ length: 30 }, (_, k) => {
        const t = (k + 1) / 32
        return [HUB_FROM[0] + (c.lon - HUB_FROM[0]) * t, HUB_FROM[1] + (c.lat - HUB_FROM[1]) * t] as [number, number]
      }),
      [c.lon, c.lat] as [number, number],
    ],
  },
  color: c.color,
  period: (2500 + i * 250), // ms per dash cycle
}))

const SIZE = 560
const CX = SIZE / 2
const CY = SIZE / 2
const R = SIZE * 0.42

/* Country fill styles (precomputed — never changes, no per-frame allocation) */
const COUNTRY_STYLES = geoFeatures.map((f) => {
  const iso = f.properties.ISO_A2
  if (HUB.has(iso))     return { fill: "rgba(0,151,196,0.75)",   stroke: "rgba(0,151,196,0.60)",   sw: 1.0 }
  if (EUROPE.has(iso))  return { fill: "rgba(0,151,196,0.48)",   stroke: "rgba(0,151,196,0.35)",   sw: 0.8 }
  if (ASIA.has(iso))    return { fill: "rgba(0,151,196,0.42)",   stroke: "rgba(0,151,196,0.30)",   sw: 0.8 }
  if (AFRICA.has(iso))  return { fill: "rgba(52,178,98,0.60)",   stroke: "rgba(52,178,98,0.45)",   sw: 0.8 }
  if (LATAM.has(iso))   return { fill: "rgba(245,130,31,0.48)",  stroke: "rgba(245,130,31,0.35)",  sw: 0.8 }
  if (NORTHAM.has(iso)) return { fill: "rgba(245,130,31,0.42)",  stroke: "rgba(245,130,31,0.30)",  sw: 0.8 }
  return { fill: "rgba(55,75,110,0.16)", stroke: "rgba(140,160,190,0.20)", sw: 0.4 }
})

/* Precomputed graticule GeoJSON (static geometry) */
const GRATICULE_GEO = geoGraticule()()

/* Back-face dot product — returns 0 when behind globe, 1 when fully front */
function getVis(lon: number, lat: number, rot: [number, number]): number {
  const d = Math.PI / 180
  const dot =
    Math.cos(-rot[1] * d) * Math.cos(lat * d) * Math.cos(lon * d - (-rot[0] * d)) +
    Math.sin(-rot[1] * d) * Math.sin(lat * d)
  return Math.max(0, Math.min(1, dot / 0.15))
}

/* ── Main component ── */
interface GlobeSvgProps { visible: boolean; size?: number }

export default function GlobeSvg({ visible, size = SIZE }: GlobeSvgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  /* Rotation in a ref — never causes React re-render */
  const rotRef   = useRef<[number, number]>([-30, -20])
  const animRef  = useRef<number | null>(null)
  const dragging = useRef(false)
  const lastPos  = useRef<{ x: number; y: number } | null>(null)
  const autoActive = useRef(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    /* Hi-DPI setup */
    const dpr = window.devicePixelRatio || 1
    canvas.width  = SIZE * dpr
    canvas.height = SIZE * dpr

    let lastTs = 0

    const draw = (ts: number) => {
      const dt = lastTs ? Math.min(ts - lastTs, 50) : 16
      lastTs = ts

      if (autoActive.current) {
        rotRef.current = [rotRef.current[0] + dt * 0.012, rotRef.current[1]]
      }

      const ctx = canvas.getContext("2d")
      if (!ctx) { animRef.current = requestAnimationFrame(draw); return }

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, SIZE, SIZE)

      const proj = geoOrthographic()
        .scale(R)
        .translate([CX, CY])
        .rotate([rotRef.current[0], rotRef.current[1], 0])
        .clipAngle(90)
      const p = geoPath(proj, ctx)

      /* ── Drop shadow under sphere ── */
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(CX, CY + R * 0.92, R * 0.72, R * 0.08, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(40,70,120,0.10)"
      ctx.filter = "blur(12px)"
      ctx.fill()
      ctx.filter = "none"
      ctx.restore()

      /* ── Sphere base ── */
      ctx.save()
      ctx.beginPath()
      p({ type: "Sphere" })
      const grad = ctx.createRadialGradient(CX - R * 0.2, CY - R * 0.24, R * 0.05, CX, CY, R)
      grad.addColorStop(0,    "#eef4fc")
      grad.addColorStop(0.55, "#d8e8f4")
      grad.addColorStop(1,    "#b2c8de")
      ctx.fillStyle = grad
      ctx.shadowColor  = "rgba(40,70,120,0.22)"
      ctx.shadowBlur   = 42
      ctx.shadowOffsetY = 18
      ctx.fill()
      ctx.restore()

      /* ── Clip everything inside sphere boundary ── */
      ctx.save()
      ctx.beginPath()
      p({ type: "Sphere" })
      ctx.clip()

      /* Graticule */
      ctx.beginPath()
      p(GRATICULE_GEO)
      ctx.strokeStyle = "rgba(120,160,200,0.18)"
      ctx.lineWidth = 0.55
      ctx.stroke()

      /* Countries */
      for (let i = 0; i < geoFeatures.length; i++) {
        const { fill, stroke, sw } = COUNTRY_STYLES[i]
        ctx.beginPath()
        p(geoFeatures[i] as any)
        ctx.fillStyle = fill
        ctx.fill()
        ctx.strokeStyle = stroke
        ctx.lineWidth = sw
        ctx.stroke()
      }

      /* Arcs */
      for (const arc of ARC_GEOJSON) {
        /* Outer glow */
        ctx.beginPath()
        p(arc.lineString as any)
        ctx.strokeStyle = arc.color
        ctx.lineWidth = 3
        ctx.globalAlpha = 0.13
        ctx.setLineDash([])
        ctx.stroke()

        /* Solid line */
        ctx.beginPath()
        p(arc.lineString as any)
        ctx.strokeStyle = arc.color
        ctx.lineWidth = 1.3
        ctx.globalAlpha = 0.90
        ctx.stroke()

        /* Animated dashes — period = arc.period ms, pattern period = 11 units */
        ctx.beginPath()
        p(arc.lineString as any)
        ctx.strokeStyle = arc.color
        ctx.lineWidth = 0.85
        ctx.globalAlpha = 0.55
        ctx.setLineDash([3, 8])
        ctx.lineDashOffset = -((ts / arc.period) % 1) * 11
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      /* City dots */
      for (const city of CITIES) {
        const vis = getVis(city.lon, city.lat, rotRef.current)
        if (vis <= 0) continue
        const pt = proj([city.lon, city.lat])
        if (!pt) continue
        const r = city.hub ? 5 : 3.2

        /* Halo */
        ctx.globalAlpha = vis * 0.14
        ctx.beginPath()
        ctx.arc(pt[0], pt[1], r + 6, 0, Math.PI * 2)
        ctx.fillStyle = city.color
        ctx.fill()

        /* Dot */
        ctx.globalAlpha = vis
        ctx.beginPath()
        ctx.arc(pt[0], pt[1], r, 0, Math.PI * 2)
        ctx.fillStyle   = city.color
        ctx.strokeStyle = "white"
        ctx.lineWidth   = 1.4
        ctx.fill()
        ctx.stroke()

        /* HQ orbit ring */
        if (city.hub) {
          ctx.beginPath()
          ctx.arc(pt[0], pt[1], r + 10, 0, Math.PI * 2)
          ctx.strokeStyle = city.color
          ctx.lineWidth   = 0.8
          ctx.globalAlpha = vis * 0.35
          ctx.setLineDash([2, 4])
          ctx.stroke()
          ctx.setLineDash([])
        }
        ctx.globalAlpha = 1
      }

      /* City labels */
      for (const city of CITIES) {
        const vis = getVis(city.lon, city.lat, rotRef.current)
        if (vis <= 0) continue
        const pt = proj([city.lon, city.lat])
        if (!pt) continue
        if (Math.hypot(pt[0] - CX, pt[1] - CY) > R * 0.97) continue

        ctx.globalAlpha = vis
        const fs = city.hub ? 10.5 : 8.5
        ctx.font = `${city.hub ? "700" : "500"} ${fs}px system-ui,-apple-system,sans-serif`
        const lx = pt[0] + (city.hub ? 10 : 7)
        const ly = pt[1] - (city.hub ? 10 : 6)
        ctx.strokeStyle = "rgba(255,255,255,0.92)"
        ctx.lineWidth   = city.hub ? 3.5 : 2.8
        ctx.strokeText(city.label, lx, ly)
        ctx.fillStyle = city.color
        ctx.fillText(city.label, lx, ly)
        ctx.globalAlpha = 1
      }

      ctx.restore() /* end sphere clip */

      /* ── Atmosphere glow ── */
      ctx.save()
      const atmos = ctx.createRadialGradient(CX, CY, R * 0.76, CX, CY, R * 1.05)
      atmos.addColorStop(0,   "rgba(160,205,240,0)")
      atmos.addColorStop(0.6, "rgba(140,195,235,0.40)")
      atmos.addColorStop(1,   "rgba(110,170,220,0)")
      ctx.beginPath()
      ctx.arc(CX, CY, R * 1.05, 0, Math.PI * 2)
      ctx.fillStyle = atmos
      ctx.fill()
      ctx.restore()

      /* ── Specular highlight ── */
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(CX - R * 0.2, CY - R * 0.24, R * 0.28, R * 0.16, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.26)"
      ctx.filter = "blur(10px)"
      ctx.fill()
      ctx.filter = "none"
      ctx.restore()

      /* ── Decorative rings ── */
      for (const [dr, alpha] of [[0, 0.30], [9, 0.11], [18, 0.055]] as [number, number][]) {
        ctx.beginPath()
        ctx.arc(CX, CY, R + dr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(130,175,220,${alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      ctx.restore() /* DPR scale */
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [mounted])

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragging.current  = true
    autoActive.current = false
    lastPos.current   = { x: e.clientX, y: e.clientY }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current || !lastPos.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    rotRef.current = [
      rotRef.current[0] + dx * 0.35,
      Math.max(-80, Math.min(80, rotRef.current[1] - dy * 0.35)),
    ]
  }

  const onPointerUp = () => {
    dragging.current = false
    setTimeout(() => { autoActive.current = true }, 2000)
  }

  return (
    <div style={{ width: size, height: size, cursor: "grab", userSelect: "none" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={visible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        {mounted && (
          <canvas
            ref={canvasRef}
            style={{ width: size, height: size, touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        )}
      </motion.div>
    </div>
  )
}

