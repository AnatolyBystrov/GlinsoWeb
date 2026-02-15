"use client"

import { useState, useEffect } from "react"

const sections = [
  { id: "who-we-are", label: "About", range: [0.2, 0.4] },
  { id: "divisions", label: "Divisions", range: [0.4, 0.55] },
  { id: "presence", label: "Global", range: [0.55, 0.7] },
  { id: "esg", label: "ESG", range: [0.7, 0.85] },
  { id: "csr", label: "Community", range: [0.85, 1.0] },
]

interface GlassNavProps {
  scrollProgress: number
}

export default function GlassNav({ scrollProgress }: GlassNavProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    /* Show nav once you leave the hero area */
    setVisible(scrollProgress > 0.15)
  }, [scrollProgress])

  /* Find active section */
  const activeIdx = sections.findIndex(
    (s) => scrollProgress >= s.range[0] && scrollProgress < s.range[1]
  )

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8 pt-3">
        <nav
          className="flex items-center justify-between px-5 py-3 rounded-sm border border-white/[0.06]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(16px) saturate(1.2)",
            WebkitBackdropFilter: "blur(16px) saturate(1.2)",
          }}
          aria-label="Main navigation"
        >
          {/* Logo - click returns to hero */}
          <a
            href="#hero"
            className="text-xs md:text-sm font-sans font-light tracking-[0.2em] uppercase text-foreground/90 hover:text-primary transition-colors duration-300"
          >
            Glinso
          </a>

          {/* Section links */}
          <div className="hidden md:flex items-center gap-6">
            {sections.map((sec, i) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="relative text-[10px] font-mono tracking-[0.18em] uppercase transition-colors duration-300"
                style={{
                  color: i === activeIdx
                    ? "hsl(38 75% 55%)"
                    : "hsl(38 20% 50% / 0.4)",
                }}
              >
                {sec.label}
                {/* Active underline */}
                <span
                  className="absolute left-0 -bottom-1 h-px bg-primary transition-all duration-500"
                  style={{ width: i === activeIdx ? "100%" : "0%" }}
                />
              </a>
            ))}
          </div>

          {/* Mobile: current section indicator */}
          <span className="md:hidden text-[9px] font-mono tracking-[0.15em] text-primary/60 uppercase">
            {activeIdx >= 0 ? sections[activeIdx].label : "Explore"}
          </span>
        </nav>
      </div>
    </header>
  )
}
