"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import WorldMap from "./world-map"

const ease = [0.16, 1, 0.3, 1] as const

/* ── Intersection observer hook ── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Section header component ── */
function SectionHeader({
  index,
  title,
  visible,
  subtitle,
}: {
  index: string
  title: string
  visible: boolean
  subtitle?: string
}) {
  return (
    <div className="mb-14 md:mb-20">
      <motion.span
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
        className="text-[10px] font-mono text-primary mb-5 block tracking-[0.3em]"
      >
        {index}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
        animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.2, delay: 0.1, ease }}
        className="font-serif font-light text-4xl md:text-6xl lg:text-7xl tracking-[-0.01em] text-foreground leading-[1.05] mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="text-sm md:text-base text-secondary-foreground max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.2, ease }}
        className="w-14 md:w-20 h-px bg-primary mt-6 origin-left"
      />
    </div>
  )
}

/* ── 1. NARRATIVE INTRODUCTION ── */
function NarrativeIntro() {
  const { ref, visible } = useReveal()
  return (
    <section
      id="who-we-are"
      ref={ref}
      className="relative py-28 md:py-40"
      style={{
        background: "linear-gradient(180deg, transparent 0%, hsl(210 20% 95%) 20%, hsl(210 20% 95%) 80%, transparent 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="01" title="Who We Are" visible={visible} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left -- large artistic quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2, ease }}
          >
            <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground leading-[1.5] tracking-[-0.005em]">
              Technical clarity.
              <br />
              <span className="text-primary">Direct market access.</span>
              <br />
              Execution without noise.
            </p>
          </motion.div>

          {/* Right -- body text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease }}
            className="space-y-5"
          >
            <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">
              GLINSO Brokers FZE is an independent insurance and reinsurance brokerage headquartered in Ras Al Khaimah, United Arab Emirates. We act for insurers, reinsurers, MGAs, and corporate clients, delivering structured placement solutions and strategic market access.
            </p>
            <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">
              Founded in 2009, we combine disciplined risk assessment, global market access, and direct decision-making to deliver efficient placement solutions. <span className="text-primary">Our focus is long-term partnerships, not transactional placements.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 2. SOLUTIONS ── */
const services = [
  {
    code: "01",
    name: "Insurance",
    desc: "Comprehensive insurance solutions across property, casualty, specialty and marine lines worldwide.",
    color: "hsl(192 45% 65%)",
  },
  {
    code: "02",
    name: "Reinsurance",
    desc: "Treaty and facultative reinsurance structuring with access to global reinsurance capacity.",
    color: "hsl(192 45% 65%)",
  },
  {
    code: "03",
    name: "Brokerage",
    desc: "Independent brokerage services connecting cedants with optimal market solutions.",
    color: "hsl(192 45% 65%)",
  },
  {
    code: "04",
    name: "Claims Management",
    desc: "Professional claims settlement and loss adjustment services across all insurance lines.",
    color: "hsl(192 45% 65%)",
  },
]

function Solutions() {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="solutions" ref={ref} className="relative py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader
          index="02"
          title="Solutions"
          subtitle="Comprehensive reinsurance and insurance placement solutions tailored to risk profile, geography, and capital strategy."
          visible={visible}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, ease }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative p-8 md:p-10 rounded-xl overflow-hidden cursor-default transition-all duration-500 shadow-sm hover:shadow-md"
              style={{
                background: hovered === i ? "hsl(192 45% 60%)" : "hsl(192 45% 65%)",
                border: "none",
              }}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="text-xs font-mono tracking-[0.15em] font-semibold"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {s.code}
                </span>
              </div>
              <h3
                className="font-serif text-xl md:text-2xl font-semibold mb-3 transition-colors duration-500"
                style={{ color: "white" }}
              >
                {s.name}
              </h3>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.95)" }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 3. GLOBAL PRESENCE with animated counters ── */
const offices = [
  { city: "Ras Al Khaimah", tz: "GST+4", status: "Headquarters", markets: "Global" },
  { city: "Dubai", tz: "GST+4", status: "Representative Office", markets: "Regional" },
]

function AnimatedNumber({ value, visible }: { value: string; visible: boolean }) {
  const num = parseInt(value)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!visible) return
    let frame: number
    const start = Date.now()
    const duration = 1500
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * num))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [visible, num])

  return <>{display}{value.includes("+") ? "+" : ""}</>
}

function GlobalPresence() {
  const { ref, visible } = useReveal()
  return (
    <section
      id="presence"
      ref={ref}
      className="relative py-28 md:py-40"
      style={{
        background: "hsl(210 20% 98%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="03" title="Global Network" visible={visible} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4" style={{ color: "hsl(220 15% 20%)" }}>
            100+ Partner Companies Worldwide
          </h3>
          <p className="text-lg md:text-xl" style={{ color: "hsl(220 10% 45%)" }}>
            Building trusted relationships across every continent
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.2, ease }}
          className="relative mb-16 p-6 md:p-10 rounded-xl bg-white shadow-lg"
        >
          <WorldMap visible={visible} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, ease }}
              className="p-6 rounded-lg bg-white shadow-sm border border-border"
            >
              <h4 className="font-serif text-xl md:text-2xl font-semibold mb-2" style={{ color: "hsl(28 95% 62%)" }}>
                {o.city}
              </h4>
              <p className="text-sm font-mono mb-1" style={{ color: "hsl(220 10% 45%)" }}>
                {o.status}
              </p>
              <p className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>
                {o.markets} Market Access
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 4. PHILOSOPHY (visually distinct full-width band) ── */
function Philosophy() {
  const { ref, visible } = useReveal()
  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40"
      style={{
        background: "linear-gradient(180deg, transparent 0%, hsl(210 20% 96%) 20%, hsl(210 20% 96%) 80%, transparent 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.2, ease }}
        >
          <p className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.2] tracking-[-0.01em] text-balance">
            Serious risks.
            <br />
            <span className="text-primary">Serious capacity.</span>
            <br />
            Direct execution.
          </p>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.8, delay: 0.4, ease }}
          className="w-16 h-px bg-primary mx-auto mt-12"
        />
      </div>
    </section>
  )
}

/* ── EXPORT ── */
export default function ContentSections() {
  return (
    <div className="relative z-10">
      <NarrativeIntro />
      <Solutions />
      <GlobalPresence />
      <Philosophy />
    </div>
  )
}
