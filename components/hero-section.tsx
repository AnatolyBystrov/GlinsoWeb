"use client"

import { motion } from "framer-motion"
import VerticalText from "./vertical-text"
import { ChevronDown } from "lucide-react"

const navItems = [
  { label: "Advantage", href: "#advantage" },
  { label: "Leadership", href: "#leadership" },
  { label: "Partnerships", href: "#partnerships" },
  { label: "ESG", href: "#esg" },
  { label: "Market Access", href: "#access" },
  { label: "Governance", href: "#governance" },
]

export default function HeroSection() {
  const handleScrollDown = () => {
    const target = document.getElementById("about")
    if (target) target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Top nav -- positioned within the hero, top-right */}
      <motion.nav
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-5 right-5 md:top-8 md:right-10 z-20 flex items-center gap-4 md:gap-6"
        aria-label="Main navigation"
      >
        {["Contact", "ESG", "Privacy Policy"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
            className="text-[10px] md:text-xs font-mono tracking-[0.15em] md:tracking-[0.2em] uppercase text-foreground/40 hover:text-primary transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </motion.nav>

      {/* Side vertical text */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex">
        <VerticalText text="GLINSO" delay={1.5} side="left" />
      </div>
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex">
        <VerticalText text="REINSURANCE" delay={1.8} side="right" />
      </div>

      {/* Circular nav around the phoenix (desktop) */}
      <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none hidden xl:flex">
        <div className="relative" style={{ width: 560, height: 560 }}>
          <div className="absolute inset-0 rounded-full border border-primary/[0.06]" />
          <div className="absolute inset-8 rounded-full border border-primary/[0.03]" />

          {navItems.map((item, i) => {
            const startAngle = -90
            const angleStep = 360 / navItems.length
            const angle = startAngle + i * angleStep
            const radian = (angle * Math.PI) / 180
            const radius = 280
            const x = Math.cos(radian) * radius
            const y = Math.sin(radian) * radius

            return (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.2 + i * 0.08 }}
                className="absolute pointer-events-auto group flex items-center gap-2"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_10px_hsl(38_70%_55%_/_0.5)] transition-all duration-300" />
                <span className="whitespace-nowrap text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/25 group-hover:text-primary transition-colors duration-300">
                  {item.label}
                </span>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Main content -- centred on all screens */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          <span className="text-xs md:text-sm font-mono tracking-[0.4em] md:tracking-[0.5em] uppercase text-primary/60">
            Glinso Group
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-sans font-light tracking-tight text-balance leading-[1.05]"
        >
          <span className="text-foreground">Advancing</span>{" "}
          <span className="text-primary">Innovation</span>
          <br />
          <span className="text-foreground/80">in Reinsurance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 text-sm md:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Strategic reinsurance brokerage delivering global market access,
          innovative risk solutions, and unparalleled client partnerships.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.6 }}
          className="mt-8 mx-auto w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        onClick={handleScrollDown}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Scroll down to discover"
      >
        <span className="hidden md:block text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/50 group-hover:text-primary/70 transition-colors duration-300">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary/40" />
        </motion.div>
      </motion.button>
    </section>
  )
}
