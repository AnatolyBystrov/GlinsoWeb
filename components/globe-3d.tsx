"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import * as THREE from "three"
import GlobeSvg from "./globe-svg"

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false })

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}

/* ── Partner country ISO codes ── */
const PARTNER_COUNTRIES = new Set([
  "USA",        // USA
  "CAN",        // Canada
  "BRA",        // Brazil
  "FRA",        // France
  "CHE",        // Switzerland
  "GBR",        // UK
  "JPN",        // Japan
  "AUS",        // Australia
  "EGY",        // Egypt
  "MYS",        // Malaysia
])

const OFFICE_COUNTRY = "ARE"

/* ── Arc data: connections from UAE hub to key markets ── */
const UAE_LAT = 25.3
const UAE_LNG = 55.5

const ARCS = [
  // Orange — western markets
  { endLat: 51.51, endLng: -0.13, color: ["#f5821f", "#fb923c"] },   // London
  { endLat: 40.71, endLng: -74.01, color: ["#f5821f", "#fb923c"] },  // New York
  { endLat: 47.38, endLng: 8.54, color: ["#f5821f", "#fb923c"] },    // Zurich
  { endLat: 48.86, endLng: 2.35, color: ["#f5821f", "#fb923c"] },    // Paris
  { endLat: -23.55, endLng: -46.63, color: ["#f5821f", "#fb923c"] }, // São Paulo
  // Blue — eastern markets
  { endLat: 1.35, endLng: 103.82, color: ["#0097c4", "#3cb6d8"] },   // Singapore
  { endLat: 35.68, endLng: 139.65, color: ["#0097c4", "#3cb6d8"] },  // Tokyo
  { endLat: -33.87, endLng: 151.21, color: ["#0097c4", "#3cb6d8"] }, // Sydney
  { endLat: 22.32, endLng: 114.17, color: ["#0097c4", "#3cb6d8"] },  // Hong Kong
].map(a => ({
  startLat: UAE_LAT,
  startLng: UAE_LNG,
  ...a,
}))

/* ── Labels ── */
const LABELS = [
  { lat: 25.3, lng: 55.5, text: "GLINSO HQ", color: "#0097c4", size: 0.7 },
  { lat: 51.51, lng: -0.13, text: "London", color: "#f5821f", size: 0.5 },
  { lat: 40.71, lng: -74.01, text: "New York", color: "#f5821f", size: 0.5 },
  { lat: 47.38, lng: 8.54, text: "Zurich", color: "#f5821f", size: 0.45 },
  { lat: 1.35, lng: 103.82, text: "Singapore", color: "#0097c4", size: 0.5 },
  { lat: 35.68, lng: 139.65, text: "Tokyo", color: "#0097c4", size: 0.45 },
]

/* ── Ring pulses at UAE hub ── */
const RINGS = [
  { lat: UAE_LAT, lng: UAE_LNG, maxR: 6, propagationSpeed: 2, repeatPeriod: 800, color: () => "rgba(0,151,196,0.5)" },
]

/* ── GeoJSON URL (countries polygons) ── */
const GEO_URL = "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"

interface Globe3DProps {
  visible: boolean
}

