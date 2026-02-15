"use client"

import { useRef, useEffect, useState } from "react"

interface GlobeNavProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function GlobeNav({ scrollProgress, mouseX, mouseY }: GlobeNavProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
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

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      timeRef.current += 0.005

      const t = timeRef.current

      // Globe appears from scrollProgress > 0.05, grows and becomes visible
      // scrollProgress 0-0.05 = hidden, 0.05-0.2 = fading in, 0.2-0.8 = fully visible, 0.8-1 = fading out
      const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.05) / 0.15))
      const fadeOut = scrollProgress > 0.8 ? Math.max(0, (1 - scrollProgress) / 0.2) : 1
      const visibility = fadeIn * fadeOut

      if (visibility <= 0.01) {
        frameRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.globalAlpha = visibility

      // Globe centre -- starts lower-right, moves to centre as you scroll
      const introT = Math.min(1, fadeIn) // 0 to 1 during fade-in
      const eased = 1 - Math.pow(1 - introT, 3) // ease-out cubic
      const cx = w * (0.7 - 0.2 * eased) + mouseX * 25
      const cy = h * (0.55 - 0.05 * eased) + mouseY * 25

      // Globe radius grows with scroll, then shrinks past 70%
      const growPhase = Math.min(1, scrollProgress / 0.35)
      const shrinkPhase = scrollProgress > 0.7 ? (1 - (scrollProgress - 0.7) / 0.3) : 1
      const baseR = Math.min(w, h) * (0.25 + 0.2 * growPhase) * shrinkPhase

      // Globe rotation accelerates slightly with scroll
      const rotSpeed = t + scrollProgress * 2

      // ---- Outer glow ----
      const glowGrad = ctx.createRadialGradient(cx, cy, baseR * 0.1, cx, cy, baseR * 2.2)
      glowGrad.addColorStop(0, "rgba(232, 168, 64, 0.08)")
      glowGrad.addColorStop(0.4, "rgba(196, 94, 26, 0.03)")
      glowGrad.addColorStop(1, "transparent")
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, w, h)

      // ---- Wireframe longitude ----
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI + rotSpeed * 0.3
        ctx.beginPath()
        ctx.strokeStyle = "rgba(232, 168, 64, 0.18)"
        ctx.lineWidth = 0.7
        for (let j = 0; j <= 80; j++) {
          const phi = (j / 80) * Math.PI * 2
          const x3d = Math.cos(angle) * Math.sin(phi)
          const z3d = Math.sin(angle) * Math.sin(phi)
          const y3d = Math.cos(phi)
          const depth = z3d * Math.cos(rotSpeed * 0.2) + x3d * Math.sin(rotSpeed * 0.2)
          const px = cx + (x3d * Math.cos(rotSpeed * 0.2) - z3d * Math.sin(rotSpeed * 0.2)) * baseR
          const py = cy + y3d * baseR
          ctx.globalAlpha = visibility * Math.max(0.03, (depth + 1) * 0.4)
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      // ---- Wireframe latitude ----
      for (let i = 1; i < 10; i++) {
        const phi = (i / 10) * Math.PI
        const r = Math.sin(phi) * baseR
        const yOff = Math.cos(phi) * baseR
        ctx.beginPath()
        ctx.strokeStyle = "rgba(232, 168, 64, 0.12)"
        ctx.lineWidth = 0.6
        for (let j = 0; j <= 80; j++) {
          const theta = (j / 80) * Math.PI * 2 + rotSpeed * 0.3
          const x3d = Math.cos(theta)
          const z3d = Math.sin(theta)
          const depth = z3d * Math.cos(rotSpeed * 0.2) + x3d * Math.sin(rotSpeed * 0.2)
          const px = cx + (x3d * Math.cos(rotSpeed * 0.2) - z3d * Math.sin(rotSpeed * 0.2)) * r
          const py = cy + yOff
          ctx.globalAlpha = visibility * Math.max(0.02, (depth + 1) * 0.25)
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      ctx.globalAlpha = visibility

      // ---- Orbital rings ----
      for (let ring = 0; ring < 2; ring++) {
        const rx = baseR * (1.4 + ring * 0.4)
        const ry = baseR * (0.3 + ring * 0.15)
        const ringOffset = ring * 0.8
        ctx.strokeStyle = `rgba(232, 168, 64, ${0.18 - ring * 0.06})`
        ctx.lineWidth = 0.8 - ring * 0.2
        ctx.beginPath()
        for (let j = 0; j <= 100; j++) {
          const theta = (j / 100) * Math.PI * 2
          const px = cx + Math.cos(theta + rotSpeed * 0.35 + ringOffset) * rx
          const py = cy + Math.sin(theta + rotSpeed * 0.35 + ringOffset) * ry
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()

        // Orbiting bright dots
        for (let k = 0; k < 3; k++) {
          const theta = rotSpeed * 0.35 + ringOffset + (k / 3) * Math.PI * 2
          const dx = cx + Math.cos(theta) * rx
          const dy = cy + Math.sin(theta) * ry
          const dotGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, 3.5)
          dotGrad.addColorStop(0, "rgba(255, 200, 80, 0.85)")
          dotGrad.addColorStop(1, "transparent")
          ctx.fillStyle = dotGrad
          ctx.beginPath()
          ctx.arc(dx, dy, 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ---- Ember particles ----
      for (let i = 0; i < 50; i++) {
        const seed = i * 137.508
        const pAngle = t * 0.15 + seed
        const pDist = baseR * (0.6 + Math.sin(seed + t * 0.8) * 1.0)
        const px = cx + Math.cos(pAngle) * pDist
        const py = cy + Math.sin(pAngle) * pDist * 0.55
        const size = 1 + Math.sin(seed + t * 1.5) * 0.8
        const alpha = (0.12 + Math.sin(seed + t) * 0.12) * visibility
        ctx.fillStyle = `rgba(232, 168, 64, ${alpha})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
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
