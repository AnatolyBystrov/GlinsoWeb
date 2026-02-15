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
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; speed: number }[]>([])
  const animFrame = useRef<number>(0)

  // Initialise floating particles
  useEffect(() => {
    const count = 60
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: -Math.random() * 0.0004 - 0.0001,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.5 + 0.5,
    }))
  }, [])

  // Canvas particle animation loop -- never stops
  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const goldR = 232
    const goldG = 168
    const goldB = 64

    for (const p of particles.current) {
      p.x += p.vx * p.speed
      p.y += p.vy * p.speed

      // Wrap around
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random() }
      if (p.x < -0.02) p.x = 1.02
      if (p.x > 1.02) p.x = -0.02

      const px = p.x * w
      const py = p.y * h

      ctx.beginPath()
      ctx.arc(px, py, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${goldR},${goldG},${goldB},${p.alpha * (1 - scrollProgress * 0.6)})`
      ctx.fill()
    }

    animFrame.current = requestAnimationFrame(drawParticles)
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
    animFrame.current = requestAnimationFrame(drawParticles)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrame.current)
    }
  }, [drawParticles])

  // Video playback rate changes with scroll
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = Math.max(0.3, 0.85 - scrollProgress * 0.4)
    }
  }, [scrollProgress])

  // Scroll-driven transforms for the video
  const videoOpacity = Math.max(0.12, 1 - scrollProgress * 1.8)
  const videoScale = 1 + scrollProgress * 0.12
  const parallaxX = mouseX * 8
  const parallaxY = mouseY * 8

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background">
      {/* Video layer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          opacity: videoOpacity,
          transform: `scale(${videoScale}) translate(${parallaxX}px, ${parallaxY}px)`,
          transformOrigin: "center center",
          transition: "opacity 0.4s ease-out",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full"
          style={{
            filter: `brightness(${0.75 - scrollProgress * 0.2}) saturate(1.15) contrast(1.05)`,
            objectFit: "cover",
            objectPosition: "center center",
          }}
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Particle overlay -- always running */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ opacity: Math.max(0.1, 1 - scrollProgress * 1.5) }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 0%, hsl(220 25% 3% / 0.35) 55%, hsl(220 25% 3% / 0.85) 100%)",
        }}
      />

      {/* Bottom gradient for blending into content */}
      <div
        className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(220 25% 4% / 0.6) 40%, hsl(220 25% 4%) 100%)",
        }}
      />

      {/* Top gradient for nav area */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none z-[2]"
        style={{
          background: "linear-gradient(to bottom, hsl(220 25% 3% / 0.4) 0%, transparent 100%)",
        }}
      />
    </div>
  )
}