export default function Globe3D({ visible }: Globe3DProps) {
  const globeRef = useRef<any>(null)
  const [countries, setCountries] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [size, setSize] = useState(700)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  const globeMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: new THREE.Color(0xf0f4f8),
    shininess: 6,
    specular: new THREE.Color(0xc8d8ea),
  }), [])

  /* Load GeoJSON */
  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(d => setCountries(d.features))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setMounted(true)
    setWebglSupported(checkWebGL())
    const updateSize = () => {
      const w = window.innerWidth
      setSize(w < 768 ? Math.min(w - 32, 500) : Math.min(w * 0.48, 760))
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleGlobeReady = useCallback(() => {
    const g = globeRef.current
    if (!g) return

    g.controls().autoRotate = true
    g.controls().autoRotateSpeed = 0.4
    g.controls().enableZoom = true
    g.controls().minDistance = 200
    g.controls().maxDistance = 500
    g.pointOfView({ lat: 25, lng: 30, altitude: 2.2 }, 0)
  }, [])

  /* Polygon color: partner = orange, UAE = blue, rest = neutral */
  const polygonCapColor = useCallback((d: any) => {
    const iso = d.properties?.ISO_A3
    if (iso === OFFICE_COUNTRY) return "rgba(0, 151, 196, 0.6)"
    if (PARTNER_COUNTRIES.has(iso)) return "rgba(245, 130, 31, 0.45)"
    return "rgba(220, 225, 232, 0.25)"
  }, [])

  const polygonSideColor = useCallback((d: any) => {
    const iso = d.properties?.ISO_A3
    if (iso === OFFICE_COUNTRY) return "rgba(0, 151, 196, 0.3)"
    if (PARTNER_COUNTRIES.has(iso)) return "rgba(245, 130, 31, 0.2)"
    return "rgba(200, 205, 210, 0.08)"
  }, [])

  const polygonStroke = useCallback((d: any) => {
    const iso = d.properties?.ISO_A3
    if (iso === OFFICE_COUNTRY) return "#0097c4"
    if (PARTNER_COUNTRIES.has(iso)) return "rgba(245,130,31,0.7)"
    return "rgba(180,185,195,0.3)"
  }, [])

  const polygonAltitude = useCallback((d: any) => {
    const iso = d.properties?.ISO_A3
    if (iso === OFFICE_COUNTRY) return 0.02
    if (PARTNER_COUNTRIES.has(iso)) return 0.008
    return 0.002
  }, [])

  const polygonLabel = useCallback((d: any) => {
    const iso = d.properties?.ISO_A3
    const name = d.properties?.NAME || ""
    if (iso === OFFICE_COUNTRY) return `<b style="color:#0097c4">${name}</b> — GLINSO HQ`
    if (PARTNER_COUNTRIES.has(iso)) return `<b style="color:#f5821f">${name}</b> — Partner market`
    return name
  }, [])

  if (!mounted) return null

  if (webglSupported === false) {
    return <GlobeSvg visible={visible} size={size} />
  }

  return (
    <div style={{
      width: size,
      height: size,
      filter: "drop-shadow(0px 20px 40px rgba(80,100,130,0.2)) drop-shadow(0px 6px 12px rgba(60,80,110,0.12))",
    }}>
      <Globe
        ref={globeRef}
        globeImageUrl=""
        backgroundImageUrl=""
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="rgba(180,200,230,0.5)"
        atmosphereAltitude={0.18}

        globeMaterial={globeMaterial}

        hexPolygonsData={countries}
        hexPolygonGeoJsonGeometry={(d: any) => d.geometry}
        hexPolygonColor={(d: any) => {
          const iso = d.properties?.ISO_A3
          if (iso === OFFICE_COUNTRY) return "rgba(0,151,196,0.95)"
          if (PARTNER_COUNTRIES.has(iso)) return "rgba(245,130,31,0.9)"
          return "rgba(55,65,75,0.45)"
        }}
        hexPolygonAltitude={0.002}
        hexPolygonResolution={3}
        hexPolygonMargin={0.4}
        hexPolygonUseDots={true}

        polygonsData={countries}
        polygonCapColor={() => "rgba(0,0,0,0)"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={polygonStroke}
        polygonAltitude={() => 0.001}
        polygonLabel={polygonLabel}
        polygonsTransitionDuration={0}

        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcAltitudeAutoScale={0.4}
        arcStroke={0.6}
        arcDashLength={0.6}
        arcDashGap={0.3}
        arcDashAnimateTime={2500}

        labelsData={LABELS}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelDotRadius={0.3}
        labelAltitude={0.02}
        labelResolution={2}

        ringsData={RINGS}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringColor="color"

        onGlobeReady={handleGlobeReady}
        width={size}
        height={size}
      />
    </div>
  )
}
