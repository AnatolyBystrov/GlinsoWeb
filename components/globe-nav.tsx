"use client"

import { useRef, useEffect, useState } from "react"

interface GlobeNavProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

/* Section labels that orbit out of the globe */
const sections = [
  { id: "who-we-are", label: "Who We Are", at: 0.10 },
  { id: "divisions",  label: "Our Divisions", at: 0.25 },
  { id: "presence",   label: "Global Presence", at: 0.40 },
  { id: "esg",        label: "ESG & Governance", at: 0.55 },
  { id: "csr",        label: "Community", at: 0.70 },
  { id: "contact",    label: "Contact", at: 0.85 },
]

export default function GlobeNav({ scrollProgress, mouseX, mouseY }: GlobeNavProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    const onResize = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isMobile) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    let time = 0

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      time += 0.003

      /* Visibility: hidden on hero, fade in, visible, fade out at bottom */
      const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.04) / 0.08))
      const fadeOut = scrollProgress > 0.88 ? Math.max(0, (1 - scrollProgress) / 0.12) : 1
      const vis = fadeIn * fadeOut
      if (vis <= 0.01) { frameRef.current = requestAnimationFrame(animate); return }

      /* Scroll-driven rotation angle (THIS is the main rotation driver) */
      const scrollAngle = scrollProgress * Math.PI * 6

      /* Globe position: starts right, drifts to centre-right */
      const introEase = 1 - Math.pow(1 - Math.min(1, fadeIn), 3)
      const cx = w * (0.75 - 0.12 * introEase) + mouseX * 20
      const cy = h * 0.48 + mouseY * 20

      /* Globe size: grows from 0.05 to 0.35, then shrinks */
      const growT = Math.min(1, scrollProgress / 0.25)
      const shrinkT = scrollProgress > 0.75 ? 1 - (scrollProgress - 0.75) / 0.25 : 1
      const baseR = Math.min(w, h) * (0.15 + 0.22 * growT) * shrinkT

      ctx.globalAlpha = vis

      /* ── Outer soft glow ── */
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.05, cx, cy, baseR * 2.5)
      glow.addColorStop(0, "rgba(232,168,64,0.07)")
      glow.addColorStop(0.5, "rgba(180,100,30,0.02)")
      glow.addColorStop(1, "transparent")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      /* ── Wireframe longitude lines (scroll-driven rotation) ── */
      const rotY = scrollAngle
      for (let i = 0; i < 18; i++) {
        const lon = (i / 18) * Math.PI
        ctx.beginPath()
        ctx.strokeStyle = "rgba(232,168,64,0.15)"
        ctx.lineWidth = 0.6
        for (let j = 0; j <= 90; j++) {
          const lat = (j / 90) * Math.PI * 2
          const x3 = Math.cos(lon) * Math.sin(lat)
          const z3 = Math.sin(lon) * Math.sin(lat)
          const y3 = Math.cos(lat)
          /* Rotate around Y axis by scrollAngle */
          const rx = x3 * Math.cos(rotY) - z3 * Math.sin(rotY)
          const rz = x3 * Math.sin(rotY) + z3 * Math.cos(rotY)
          const depth = (rz + 1) * 0.5
          const px = cx + rx * baseR
          const py = cy + y3 * baseR
          ctx.globalAlpha = vis * Math.max(0.02, depth * 0.35)
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      /* ── Wireframe latitude lines ── */
      for (let i = 1; i < 10; i++) {
        const lat = (i / 10) * Math.PI
        const r = Math.sin(lat) * baseR
        const yOff = Math.cos(lat) * baseR
        ctx.beginPath()
        ctx.strokeStyle = "rgba(232,168,64,0.10)"
        ctx.lineWidth = 0.5
        for (let j = 0; j <= 90; j++) {
          const lon = (j / 90) * Math.PI * 2 + rotY
          const x3 = Math.cos(lon)
          const z3 = Math.sin(lon)
          const depth = (z3 + 1) * 0.5
          const px = cx + x3 * r
          const py = cy + yOff
          ctx.globalAlpha = vis * Math.max(0.02, depth * 0.2)
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      ctx.globalAlpha = vis

      /* ── Orbital ring ── */
      const ringRX = baseR * 1.5
      const ringRY = baseR * 0.35
      ctx.strokeStyle = "rgba(232,168,64,0.18)"
      ctx.lineWidth = 0.7
      ctx.beginPath()
      for (let j = 0; j <= 120; j++) {
        const a = (j / 120) * Math.PI * 2
        const px = cx + Math.cos(a + rotY * 0.4) * ringRX
        const py = cy + Math.sin(a + rotY * 0.4) * ringRY
        if (j === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      /* Orbiting bright dots on ring */
      for (let k = 0; k < 4; k++) {
        const a = rotY * 0.4 + (k / 4) * Math.PI * 2
        const dx = cx + Math.cos(a) * ringRX
        const dy = cy + Math.sin(a) * ringRY
        const dg = ctx.createRadialGradient(dx, dy, 0, dx, dy, 3)
        dg.addColorStop(0, "rgba(255,210,100,0.9)")
        dg.addColorStop(1, "transparent")
        ctx.fillStyle = dg
        ctx.beginPath()
        ctx.arc(dx, dy, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      /* ── Ember particles ── */
      for (let i = 0; i < 40; i++) {
        const seed = i * 137.508
        const pa = time * 0.2 + seed + rotY * 0.1
        const pd = baseR * (0.5 + Math.sin(seed + time) * 1.1)
        const px = cx + Math.cos(pa) * pd
        const py = cy + Math.sin(pa) * pd * 0.6
        const sz = 0.8 + Math.sin(seed + time * 1.5) * 0.6
        const al = (0.1 + Math.sin(seed + time) * 0.1) * vis
        ctx.fillStyle = `rgba(232,168,64,${al})`
        ctx.beginPath()
        ctx.arc(px, py, sz, 0, Math.PI * 2)
        ctx.fill()
      }

      /* ── Section labels orbiting out from the globe ── */
      ctx.globalAlpha = 1
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i]
        /* Label becomes visible as scroll reaches its "at" threshold */
        const labelProgress = Math.min(1, Math.max(0, (scrollProgress - s.at + 0.12) / 0.12))
        if (labelProgress <= 0.01) continue

        /* Orbit angle: each label sits at a fixed angular position around the globe */
        const angle = -Math.PI / 2 + (i / sections.length) * Math.PI * 0.8 + 0.2
        /* Labels fly outward from the globe surface as they appear */
        const orbitDist = baseR * (0.4 + 1.2 * labelProgress)
        const lx = cx + Math.cos(angle) * orbitDist
        const ly = cy + Math.sin(angle) * orbitDist

        /* Is this the currently active section? */
        const nextAt = i < sections.length - 1 ? sections[i + 1].at : 1.0
        const isActive = scrollProgress >= s.at - 0.06 && scrollProgress < nextAt

        /* Draw connecting line from globe surface to label */
        const surfX = cx + Math.cos(angle) * baseR * 0.95
        const surfY = cy + Math.sin(angle) * baseR * 0.95
        ctx.beginPath()
        ctx.moveTo(surfX, surfY)
        ctx.lineTo(lx, ly)
        ctx.strokeStyle = isActive
          ? `rgba(232,168,64,${0.5 * labelProgress * vis})`
          : `rgba(232,168,64,${0.15 * labelProgress * vis})`
        ctx.lineWidth = isActive ? 1 : 0.5
        ctx.stroke()

        /* Draw dot at label position */
        const dotR = isActive ? 3.5 : 2
        const dg2 = ctx.createRadialGradient(lx, ly, 0, lx, ly, dotR + 2)
        dg2.addColorStop(0, isActive ? `rgba(255,200,80,${0.9 * labelProgress * vis})` : `rgba(232,168,64,${0.5 * labelProgress * vis})`)
        dg2.addColorStop(1, "transparent")
        ctx.fillStyle = dg2
        ctx.beginPath()
        ctx.arc(lx, ly, dotR + 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = isActive
          ? `rgba(255,210,100,${labelProgress * vis})`
          : `rgba(232,168,64,${0.4 * labelProgress * vis})`
        ctx.beginPath()
        ctx.arc(lx, ly, dotR, 0, Math.PI * 2)
        ctx.fill()

        /* Draw label text */
        ctx.font = isActive
          ? `600 ${11}px ui-monospace, SFMono-Regular, monospace`
          : `400 ${10}px ui-monospace, SFMono-Regular, monospace`
        ctx.fillStyle = isActive
          ? `rgba(255,220,120,${labelProgress * vis})`
          : `rgba(200,170,120,${0.45 * labelProgress * vis})`
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(s.label.toUpperCase(), lx + 10, ly)
      }

      ctx.globalAlpha = 1
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [mouseX, mouseY, isMobile, scrollProgress])

  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none hidden md:block"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  )
}
