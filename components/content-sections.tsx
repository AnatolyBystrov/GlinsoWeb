"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"

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
      { threshold, rootMargin: "0px 0px -60px 0px" }
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
        background: "linear-gradient(180deg, transparent 0%, hsl(220 12% 12%) 20%, hsl(220 12% 12%) 80%, transparent 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="01" title="Who We Are" visible={visible} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left -- large artistic quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground leading-[1.5] tracking-[-0.005em]">
              Risk lives in complexity.
              <br />
              <span className="text-primary">Certainty lives in us.</span>
            </p>
          </motion.div>

          {/* Right -- body text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="space-y-5"
          >
            <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">
              Glinso is a global reinsurance broker that combines deep market
              intelligence, advanced analytics and sector-specific expertise to
              deliver optimal outcomes for insurers and specialty carriers.
            </p>
            <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">
              We operate as both a strategic adviser and an execution partner,
              structuring resilient programmes across property, casualty,
              specialty and marine lines worldwide.
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
    code: "Re",
    name: "Treaty Reinsurance",
    desc: "Structuring resilient risk transfer programmes across treaty, facultative and specialty lines.",
    color: "hsl(38 65% 58%)",
  },
  {
    code: "Fac",
    name: "Facultative Placement",
    desc: "Tailored single-risk solutions with access to global specialty markets and capacity.",
    color: "hsl(28 60% 55%)",
  },
  {
    code: "Cap",
    name: "Capital Structuring",
    desc: "Connecting risk with global capital markets through ILS, sidecars and alternative transfer.",
    color: "hsl(175 35% 50%)",
  },
  {
    code: "An",
    name: "Analytics & Modelling",
    desc: "Data-driven underwriting, portfolio insights and catastrophe modelling that sharpen decisions.",
    color: "hsl(210 40% 60%)",
  },
  {
    code: "Adv",
    name: "Strategic Advisory",
    desc: "Risk and capital advisory for insurers navigating complex regulatory and market landscapes.",
    color: "hsl(38 45% 52%)",
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
          subtitle="Five interlinked capabilities that create a unified platform for comprehensive risk transfer and advisory."
          visible={visible}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative p-7 md:p-9 border border-border/30 overflow-hidden cursor-default transition-all duration-500"
              style={{
                background: hovered === i
                  ? `linear-gradient(145deg, ${s.color}12 0%, transparent 70%)`
                  : "hsl(220 10% 13%)",
                borderColor: hovered === i ? `${s.color}40` : undefined,
              }}
            >
              {/* Animated top accent line */}
              <div
                className="absolute top-0 left-0 h-[2px] transition-all duration-700"
                style={{
                  width: hovered === i ? "100%" : "0%",
                  backgroundColor: s.color,
                }}
              />

              <div className="flex items-baseline gap-3 mb-5">
                <span
                  className="text-xs font-mono tracking-[0.15em] transition-colors duration-500"
                  style={{ color: hovered === i ? s.color : "hsl(38 65% 58% / 0.6)" }}
                >
                  {s.code}
                </span>
                <div className="flex-1 h-px bg-border/30 group-hover:bg-border/60 transition-colors duration-500" />
              </div>
              <h3
                className="font-serif text-lg md:text-xl font-light mb-3 transition-colors duration-500"
                style={{ color: hovered === i ? s.color : "hsl(40 10% 92%)" }}
              >
                {s.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed group-hover:text-secondary-foreground transition-colors duration-500">
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
  { city: "London", tz: "GMT+0", status: "Headquarters", markets: "50+" },
  { city: "Zurich", tz: "CET+1", status: "European Hub", markets: "30+" },
  { city: "Singapore", tz: "SGT+8", status: "Asia Pacific", markets: "25+" },
  { city: "Dubai", tz: "GST+4", status: "MENA Region", markets: "20+" },
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
        background: "linear-gradient(180deg, transparent 0%, hsl(220 15% 11%) 15%, hsl(220 15% 11%) 85%, transparent 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="03" title="Global Presence" visible={visible} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease }}
              className="group relative p-6 md:p-8 border border-border/20 hover:border-primary/30 transition-all duration-500"
              style={{ background: "hsl(220 10% 12%)" }}
            >
              <span className="font-serif text-2xl md:text-4xl lg:text-5xl font-light tracking-[-0.01em] text-foreground block mb-3 group-hover:text-primary transition-colors duration-500">
                {o.city}
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-primary/70 block mb-1">
                {o.tz}
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground block mb-4">
                {o.status}
              </span>
              {/* Animated market count */}
              <div className="pt-3 border-t border-border/20">
                <span className="font-serif text-2xl md:text-3xl text-primary font-light">
                  <AnimatedNumber value={o.markets} visible={visible} />
                </span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground ml-2">
                  MARKETS
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 4. ESG & GOVERNANCE ── */
const esgItems = [
  {
    letter: "E",
    title: "Environmental",
    text: "Sustainable insurance solutions integrating ESG risk factors into programme design, with focus on climate and catastrophe risk modelling.",
    accent: "hsl(160 40% 45%)",
  },
  {
    letter: "S",
    title: "Social",
    text: "Protecting policyholders and investing in talent development, education in actuarial science, and community resilience programmes.",
    accent: "hsl(210 45% 55%)",
  },
  {
    letter: "G",
    title: "Governance",
    text: "Robust compliance across sanctions, AML, ABAC and KYC. A comprehensive risk management framework underpins every engagement.",
    accent: "hsl(38 55% 55%)",
  },
]

function EsgGovernance() {
  const { ref, visible } = useReveal()
  return (
    <section id="esg" ref={ref} className="relative py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="04" title="ESG & Governance" visible={visible} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {esgItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease }}
              className="group relative p-7 md:p-9 border border-border/20 hover:border-white/10 transition-all duration-500 overflow-hidden"
              style={{ background: "hsl(220 10% 12%)" }}
            >
              {/* Big background letter */}
              <span
                className="absolute -top-4 -right-2 font-serif text-[120px] md:text-[160px] font-light leading-none pointer-events-none transition-opacity duration-700"
                style={{ color: `${item.accent}15` }}
              >
                {item.letter}
              </span>

              <div className="relative z-10">
                <div
                  className="w-8 h-1 mb-6 transition-all duration-500 group-hover:w-12"
                  style={{ backgroundColor: item.accent }}
                />
                <h3
                  className="text-xs font-mono tracking-[0.2em] uppercase mb-4 transition-colors duration-500"
                  style={{ color: item.accent }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 5. PHILOSOPHY (visually distinct full-width band) ── */
function Philosophy() {
  const { ref, visible } = useReveal()
  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40"
      style={{
        background: "linear-gradient(180deg, transparent 0%, hsl(38 20% 10%) 20%, hsl(38 20% 10%) 80%, transparent 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease }}
        >
          <p className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.2] tracking-[-0.01em] text-balance">
            Risk lives in complexity.
            <br />
            <span className="text-primary">Certainty lives in us.</span>
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
      <EsgGovernance />
      <Philosophy />
    </div>
  )
}
