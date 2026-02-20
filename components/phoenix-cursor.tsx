"use client"

import { useEffect, useRef, useCallback } from "react"

export default function PhoenixCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const trail = useRef<{ x: number; y: number; age: number }[]>([])
  const raf = useRef(0)
  const active = useRef(false)

  const resize = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    c.width = window.innerWidth
    c.height = window.innerHeight
  }, [])

  useEffect(() => {
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    if (isTouch) return

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
    const onLeave = () => { active.current = false }
    const onEnter = () => { active.current = true }
    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smooth follow with gentle easing
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15

      if (!active.current) {
        raf.current = requestAnimationFrame(animate)
        return
      }

      // Add a trail point every few frames
      const last = trail.current[trail.current.length - 1]
      if (!last || Math.hypot(pos.current.x - last.x, pos.current.y - last.y) > 4) {
        trail.current.push({ x: pos.current.x, y: pos.current.y, age: 0 })
      }

      // Keep trail short
      if (trail.current.length > 12) trail.current.shift()

      // Age and draw trail
      for (let i = trail.current.length - 1; i >= 0; i--) {
        const p = trail.current[i]
        p.age += 0.04
        if (p.age > 1) {
          trail.current.splice(i, 1)
          continue
        }
        const alpha = (1 - p.age) * 0.3
        const r = 2 + (1 - p.age) * 1.5

        // Dark outline
        ctx.beginPath()
        ctx.arc(p.x, p.y, r + 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.3})`
        ctx.fill()

        // Orange fill
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(28, 95%, 50%, ${alpha})`
        ctx.fill()
      }

      // Outer ring (dark outline)
      ctx.beginPath()
      ctx.arc(pos.current.x, pos.current.y, 8, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Main cursor dot with glow
      const g = ctx.createRadialGradient(
        pos.current.x, pos.current.y, 0,
        pos.current.x, pos.current.y, 7
      )
      g.addColorStop(0, "hsla(28, 95%, 55%, 0.9)")
      g.addColorStop(0.5, "hsla(28, 95%, 50%, 0.5)")
      g.addColorStop(1, "hsla(28, 95%, 45%, 0)")
      ctx.beginPath()
      ctx.arc(pos.current.x, pos.current.y, 7, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()

      // Bright white core
      ctx.beginPath()
      ctx.arc(pos.current.x, pos.current.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
      ctx.fill()

      raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
    }
  }, [resize])

  return (
    <>
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) and (min-width: 768px) {
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
