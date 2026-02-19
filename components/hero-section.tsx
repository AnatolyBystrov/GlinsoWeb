"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const ease = [0.16, 1, 0.3, 1] as const

interface HeroSectionProps {
  scrollProgress?: number
}

export default function HeroSection({ scrollProgress = 0 }: HeroSectionProps) {
  const [phase, setPhase] = useState(0) // 0=black, 1=title, 2=subtitle, 3=full

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => setPhase(3), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  /* Fade hero content as user scrolls past */
  const heroFade = Math.max(0, 1 - scrollProgress * 6)
  const heroY = scrollProgress * -120

  const handleScrollDown = () => {
    const el = document.getElementById("who-we-are")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-[200vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Black overlay that lifts to reveal the scene */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ backgroundColor: "hsl(220 12% 10%)" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase >= 1 ? 0 : 1 }}
          transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Main content */}
        <div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          style={{
            opacity: heroFade,
            transform: `translateY(${heroY}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {/* Thin decorative line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={phase >= 1 ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease }}
            className="w-px h-12 md:h-16 bg-gradient-to-b from-transparent via-primary/60 to-transparent mx-auto mb-8 origin-top"
          />

          {/* Brand name -- elegant serif */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={phase >= 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.6, delay: 0.2, ease }}
            className="font-serif font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.02em] text-foreground leading-[0.9] mb-4"
          >
            Glinso
          </motion.h1>

          {/* Tagline -- the cinematic reveal */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={phase >= 2 ? { opacity: 1, letterSpacing: "0.2em" } : {}}
            transition={{ duration: 1.8, ease }}
            className="text-[10px] sm:text-xs md:text-sm font-mono uppercase text-primary/90 mb-10 md:mb-14"
          >
            Engineering Global Certainty
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={phase >= 2 ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, ease }}
            className="w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-10 md:mb-14"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease }}
            className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed text-balance"
          >
            A global reinsurance brokerage and risk advisory group,
            delivering capital-efficient solutions to insurers
            and specialty carriers worldwide.
          </motion.p>

          {/* CTA line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease }}
            className="mt-10 md:mt-14"
          >
            <a
              href="#who-we-are"
              className="inline-block text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-primary/70 hover:text-primary transition-colors duration-500 border-b border-primary/30 hover:border-primary/60 pb-1"
            >
              Discover
            </a>
          </motion.div>
        </div>

        {/* Scroll invite -- fine animated line at bottom */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 && scrollProgress < 0.05 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          onClick={handleScrollDown}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 cursor-pointer group"
          aria-label="Scroll down"
        >
            <span className="text-[8px] md:text-[9px] font-mono tracking-[0.35em] uppercase text-muted-foreground/50 group-hover:text-primary/60 transition-colors duration-500">
            Scroll
          </span>
          <motion.div
            className="w-px h-6 bg-gradient-to-b from-primary/30 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.button>

        {/* Top-right utility links */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="absolute top-5 right-6 md:right-10 z-20 flex items-center gap-5 md:gap-7"
          aria-label="Utility links"
        >
          {["Contact", "ESG", "Privacy"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[8px] md:text-[9px] font-mono tracking-[0.25em] uppercase text-muted-foreground/50 hover:text-primary/70 transition-colors duration-500"
            >
              {link}
            </a>
          ))}
        </motion.nav>
      </div>
    </section>
  )
}
