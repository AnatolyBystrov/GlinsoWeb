"use client"

import { motion } from "framer-motion"
import VerticalText from "./vertical-text"
import { ChevronDown } from "lucide-react"

const navItems = [
  { label: "Advantage", href: "#about" },
  { label: "Leadership", href: "#about" },
  { label: "Partnerships", href: "#about" },
  { label: "ESG", href: "#about" },
  { label: "Market Access", href: "#about" },
  { label: "Governance", href: "#about" },
]

interface HeroSectionProps {
  mounted?: boolean
}

export default function HeroSection({ mounted }: HeroSectionProps) {
  const handleScrollDown = () => {
    const target = document.getElementById("about")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-end md:justify-center overflow-hidden">


      {/* Top nav */}
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

      {/* Side vertical text - left */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
        <VerticalText text="GLINSO" delay={1.5} side="left" />
      </div>

      {/* Side vertical text - right */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
        <VerticalText text="REINSURANCE" delay={1.8} side="right" />
      </div>

      {/* Circular navigation around the centre of the hero (overlaying the phoenix video) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none hidden lg:flex">
        <div className="relative" style={{ width: 600, height: 600 }}>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-full border border-primary/[0.07]" />
          <div className="absolute inset-6 rounded-full border border-primary/[0.04]" />

          {navItems.map((item, i) => {
            const startAngle = -90
            const angleStep = 360 / navItems.length
            const angle = startAngle + i * angleStep
            const radian = (angle * Math.PI) / 180
            const radius = 300

            const x = Math.cos(radian) * radius
            const y = Math.sin(radian) * radius

            return (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 2 + i * 0.1 }}
                className="absolute pointer-events-auto group flex items-center gap-2"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(232,168,64,0.5)] transition-all duration-300" />
                <span className="whitespace-nowrap text-[10px] font-mono tracking-[0.25em] uppercase text-foreground/30 group-hover:text-primary transition-colors duration-300">
                  {item.label}
                </span>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-auto md:mt-16 pb-20 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <span className="text-sm md:text-base font-mono tracking-[0.5em] uppercase text-primary/70">
            Glinso Group
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-3xl md:text-6xl lg:text-7xl xl:text-8xl font-sans font-light tracking-tight text-balance leading-[1.1]"
        >
          <span className="text-foreground">Advancing</span>{" "}
          <span className="text-primary">Innovation</span>
          <br />
          <span className="text-foreground/80">in Reinsurance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Strategic reinsurance brokerage delivering global market access,
          innovative risk solutions, and unparalleled client partnerships.
        </motion.p>

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
        transition={{ duration: 1, delay: 2.5 }}
        onClick={handleScrollDown}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 md:gap-3 cursor-pointer group"
        aria-label="Scroll down to discover"
      >
        <span className="hidden md:block text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
          Scroll down to discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.button>
    </section>
  )
}
