"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

export default function HeroSection() {
  const handleScrollDown = () => {
    const target = document.getElementById("who-we-are")
    if (target) target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Main stacked heading */}
      <div className="relative z-10 text-center px-6">
        {/* Main word stack */}
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-sans font-extralight tracking-[-0.02em] uppercase text-foreground leading-none"
          >
            Glinso
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sans font-extralight tracking-[0.05em] uppercase text-foreground/70 leading-none"
          >
            Reinsurance
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="mt-2 md:mt-3 text-xs sm:text-sm md:text-base font-mono tracking-[0.3em] md:tracking-[0.4em] uppercase text-primary/60"
          >
            {"Advisory \u00B7 Analytics"}
          </motion.span>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.0 }}
          className="mt-8 md:mt-10 mx-auto w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease }}
          className="mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed text-balance"
        >
          Glinso is a global reinsurance brokerage and risk advisory group. We
          structure, place and manage reinsurance programmes, delivering
          capital-efficient risk transfer solutions to insurers and specialty
          carriers worldwide.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="#who-we-are"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease }}
          className="inline-block mt-8 md:mt-10 px-8 py-3 border border-primary/30 text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-400"
        >
          Discover Glinso
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        onClick={handleScrollDown}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Scroll down to discover"
      >
        <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300">
          Scroll down to discover
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary/30" />
        </motion.div>
      </motion.button>
    </section>
  )
}
