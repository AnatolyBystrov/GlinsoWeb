"use client"

import { useEffect, useRef, useState } from "react"

interface Trail {
  x: number
  y: number
  opacity: number
  scale: number
  id: number
}

export default function PhoenixCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [trails, setTrails] = useState<Trail[]>([])
  const mouse = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const prevPos = useRef({ x: -100, y: -100 })
  const velocity = useRef({ x: 0, y: 0 })
  const rotation = useRef(0)
  const trailId = useRef(0)
  const raf = useRef(0)
  const trailTimer = useRef(0)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // No custom cursor on touch devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }

    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    window.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseenter", onMouseEnter)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mouseenter", onMouseEnter)
    }
  }, [visible, isMobile])

  // Animation loop
  useEffect(() => {
    if (isMobile) return

    const animate = () => {
      const lerp = 0.12

      prevPos.current = { ...pos.current }
      pos.current.x += (mouse.current.x - pos.current.x) * lerp
      pos.current.y += (mouse.current.y - pos.current.y) * lerp

      velocity.current = {
        x: pos.current.x - prevPos.current.x,
        y: pos.current.y - prevPos.current.y,
      }

      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
      )

      // Rotate phoenix in the direction of movement
      if (speed > 0.5) {
        const targetAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI)
        // Smooth rotation
        let diff = targetAngle - rotation.current
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        rotation.current += diff * 0.08
      }

      // Apply to DOM directly for performance
      if (cursorRef.current) {
        const tilt = Math.min(speed * 0.8, 15)
        cursorRef.current.style.transform = `translate(${pos.current.x - 24}px, ${pos.current.y - 24}px) rotate(${rotation.current - 45}deg) scale(${1 + speed * 0.008})`
        cursorRef.current.style.filter = `drop-shadow(0 0 ${6 + speed * 1.5}px hsl(38 70% 55% / ${0.4 + speed * 0.03})) brightness(${1 + speed * 0.01})`
      }

      // Spawn trailing embers when moving
      if (speed > 2) {
        trailTimer.current++
        if (trailTimer.current % 3 === 0) {
          const id = trailId.current++
          setTrails((prev) => [
            ...prev.slice(-12),
            {
              x: pos.current.x + (Math.random() - 0.5) * 10,
              y: pos.current.y + (Math.random() - 0.5) * 10,
              opacity: 0.7 + Math.random() * 0.3,
              scale: 0.3 + Math.random() * 0.5,
              id,
            },
          ])
        }
      }

      raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [isMobile])

  // Fade out old trail particles
  useEffect(() => {
    if (trails.length === 0) return
    const timer = setTimeout(() => {
      setTrails((prev) => prev.slice(1))
    }, 150)
    return () => clearTimeout(timer)
  }, [trails])

  if (isMobile) return null

  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"], input, textarea, select, label {
          cursor: none !important;
        }
      `}</style>

      {/* Trailing ember particles */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            transform: `translate(${trail.x - 3}px, ${trail.y - 3}px) scale(${trail.scale})`,
            opacity: trail.opacity,
            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(38 80% 60%), hsl(25 90% 45%) 60%, transparent 100%)",
              boxShadow: "0 0 6px 2px hsl(38 70% 55% / 0.5)",
            }}
          />
        </div>
      ))}

      {/* Phoenix cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          width: 48,
          height: 48,
        }}
      >
        <img
          src="/images/phoenix-cursor.png"
          alt=""
          width={48}
          height={48}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </>
  )
}
