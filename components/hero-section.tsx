"use client"

import { motion } from "framer-motion"
import VerticalText from "./vertical-text"
import { ChevronDown } from "lucide-react"

const orbitalNavItems = [
  { label: "Advantage", href: "#about", angle: -60 },
  { label: "Leadership", href: "#about", angle: -20 },
  { label: "Partnerships", href: "#about", angle: 20 },
  { label: "ESG", href: "#about", angle: 60 },
  { label: "Access", href: "#about", angle: 100 },
  { label: "Governance", href: "#about", angle: 140 },
]

export default function HeroSection() {
  const handleScrollDown = () => {
    const target = document.getElementById("about")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Side vertical text - left */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
        <VerticalText text="GLINSO" delay={1.5} side="left" />
      </div>

      {/* Side vertical text - right */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
        <VerticalText text="REINSURANCE" delay={1.8} side="right" />
      </div>

      {/* Orbital navigation menu - positioned around the central globe */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none hidden lg:flex">
        <div className="relative" style={{ width: 520, height: 520 }}>
          {orbitalNavItems.map((item, i) => {
            const radian = (item.angle * Math.PI) / 180
            const radiusX = 260
            const radiusY = 220
            const x = Math.cos(radian) * radiusX
            const y = Math.sin(radian) * radiusY

            return (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.8 + i * 0.12 }}
                className="absolute pointer-events-auto group"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Connecting dot */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
                {/* Label */}
                <span className="relative block whitespace-nowrap text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/40 group-hover:text-primary transition-colors duration-300 px-3 py-2">
                  {item.label}
                </span>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Company name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <span className="text-sm md:text-base font-mono tracking-[0.5em] uppercase text-primary/70">
            Glinso Group
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-sans font-light tracking-tight text-balance leading-[1.1]"
        >
          <span className="text-foreground">Advancing</span>{" "}
          <span className="text-primary">Innovation</span>
          <br />
          <span className="text-foreground/80">in Reinsurance</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Strategic reinsurance brokerage delivering global market access,
          innovative risk solutions, and unparalleled client partnerships.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="mt-10 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 cursor-pointer group"
        aria-label="Scroll down to discover"
      >
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
          Scroll down to discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.button>

      {/* Top nav - right */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-6 right-6 md:top-8 md:right-10 z-20 flex items-center gap-6"
        aria-label="Main navigation"
      >
        {["Contact", "ESG", "Privacy Policy"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
            className="text-xs font-mono tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </motion.nav>

      {/* Company logo top-left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 left-6 md:top-8 md:left-10 z-20"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20" />
            <svg
              viewBox="0 0 40 40"
              className="w-10 h-10 text-primary"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="8" />
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2
                const x1 = 20 + Math.cos(angle) * 11
                const y1 = 20 + Math.sin(angle) * 11
                const x2 = 20 + Math.cos(angle) * 16
                const y2 = 20 + Math.sin(angle) * 16
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
          </div>
          <div className="hidden md:block">
            <span className="text-sm font-sans font-semibold tracking-[0.15em] uppercase text-foreground">
              Glinso
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
