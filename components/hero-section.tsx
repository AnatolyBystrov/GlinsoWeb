"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"

const ease = [0.16, 1, 0.3, 1] as const

/* Mont-fort style: division titles that cycle as you scroll through the hero */
const divisions = [
  { title: "Reinsurance", subtitle: "Treaty, Facultative & Specialty Lines" },
  { title: "Advisory", subtitle: "Strategic Risk & Capital Consulting" },
  { title: "Analytics", subtitle: "Data-Driven Underwriting Intelligence" },
  { title: "Capital Solutions", subtitle: "ILS, Sidecars & Alt Risk Transfer" },
]

interface HeroSectionProps {
  scrollProgress?: number
}

export default function HeroSection({ scrollProgress = 0 }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  /* Map early scroll (0 -> 0.25) to active division index */
  useEffect(() => {
    const heroScroll = Math.min(scrollProgress / 0.2, 1)
    const idx = Math.min(Math.floor(heroScroll * divisions.length), divisions.length - 1)
    setActiveIndex(idx)
  }, [scrollProgress])

  const handleScrollDown = () => {
    const target = document.getElementById("who-we-are")
    if (target) target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[300vh] overflow-hidden"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen flex flex-col">
        {/* Top-right utility links -- mont-fort style */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute top-5 right-6 md:right-10 z-20 flex items-center gap-5 md:gap-7"
          aria-label="Utility links"
        >
          {["Contact", "ESG", "Privacy Policy"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40 hover:text-primary/70 transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </motion.nav>

        {/* Center content area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Company name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-sans font-extralight tracking-[-0.03em] uppercase text-foreground leading-none">
              Glinso
            </h1>
          </motion.div>

          {/* Division titles -- mont-fort style cycling on scroll */}
          <div className="relative w-full max-w-3xl mx-auto h-24 md:h-32">
            {divisions.map((div, i) => {
              const isActive = i === activeIndex
              return (
                <motion.div
                  key={div.title}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : i < activeIndex ? -30 : 30,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.7, ease }}
                >
                  <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-[0.04em] uppercase text-foreground/70">
                    {div.title}
                  </span>
                  <span className="mt-2 md:mt-3 text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-primary/50">
                    {div.subtitle}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* Division index dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex items-center gap-2.5 mt-8 md:mt-10"
          >
            {divisions.map((_, i) => (
              <div
                key={i}
                className="relative flex items-center justify-center transition-all duration-500"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: i === activeIndex
                      ? "hsl(38 75% 55%)"
                      : "hsl(38 20% 30% / 0.3)",
                    transform: i === activeIndex ? "scale(1.5)" : "scale(1)",
                    boxShadow: i === activeIndex ? "0 0 8px hsl(38 75% 55% / 0.4)" : "none",
                  }}
                />
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.0 }}
            className="mt-8 md:mt-10 w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease }}
            className="mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-muted-foreground/60 max-w-md mx-auto leading-relaxed text-center text-balance"
          >
            A global reinsurance brokerage and risk advisory group, delivering
            capital-efficient solutions to insurers worldwide.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress < 0.15 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleScrollDown}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
          aria-label="Scroll down"
        >
          <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300">
            Scroll down to discover
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-primary/25" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}
