"use client"

import { useRef, useEffect, useCallback } from "react"

interface VideoBackgroundProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function VideoBackground({ scrollProgress, mouseX, mouseY }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef<number>(0)

  /* Floating motes -- subtle luminous particles that drift slowly */
  const motes = useRef<{ x: number; y: number; vx: number; vy: number; r: number; a: number }[]>([])

  useEffect(() => {
    motes.current = Array.from({ length: 20 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: -Math.random() * 0.0002 - 0.00005,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.3 + 0.05,
    }))
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    /* Draw subtle pulse-line grid in the lower portion */
    const sp = scrollProgress
    const gridAlpha = Math.max(0, 0.06 - sp * 0.08)
    if (gridAlpha > 0.005) {
      ctx.strokeStyle = `rgba(190,165,120,${gridAlpha})`
      ctx.lineWidth = 0.5
      const yStart = h * 0.7
      for (let i = 0; i < 8; i++) {
        const yy = yStart + i * 18
        ctx.beginPath()
        ctx.moveTo(0, yy)
        for (let x = 0; x <= w; x += 4) {
          const wave = Math.sin(x * 0.008 + Date.now() * 0.0005 + i * 0.8) * 3
          ctx.lineTo(x, yy + wave)
        }
        ctx.stroke()
      }
    }

    /* Draw floating motes */
    const moteAlpha = Math.max(0, 1 - sp * 2)
    for (const m of motes.current) {
      m.x += m.vx
      m.y += m.vy
      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random() }
      if (m.x < -0.02) m.x = 1.02
      if (m.x > 1.02) m.x = -0.02

      const px = m.x * w
      const py = m.y * h
      const alpha = m.a * moteAlpha

      ctx.beginPath()
      ctx.arc(px, py, m.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(210,180,120,${alpha})`
      ctx.fill()
    }

    animFrame.current = requestAnimationFrame(draw)
  }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)
    animFrame.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrame.current)
    }
  }, [draw])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = Math.max(0.25, 0.8 - scrollProgress * 0.4)
    }
  }, [scrollProgress])

  /* Keep video visible and clearly seen */
  const videoOpacity = Math.max(0.3, 0.6 - scrollProgress * 0.4)

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ backgroundColor: "hsl(210 20% 98%)" }}>
      {/* Video container with proper aspect ratio handling */}
      <div
        className="absolute inset-0"
        style={{
          opacity: videoOpacity,
          transition: "opacity 0.3s ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="relative"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full"
            style={{
              filter: `brightness(${0.9 - scrollProgress * 0.15}) saturate(1.15) contrast(1.1)`,
              objectFit: "cover",
              objectPosition: "center center",
              transition: "filter 0.3s ease-out",
            }}
          >
            <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/video/hero-bg.mp4`} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Canvas overlay -- motes + signal lines */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ opacity: 0.8 }}
      />

      {/* Very subtle light vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: "radial-gradient(ellipse 90% 80% at 50% 42%, transparent 40%, rgba(245,247,250,0.3) 100%)",
        }}
      />

      {/* Gentle bottom fade to light */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none z-[2]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(245,247,250,0.5) 60%, hsl(210 20% 98%) 100%)",
        }}
      />
    </div>
  )
}
