"use client"

import { useState, useEffect } from "react"

const navItems = [
  { label: "About", href: "#who-we-are" },
  { label: "Divisions", href: "#divisions" },
  { label: "Presence", href: "#presence" },
  { label: "ESG", href: "#esg" },
  { label: "Contact", href: "#contact" },
]

interface GlassNavProps {
  scrollProgress: number
}

export default function GlassNav({ scrollProgress }: GlassNavProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(scrollProgress > 0.04)
  }, [scrollProgress])

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
          <a
            href="#hero"
            className="text-xs md:text-sm font-sans font-light tracking-[0.2em] uppercase text-foreground/90 hover:text-primary transition-colors duration-300"
          >
            Glinso
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground/60 hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile: just show GLINSO brand, nav is implicit via scroll */}
          <span className="md:hidden text-[9px] font-mono tracking-[0.15em] text-muted-foreground/40">
            Scroll to explore
          </span>
        </nav>
      </div>
    </header>
  )
}
