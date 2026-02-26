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
  const heroFade = Math.max(0, 1 - scrollProgress * 3)
  const heroY = scrollProgress * -120

  const handleScrollDown = () => {
    const el = document.getElementById("who-we-are")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-[100vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-end overflow-hidden" style={{ paddingTop: "clamp(60px, 8vh, 100px)", paddingBottom: "clamp(60px, 10vh, 120px)" }}>

        {/* Light overlay that lifts to reveal the scene */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ backgroundColor: "hsl(210 20% 98%)" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase >= 1 ? 0 : 1 }}
          transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Light backing for text readability */}
        <div
          className="absolute inset-0 z-5 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(255,255,255,0.4) 0%, transparent 60%)",
          }}
        />

        {/* Main content */}
        <div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto pb-2"
          style={{
            opacity: heroFade,
            transform: `translateY(${heroY}px)`,
            transition: "transform 0.1s linear",
            marginBottom: "max(-5vh, -60px)",
          }}
        >
          {/* Hero title */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={phase >= 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.6, delay: 0.2, ease }}
            className="font-serif font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.03em] leading-[1.1] mb-2"
            style={{
              color: "hsl(220 15% 20%)",
              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
            }}
          >
            GLINSO
          </motion.h1>

          {/* Tagline -- the cinematic reveal */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={phase >= 2 ? { opacity: 1, letterSpacing: "0.2em" } : {}}
            transition={{ duration: 1.8, ease }}
            className="text-[10px] sm:text-xs md:text-sm font-mono uppercase mb-3"
            style={{
              color: "hsl(28 95% 62%)",
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            Engineering Global Certainty
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={phase >= 2 ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, ease }}
            className="w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-3"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease }}
            className="text-xs md:text-sm max-w-md mx-auto leading-relaxed text-balance mb-3"
            style={{
              color: "hsl(220 10% 45%)",
            }}
          >
            Independent reinsurance brokerage delivering structured placement solutions
          </motion.p>

          {/* CTA line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <a
              href="#who-we-are"
              className="inline-block text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase hover:text-primary transition-colors duration-500 border-b hover:border-primary pb-1"
              style={{
                color: "hsl(28 95% 62%)",
                borderColor: "hsl(28 95% 62% / 0.5)",
              }}
            >
              Discover
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease }}
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
          style={{ opacity: heroFade }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M12 19L19 12M12 19L5 12"
                stroke="hsl(28 95% 62%)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: "hsl(220 10% 45%)" }}>
            Scroll
          </span>
        </motion.div>

      </div>
    </section>
  )
}
