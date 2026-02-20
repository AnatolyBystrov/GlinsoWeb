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

  /* Floating motes -- subtle luminous particles */
  const motes = useRef<{ x: number; y: number; vx: number; vy: number; r: number; a: number }[]>([])

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
    const video = videoRef.current
    if (!video) return

    // Detect mobile device
    const isMobile = window.innerWidth < 768

    // Adjust playback rate (simpler on mobile to avoid issues)
    video.playbackRate = isMobile ? 0.8 : Math.max(0.25, 0.8 - scrollProgress * 0.4)

    // Only apply aggressive play enforcement on mobile
    if (isMobile) {
      const ensurePlay = () => {
        if (video.paused) {
          video.play().catch(() => {})
        }
      }

      // Check periodically and on scroll (mobile only)
      const playInterval = setInterval(ensurePlay, 1000)
      window.addEventListener('scroll', ensurePlay, { passive: true })

      return () => {
        clearInterval(playInterval)
        window.removeEventListener('scroll', ensurePlay)
      }
    }
  }, [scrollProgress])

  const videoOpacity = Math.max(0.3, 0.6 - scrollProgress * 0.4)

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
          className="absolute inset-0 w-full h-full"
          style={{
            filter: `brightness(${0.9 - scrollProgress * 0.15}) saturate(1.15) contrast(1.1)`,
            objectFit: "cover",
            objectPosition: "center center",
            transition: "filter 0.2s ease-out",
          }}
          onLoadedData={(e) => {
            // Ensure video starts playing on load
            const video = e.currentTarget
            video.play().catch(() => {})
          }}
          onEnded={(e) => {
            // Manually restart video when it ends - only on mobile (desktop handles loop naturally)
            const isMobile = window.innerWidth < 768
            if (isMobile) {
              const video = e.currentTarget
              video.currentTime = 0
              video.play().catch(() => {})
            }
          }}
          onPause={(e) => {
            // Auto-resume if paused unexpectedly - only on mobile Safari
            const isMobile = window.innerWidth < 768
            if (isMobile) {
              const video = e.currentTarget
              if (!video.ended) {
                video.play().catch(() => {})
              }
            }
          }}
        >
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/video/hero-bg.mp4`} type="video/mp4" />
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
