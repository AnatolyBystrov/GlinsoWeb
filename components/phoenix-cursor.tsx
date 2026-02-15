"use client"

import { useEffect, useRef, useCallback } from "react"

export default function PhoenixCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isTouchDevice = useRef(false)
  const mouse = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const particles = useRef<
    {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      hue: number
    }[]
  >([])
  const raf = useRef(0)
  const active = useRef(false)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  useEffect(() => {
    // Skip entirely on touch/mobile devices
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    if (isTouch) {
      isTouchDevice.current = true
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    resize()
    window.addEventListener("resize", resize)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      active.current = true
    }
    const onLeave = () => {
      active.current = false
    }
    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", () => {
      active.current = true
    })

    const spawn = () => {
      const spread = 6
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: pos.current.x + (Math.random() - 0.5) * spread,
          y: pos.current.y + (Math.random() - 0.5) * spread,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 2.5 - 1,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.5,
          size: 2 + Math.random() * 4,
          // Flame hue: 15 = red-orange, 35 = orange, 50 = yellow
          hue: 15 + Math.random() * 35,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smooth follow
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18

      const dx = mouse.current.x - pos.current.x
      const dy = mouse.current.y - pos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)

      // Always spawn a few particles, more when moving
      if (active.current) {
        spawn()
        if (speed > 3) spawn()
        if (speed > 8) spawn()
      }

      // Draw cursor dot (small bright core)
      if (active.current) {
        ctx.save()
        const grad = ctx.createRadialGradient(
          pos.current.x,
          pos.current.y,
          0,
          pos.current.x,
          pos.current.y,
          8 + speed * 0.3
        )
        grad.addColorStop(0, "hsla(45, 100%, 85%, 0.9)")
        grad.addColorStop(0.3, "hsla(38, 90%, 60%, 0.6)")
        grad.addColorStop(1, "hsla(25, 80%, 45%, 0)")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(pos.current.x, pos.current.y, 8 + speed * 0.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Update & draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.life -= 0.018 / p.maxLife
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.03 // Float upwards
        p.vx *= 0.98
        p.size *= 0.985

        if (p.life <= 0 || p.size < 0.3) {
          particles.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        const alpha = p.life * 0.8
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        grad.addColorStop(
          0,
          `hsla(${p.hue + (1 - p.life) * 15}, 100%, ${70 + p.life * 20}%, ${alpha})`
        )
        grad.addColorStop(
          0.5,
          `hsla(${p.hue}, 90%, ${50 + p.life * 15}%, ${alpha * 0.5})`
        )
        grad.addColorStop(1, `hsla(${p.hue - 10}, 80%, 30%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [resize])

  return (
    <>
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden md:block"
        aria-hidden="true"
      />
    </>
  )
}
