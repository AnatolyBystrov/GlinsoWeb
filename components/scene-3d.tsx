"use client"

import { useRef, useEffect, useCallback } from "react"

interface Scene3DProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  drift: number
}

interface Ray {
  angle: number
  length: number
  width: number
  speed: number
}

interface WaveLayer {
  amplitude: number
  frequency: number
  speed: number
  phase: number
  color: string
}

export default function Scene3D({ scrollProgress, mouseX, mouseY }: Scene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const raysRef = useRef<Ray[]>([])
  const wavesRef = useRef<WaveLayer[]>([])
  const shipXRef = useRef(-0.3)
  const scrollRef = useRef(scrollProgress)
  const mouseXRef = useRef(mouseX)
  const mouseYRef = useRef(mouseY)

  scrollRef.current = scrollProgress
  mouseXRef.current = mouseX
  mouseYRef.current = mouseY

  const initScene = useCallback(() => {
    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random() * 0.6,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.0002 + 0.0001,
        opacity: Math.random() * 0.4 + 0.1,
        drift: Math.random() * 0.0003 - 0.00015,
      })
    }
    particlesRef.current = particles

    const rays: Ray[] = []
    for (let i = 0; i < 14; i++) {
      rays.push({
        angle: (i / 14) * Math.PI * 2,
        length: Math.random() * 0.15 + 0.1,
        width: Math.random() * 0.015 + 0.005,
        speed: Math.random() * 0.1 + 0.05,
      })
    }
    raysRef.current = rays

    wavesRef.current = [
      { amplitude: 8, frequency: 0.008, speed: 0.0006, phase: 0, color: "rgba(10, 22, 40, 0.95)" },
      { amplitude: 5, frequency: 0.012, speed: 0.0009, phase: 2, color: "rgba(8, 18, 35, 0.85)" },
      { amplitude: 3, frequency: 0.018, speed: 0.0012, phase: 4, color: "rgba(5, 12, 28, 0.75)" },
    ]
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    initScene()

    let currentDpr = 1

    const resize = () => {
      currentDpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * currentDpr
      canvas.height = window.innerHeight * currentDpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener("resize", resize)

    const animate = (timestamp: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const sp = scrollRef.current
      const mx = mouseXRef.current
      const my = mouseYRef.current
      const t = timestamp

      ctx.save()
      ctx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
      bgGrad.addColorStop(0, "#050a14")
      bgGrad.addColorStop(0.4, "#0a1428")
      bgGrad.addColorStop(0.7, "#0a1628")
      bgGrad.addColorStop(1, "#050a18")
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // --- Particles ---
      for (const p of particlesRef.current) {
        p.y -= p.speed
        p.x += p.drift + Math.sin(t * 0.001 + p.x * 10) * 0.00005
        if (p.y < -0.05) {
          p.y = 0.65
          p.x = Math.random()
        }
        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05
        const flicker = 0.7 + Math.sin(t * 0.003 + p.x * 100) * 0.3
        ctx.fillStyle = `rgba(232, 168, 64, ${p.opacity * flicker})`
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- Sun ---
      const scrollOffset = sp * h * 0.6
      const sunX = w * 0.5 + mx * 30
      const sunY = h * 0.3 - scrollOffset + my * 20
      const baseRadius = Math.min(w, h) * 0.08
      const pulse = 1 + Math.sin(t * 0.0008) * 0.04

      // Outer halo
      const haloGrad = ctx.createRadialGradient(sunX, sunY, baseRadius * 0.5, sunX, sunY, baseRadius * 5)
      haloGrad.addColorStop(0, "rgba(232, 168, 64, 0.06)")
      haloGrad.addColorStop(0.5, "rgba(232, 168, 64, 0.02)")
      haloGrad.addColorStop(1, "rgba(232, 168, 64, 0)")
      ctx.fillStyle = haloGrad
      ctx.beginPath()
      ctx.arc(sunX, sunY, baseRadius * 5, 0, Math.PI * 2)
      ctx.fill()

      // Rays
      ctx.save()
      ctx.translate(sunX, sunY)
      ctx.rotate(t * 0.00005)
      for (const ray of raysRef.current) {
        const angle = ray.angle + t * 0.00003 * ray.speed
        const len = (baseRadius + ray.length * w) * pulse
        ctx.save()
        ctx.rotate(angle)
        const rayGrad = ctx.createLinearGradient(baseRadius * 0.8, 0, len, 0)
        rayGrad.addColorStop(0, "rgba(240, 192, 96, 0.12)")
        rayGrad.addColorStop(0.5, "rgba(240, 192, 96, 0.04)")
        rayGrad.addColorStop(1, "rgba(240, 192, 96, 0)")
        ctx.fillStyle = rayGrad
        ctx.fillRect(baseRadius * 0.8, -ray.width * w * 0.5, len - baseRadius * 0.8, ray.width * w)
        ctx.restore()
      }
      ctx.restore()

      // Mid glow
      const midGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, baseRadius * 2 * pulse)
      midGrad.addColorStop(0, "rgba(240, 200, 100, 0.25)")
      midGrad.addColorStop(0.4, "rgba(232, 168, 64, 0.1)")
      midGrad.addColorStop(1, "rgba(232, 168, 64, 0)")
      ctx.fillStyle = midGrad
      ctx.beginPath()
      ctx.arc(sunX, sunY, baseRadius * 2 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Core sun
      const coreGrad = ctx.createRadialGradient(
        sunX - baseRadius * 0.2,
        sunY - baseRadius * 0.2,
        0,
        sunX,
        sunY,
        baseRadius * pulse
      )
      coreGrad.addColorStop(0, "#fff0c0")
      coreGrad.addColorStop(0.3, "#f0c860")
      coreGrad.addColorStop(0.7, "#e8a840")
      coreGrad.addColorStop(1, "#d4922a")
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(sunX, sunY, baseRadius * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Bright highlight
      const hlGrad = ctx.createRadialGradient(
        sunX - baseRadius * 0.3,
        sunY - baseRadius * 0.3,
        0,
        sunX,
        sunY,
        baseRadius * 0.6
      )
      hlGrad.addColorStop(0, "rgba(255, 255, 240, 0.4)")
      hlGrad.addColorStop(1, "rgba(255, 255, 240, 0)")
      ctx.fillStyle = hlGrad
      ctx.beginPath()
      ctx.arc(sunX, sunY, baseRadius * 0.6, 0, Math.PI * 2)
      ctx.fill()

      // --- Ocean ---
      const oceanStart = h * 0.55 - sp * h * 0.15

      // Sun reflection on water
      const reflGrad = ctx.createLinearGradient(sunX, oceanStart, sunX, h)
      reflGrad.addColorStop(0, "rgba(232, 168, 64, 0.08)")
      reflGrad.addColorStop(0.3, "rgba(232, 168, 64, 0.03)")
      reflGrad.addColorStop(1, "rgba(232, 168, 64, 0)")
      ctx.fillStyle = reflGrad
      ctx.fillRect(sunX - w * 0.15, oceanStart, w * 0.3, h - oceanStart)

      // Wave layers
      for (const wave of wavesRef.current) {
        ctx.fillStyle = wave.color
        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w; x += 3) {
          const y =
            oceanStart +
            wave.phase * 10 +
            Math.sin(x * wave.frequency + t * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.5 + t * wave.speed * 0.7) * wave.amplitude * 0.5
          ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fill()
      }

      // Shimmer on water
      ctx.strokeStyle = "rgba(232, 168, 64, 0.04)"
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const yBase = oceanStart + 30 + i * 25
        ctx.beginPath()
        for (let x = sunX - 80; x < sunX + 80; x += 2) {
          const y = yBase + Math.sin(x * 0.05 + t * 0.002 + i) * 3
          if (x === sunX - 80) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // --- Ship ---
      shipXRef.current += 0.00005
      if (shipXRef.current > 1.2) shipXRef.current = -0.2

      const sX = shipXRef.current * w
      const bob = Math.sin(t * 0.0005) * 3
      const sY = oceanStart - 8 + bob - sp * h * 0.15
      const tilt = Math.sin(t * 0.0004) * 0.02
      const sc = Math.min(w, h) * 0.001

      ctx.save()
      ctx.translate(sX, sY)
      ctx.rotate(tilt)
      ctx.scale(sc, sc)

      // Hull
      ctx.fillStyle = "#1a1a2e"
      ctx.beginPath()
      ctx.moveTo(-50, 0)
      ctx.lineTo(-60, 10)
      ctx.lineTo(60, 10)
      ctx.lineTo(50, 0)
      ctx.lineTo(40, -5)
      ctx.lineTo(-40, -5)
      ctx.closePath()
      ctx.fill()

      // Deck
      ctx.fillStyle = "#1e1e35"
      ctx.fillRect(-30, -12, 50, 7)

      // Bridge
      ctx.fillStyle = "#252540"
      ctx.fillRect(20, -28, 18, 18)

      // Funnel
      ctx.fillStyle = "#2a2a3a"
      ctx.fillRect(25, -36, 8, 10)

      // Funnel accent
      ctx.fillStyle = "#e8a840"
      ctx.fillRect(25, -37, 8, 2)

      // Window lights
      ctx.fillStyle = "rgba(232, 168, 64, 0.6)"
      ctx.fillRect(23, -24, 3, 3)
      ctx.fillRect(28, -24, 3, 3)
      ctx.fillRect(33, -24, 3, 3)

      ctx.restore()

      ctx.restore()

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [initScene])

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
