"use client"

import { useState, useEffect } from "react"

const sections = [
  { id: "who-we-are", label: "About" },
  { id: "solutions", label: "Solutions" },
  { id: "presence", label: "Global" },
  { id: "esg", label: "ESG" },
  { id: "contact", label: "Contact" },
]

interface GlassNavProps {
  scrollProgress: number
}

export default function GlassNav({ scrollProgress }: GlassNavProps) {
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    setVisible(scrollProgress > 0.08)
  }, [scrollProgress])

  /* Track which section is in view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: "-100px 0px -40% 0px" }
    )

    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-16px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8 pt-4">
        <nav
          className="flex items-center justify-between px-5 md:px-6 py-3 border border-white/[0.04]"
          style={{
            background: "rgba(10,10,10,0.75)",
            backdropFilter: "blur(20px) saturate(1.1)",
            WebkitBackdropFilter: "blur(20px) saturate(1.1)",
          }}
          aria-label="Main navigation"
        >
          <a
            href="#hero"
            className="font-serif text-sm md:text-base font-light tracking-[0.08em] text-foreground/80 hover:text-foreground transition-colors duration-300"
          >
            Glinso
          </a>

          <div className="hidden md:flex items-center gap-7">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="relative text-[9px] font-mono tracking-[0.2em] uppercase transition-colors duration-300"
                style={{
                  color: activeId === sec.id
                    ? "hsl(38 65% 55%)"
                    : "hsl(30 8% 40%)",
                }}
              >
                {sec.label}
                <span
                  className="absolute left-0 -bottom-1 h-px bg-primary/50 transition-all duration-500"
                  style={{ width: activeId === sec.id ? "100%" : "0%" }}
                />
              </a>
            ))}
          </div>

          <span className="md:hidden text-[8px] font-mono tracking-[0.2em] text-primary/50 uppercase">
            {sections.find((s) => s.id === activeId)?.label || ""}
          </span>
        </nav>
      </div>
    </header>
  )
}
