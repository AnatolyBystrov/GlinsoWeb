"use client"

import { useRef, useEffect, useCallback, useState } from "react"

interface VideoBackgroundProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

export default function VideoBackground({ scrollProgress, mouseX, mouseY }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef<number>(0)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  /* Floating motes -- subtle luminous particles */
  const motes = useRef<{ x: number; y: number; vx: number; vy: number; r: number; a: number }[]>([])

  useEffect(() => {
    // No longer need to track isMobile
  }, [])

  useEffect(() => {
    motes.current = Array.from({ length: 15 }, () => ({
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

    const sp = scrollProgress

    /* Draw subtle pulse-line grid - simplified */
    const gridAlpha = Math.max(0, 0.05 - sp * 0.08)
    if (gridAlpha > 0.005) {
      ctx.strokeStyle = `rgba(190,165,120,${gridAlpha})`
      ctx.lineWidth = 0.5
      const yStart = h * 0.75
      for (let i = 0; i < 6; i++) {
        const yy = yStart + i * 20
        ctx.beginPath()
        ctx.moveTo(0, yy)
        for (let x = 0; x <= w; x += 6) {
          const wave = Math.sin(x * 0.01 + Date.now() * 0.0003 + i) * 2
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
      setIsMobileViewport(window.innerWidth < 768)
    }
    resize()
    window.addEventListener("resize", resize)
    animFrame.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrame.current)
    }
  }, [draw])

  // Switch video source when mobile viewport detection settles — no remount (no key change)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const newSrc = `${basePath}/video/${isMobileViewport ? "TestVideo.mp4" : "Glinso-finalVideo.mp4"}`
    // Only reload if src actually changed
    if (!video.currentSrc.endsWith(isMobileViewport ? "TestVideo.mp4" : "Glinso-finalVideo.mp4")) {
      video.src = newSrc
      video.load()
      video.play().catch(() => {})
    }
  }, [isMobileViewport, basePath])

  // On mount: force play (handles iOS where autoPlay alone is unreliable)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
    // Periodically re-check in case iOS paused it (background tab, low power mode, etc.)
    const id = setInterval(() => {
      if (video.paused && !video.ended) video.play().catch(() => {})
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const videoOpacity = Math.max(0.3, 0.6 - scrollProgress * 0.4)
  const videoSrc = `${basePath}/video/${isMobileViewport ? "TestVideo.mp4" : "Glinso-finalVideo.mp4"}`

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: "hsl(210 20% 98%)" }}
    >
      {/* Video container */}
      <div
        className="absolute inset-0"
        style={{
          opacity: videoOpacity,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "auto",
            minHeight: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            filter: `brightness(${0.9 - scrollProgress * 0.15}) saturate(1.15) contrast(1.1)`,
            transition: "filter 0.2s ease-out",
          }}
          onLoadedData={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ opacity: 0.7 }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: "radial-gradient(ellipse 90% 80% at 50% 42%, transparent 40%, rgba(245,247,250,0.3) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none z-[2]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(245,247,250,0.5) 60%, hsl(210 20% 98%) 100%)",
        }}
      />
    </div>
  )
}
