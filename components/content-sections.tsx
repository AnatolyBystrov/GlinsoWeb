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
      { threshold, rootMargin: "0px 0px -80px 0px" }
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
    <div className="mb-12 md:mb-20">
      <motion.span
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
        className="text-[10px] font-mono text-primary/25 mb-5 block tracking-[0.3em]"
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
          className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.2, ease }}
        className="w-12 md:w-16 h-px bg-primary/25 mt-6 origin-left"
      />
    </div>
  )
}

/* ── Glass card ── */
function GlassCard({
  children,
  className = "",
  delay = 0,
  visible,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  visible: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease }}
      className={`group relative overflow-hidden border border-white/[0.04] ${className}`}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Hover light sweep */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(190,165,120,0.04) 0%, transparent 50%)",
        }}
      />
      {children}
    </motion.div>
  )
}

/* ── 1. NARRATIVE INTRODUCTION ── */
function NarrativeIntro() {
  const { ref, visible } = useReveal()
  return (
    <section id="who-we-are" ref={ref} className="relative py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="01" title="Who We Are" visible={visible} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left -- large artistic typography */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground/80 leading-[1.5] tracking-[-0.005em]">
              Risk lives in complexity.
              <br />
              <span className="text-primary/60">Certainty lives in us.</span>
            </p>
          </motion.div>

          {/* Right -- body text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="space-y-5"
          >
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Glinso is a global reinsurance broker that combines deep market
              intelligence, advanced analytics and sector-specific expertise to
              deliver optimal outcomes for insurers and specialty carriers.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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

/* ── 2. SOLUTIONS (SCULPTURAL GRID) ── */
const services = [
  {
    code: "Re",
    name: "Treaty Reinsurance",
    desc: "Structuring resilient risk transfer programmes across treaty, facultative and specialty lines.",
  },
  {
    code: "Fac",
    name: "Facultative Placement",
    desc: "Tailored single-risk solutions with access to global specialty markets and capacity.",
  },
  {
    code: "Cap",
    name: "Capital Structuring",
    desc: "Connecting risk with global capital markets through ILS, sidecars and alternative transfer.",
  },
  {
    code: "An",
    name: "Analytics & Modelling",
    desc: "Data-driven underwriting, portfolio insights and catastrophe modelling that sharpen decisions.",
  },
  {
    code: "Adv",
    name: "Strategic Advisory",
    desc: "Risk and capital advisory for insurers navigating complex regulatory and market landscapes.",
  },
]

function Solutions() {
  const { ref, visible } = useReveal()
  return (
    <section id="solutions" ref={ref} className="relative py-32 md:py-48 border-t border-border/10">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader
          index="02"
          title="Solutions"
          subtitle="Five interlinked capabilities that create a unified platform for comprehensive risk transfer and advisory."
          visible={visible}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.03]">
          {services.map((s, i) => (
            <GlassCard
              key={s.name}
              delay={0.2 + i * 0.08}
              visible={visible}
              className="p-7 md:p-9"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-primary/40">
                  {s.code}
                </span>
                <div className="flex-1 h-px bg-border/20" />
              </div>
              <h3 className="font-serif text-lg md:text-xl font-light text-foreground/85 mb-3 group-hover:text-foreground transition-colors duration-500">
                {s.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-primary/20 group-hover:w-full transition-all duration-700" />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 3. GLOBAL PRESENCE ── */
const offices = [
  { city: "London", tz: "GMT", status: "Headquarters" },
  { city: "Zurich", tz: "CET", status: "European Hub" },
  { city: "Singapore", tz: "SGT", status: "Asia Pacific" },
  { city: "Dubai", tz: "GST", status: "MENA Region" },
]

function GlobalPresence() {
  const { ref, visible } = useReveal()
  return (
    <section id="presence" ref={ref} className="relative py-32 md:py-48 border-t border-border/10">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="03" title="Global Presence" visible={visible} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
          {offices.map((o, i) => (
            <GlassCard
              key={o.city}
              delay={0.25 + i * 0.1}
              visible={visible}
              className="p-6 md:p-8"
            >
              <span className="font-serif text-2xl md:text-4xl lg:text-5xl font-light tracking-[-0.01em] text-foreground/75 block mb-2">
                {o.city}
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-primary/35 block mb-1">
                {o.tz}
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground/30">
                {o.status}
              </span>
            </GlassCard>
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
  },
  {
    letter: "S",
    title: "Social",
    text: "Protecting policyholders and investing in talent development, education in actuarial science, and community resilience programmes.",
  },
  {
    letter: "G",
    title: "Governance",
    text: "Robust compliance across sanctions, AML, ABAC and KYC. A comprehensive risk management framework underpins every engagement.",
  },
]

function EsgGovernance() {
  const { ref, visible } = useReveal()
  return (
    <section id="esg" ref={ref} className="relative py-32 md:py-48 border-t border-border/10">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader index="04" title="ESG & Governance" visible={visible} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
          {esgItems.map((item, i) => (
            <GlassCard
              key={item.title}
              delay={0.2 + i * 0.12}
              visible={visible}
              className="p-7 md:p-9"
            >
              <span className="font-serif text-5xl md:text-6xl font-light text-primary/15 block mb-4 leading-none">
                {item.letter}
              </span>
              <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary/60 mb-4 group-hover:text-primary/80 transition-colors duration-500">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.text}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 5. PHILOSOPHY ── */
function Philosophy() {
  const { ref, visible } = useReveal()
  return (
    <section ref={ref} className="relative py-32 md:py-48 border-t border-border/10">
      <div className="max-w-4xl mx-auto px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease }}
        >
          <p className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-foreground/80 leading-[1.2] tracking-[-0.01em] text-balance">
            Risk lives in complexity.
            <br />
            <span className="text-primary/50">Certainty lives in us.</span>
          </p>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.8, delay: 0.4, ease }}
          className="w-16 h-px bg-primary/20 mx-auto mt-12"
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
