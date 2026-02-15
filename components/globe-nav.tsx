"use client"

import { useRef, useEffect, useState, useCallback } from "react"

interface GlobeNavProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

const NAV_ITEMS = [
  { label: "WHO WE ARE", id: "who-we-are" },
  { label: "DIVISIONS", id: "divisions" },
  { label: "PRESENCE", id: "presence" },
  { label: "ESG", id: "esg" },
  { label: "CSR", id: "csr" },
  { label: "CONTACT", id: "contact" },
]

export default function GlobeNav({ scrollProgress, mouseX, mouseY }: GlobeNavProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Show globe after scrolling past hero (~15% scroll)
  useEffect(() => {
    setVisible(scrollProgress > 0.05)
  }, [scrollProgress])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Canvas wireframe globe animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isMobile) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      timeRef.current += 0.008
      const t = timeRef.current

      const cx = w / 2 + mouseX * 12
      const cy = h / 2 + mouseY * 12
      const baseR = Math.min(w, h) * 0.32

      // Globe glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 1.8)
      glowGrad.addColorStop(0, "rgba(232, 168, 64, 0.12)")
      glowGrad.addColorStop(0.5, "rgba(196, 94, 26, 0.04)")
      glowGrad.addColorStop(1, "transparent")
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, w, h)

      // Wireframe longitude lines
      ctx.strokeStyle = "rgba(232, 168, 64, 0.2)"
      ctx.lineWidth = 0.8
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI + t
        ctx.beginPath()
        for (let j = 0; j <= 60; j++) {
          const phi = (j / 60) * Math.PI * 2
          const x3d = Math.cos(angle) * Math.sin(phi)
          const z3d = Math.sin(angle) * Math.sin(phi)
          const y3d = Math.cos(phi)
          const depth = z3d * Math.cos(t * 0.3) + x3d * Math.sin(t * 0.3)
          const px = cx + (x3d * Math.cos(t * 0.3) - z3d * Math.sin(t * 0.3)) * baseR
          const py = cy + y3d * baseR
          ctx.globalAlpha = Math.max(0.05, (depth + 1) * 0.5) * 0.5
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      // Wireframe latitude lines
      for (let i = 1; i < 8; i++) {
        const phi = (i / 8) * Math.PI
        const r = Math.sin(phi) * baseR
        const yOff = Math.cos(phi) * baseR
        ctx.beginPath()
        ctx.strokeStyle = "rgba(232, 168, 64, 0.15)"
        ctx.globalAlpha = 1
        for (let j = 0; j <= 60; j++) {
          const theta = (j / 60) * Math.PI * 2 + t
          const x3d = Math.cos(theta) * r
          const z3d = Math.sin(theta) * r
          const depth = (z3d / baseR) * Math.cos(t * 0.3) + (x3d / baseR) * Math.sin(t * 0.3)
          const px = cx + (Math.cos(theta) * Math.cos(t * 0.3) - Math.sin(theta) * Math.sin(t * 0.3)) * r
          const py = cy + yOff
          ctx.globalAlpha = Math.max(0.03, (depth / baseR + 1) * 0.3)
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Orbital ring
      ctx.strokeStyle = "rgba(232, 168, 64, 0.25)"
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let j = 0; j <= 80; j++) {
        const theta = (j / 80) * Math.PI * 2
        const rx = baseR * 1.5
        const ry = baseR * 0.4
        const px = cx + Math.cos(theta + t * 0.5) * rx
        const py = cy + Math.sin(theta + t * 0.5) * ry
        if (j === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Orbiting dots on ring
      for (let k = 0; k < 3; k++) {
        const theta = t * 0.5 + (k / 3) * Math.PI * 2
        const rx = baseR * 1.5
        const ry = baseR * 0.4
        const dx = cx + Math.cos(theta) * rx
        const dy = cy + Math.sin(theta) * ry
        const dotGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, 4)
        dotGrad.addColorStop(0, "rgba(232, 168, 64, 0.9)")
        dotGrad.addColorStop(1, "transparent")
        ctx.fillStyle = dotGrad
        ctx.beginPath()
        ctx.arc(dx, dy, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ember particles
      for (let i = 0; i < 30; i++) {
        const seed = i * 137.508
        const pAngle = t * 0.2 + seed
        const pDist = baseR * (0.8 + Math.sin(seed + t) * 0.8)
        const px = cx + Math.cos(pAngle) * pDist
        const py = cy + Math.sin(pAngle) * pDist * 0.6
        const size = 1 + Math.sin(seed + t * 2) * 0.8
        ctx.fillStyle = `rgba(232, 168, 64, ${0.15 + Math.sin(seed + t) * 0.15})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [mouseX, mouseY, isMobile])

  const handleNavClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [])

  if (isMobile) return null

  // Fade math: invisible when scrollProgress < 0.05, fully visible at 0.15
  const opacity = Math.min(1, Math.max(0, (scrollProgress - 0.05) / 0.1))
  // Fade out near bottom
  const fadeOut = scrollProgress > 0.85 ? Math.max(0, (1 - scrollProgress) / 0.15) : 1
  const finalOpacity = opacity * fadeOut

  return (
    <div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center"
      style={{
        opacity: finalOpacity,
        transform: `translateY(-50%) translateX(${(1 - finalOpacity) * 40}px)`,
        transition: "opacity 0.6s ease, transform 0.6s ease",
        pointerEvents: finalOpacity > 0.3 ? "auto" : "none",
      }}
    >
      {/* Canvas globe */}
      <div className="relative w-48 h-48 lg:w-56 lg:h-56">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>

      {/* Navigation items orbiting below the globe */}
      <nav className="mt-4 flex flex-col items-center gap-2" aria-label="Section navigation">
        {NAV_ITEMS.map((item, i) => {
          const isActive = (() => {
            const el = document.getElementById(item.id)
            if (!el) return false
            const rect = el.getBoundingClientRect()
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
          })()

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="group relative px-4 py-1.5 text-right w-full"
              style={{
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span
                className={`text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/50 group-hover:text-primary/80"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-3 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary scale-100 shadow-[0_0_6px_rgba(232,168,64,0.6)]"
                    : "bg-muted-foreground/20 scale-75 group-hover:bg-primary/50 group-hover:scale-100"
                }`}
              />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
