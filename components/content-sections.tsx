"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"

const ease = [0.16, 1, 0.3, 1] as const

/* ── Intersection Observer hook with parallax offset ── */
function useReveal(threshold = 0.12) {
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

/* ── Glass card wrapper ── */
function GlassCard({ children, className = "", delay = 0, visible }: {
  children: React.ReactNode
  className?: string
  delay?: number
  visible: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={`group relative overflow-hidden rounded-sm border border-white/[0.06] ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(232,168,64,0.04) 0%, transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  )
}

/* ── SECTION: WHO WE ARE ── */
function WhoWeAre() {
  const { ref, visible } = useReveal()
  return (
    <section id="who-we-are" ref={ref} className="relative py-28 md:py-40 border-t border-border/10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[11px] font-mono text-primary/30 mb-4 block tracking-[0.2em]"
        >
          01
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight uppercase text-foreground mb-8 leading-[1.05]"
        >
          Who We Are
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="w-16 h-px bg-primary/30 mb-8 origin-left"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl"
        >
          Glinso is a global reinsurance broker that combines deep market
          intelligence, advanced analytics and sector-specific expertise to
          deliver optimal outcomes for insurers and specialty carriers. We
          operate as both a strategic adviser and an execution partner,
          structuring resilient programmes across property, casualty, specialty
          and marine lines worldwide.
        </motion.p>
      </div>
    </section>
  )
}

/* ── SECTION: OUR DIVISIONS ── */
const divisions = [
  {
    name: "Glinso Reinsurance",
    desc: "Structuring resilient risk transfer programmes across treaty, facultative and specialty lines.",
    icon: "Re",
  },
  {
    name: "Glinso Advisory",
    desc: "Strategic risk and capital advisory for insurers navigating complex regulatory and market landscapes.",
    icon: "Ad",
  },
  {
    name: "Glinso Analytics",
    desc: "Data-driven underwriting, portfolio insights and catastrophe modelling that sharpen decision-making.",
    icon: "An",
  },
  {
    name: "Glinso Capital Solutions",
    desc: "Connecting risk with global capital markets through ILS, sidecars and alternative risk transfer structures.",
    icon: "Cs",
  },
]

function OurDivisions() {
  const { ref, visible } = useReveal()
  return (
    <section id="divisions" ref={ref} className="relative py-28 md:py-40 border-t border-border/10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[11px] font-mono text-primary/30 mb-4 block tracking-[0.2em]"
        >
          02
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight uppercase text-foreground mb-4 leading-[1.05]"
        >
          Our Divisions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-sm md:text-base text-muted-foreground mb-14 md:mb-18 max-w-2xl"
        >
          Four interlinked divisions that complement each other, creating a
          unified platform for comprehensive risk transfer and advisory.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {divisions.map((div, i) => (
            <GlassCard
              key={div.name}
              delay={0.3 + i * 0.1}
              visible={visible}
              className="p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-primary/20 text-primary/60 text-[10px] font-mono tracking-wider rounded-sm">
                  {div.icon}
                </span>
                <div>
                  <h3 className="text-xs md:text-sm font-mono tracking-[0.15em] uppercase text-primary/80 mb-2.5 group-hover:text-primary transition-colors duration-500">
                    {div.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {div.desc}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-primary/30 group-hover:w-full transition-all duration-700" />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SECTION: GLOBAL PRESENCE ── */
const cities = [
  { name: "London", tz: "GMT" },
  { name: "Zurich", tz: "CET" },
  { name: "Singapore", tz: "SGT" },
  { name: "Dubai", tz: "GST" },
]

function GlobalPresence() {
  const { ref, visible } = useReveal()
  return (
    <section id="presence" ref={ref} className="relative py-28 md:py-40 border-t border-border/10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[11px] font-mono text-primary/30 mb-4 block tracking-[0.2em]"
        >
          03
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight uppercase text-foreground mb-8 leading-[1.05]"
        >
          Global Presence
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="w-16 h-px bg-primary/30 mb-10 origin-left"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city, i) => (
            <GlassCard
              key={city.name}
              delay={0.3 + i * 0.08}
              visible={visible}
              className="p-5 md:p-6 text-center"
            >
              <span className="text-xl md:text-3xl lg:text-4xl font-sans font-extralight tracking-[0.03em] uppercase text-foreground/80 block mb-1.5">
                {city.name}
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-primary/40">
                {city.tz}
              </span>
            </GlassCard>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="mt-10 text-xs font-mono tracking-[0.15em] text-muted-foreground/40"
        >
          Serving global reinsurance and insurance markets across all continents.
        </motion.p>
      </div>
    </section>
  )
}

/* ── SECTION: ESG & GOVERNANCE ── */
const esgColumns = [
  {
    title: "Environmental",
    text: "Sustainable insurance solutions with a focus on climate and catastrophe risk modelling. We integrate ESG risk factors into programme design and underwriting analysis.",
  },
  {
    title: "Social",
    text: "Protecting policyholders and supporting education in insurance and actuarial science. We invest in talent development and community resilience programmes.",
  },
  {
    title: "Governance",
    text: "Strict compliance across sanctions, AML, ABAC and KYC. A robust risk management framework underpins every client engagement and internal process.",
  },
]

function EsgGovernance() {
  const { ref, visible } = useReveal()
  return (
    <section id="esg" ref={ref} className="relative py-28 md:py-40 border-t border-border/10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[11px] font-mono text-primary/30 mb-4 block tracking-[0.2em]"
        >
          04
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight uppercase text-foreground mb-14 md:mb-18 leading-[1.05]"
        >
          {"ESG & Governance"}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {esgColumns.map((col, i) => (
            <GlassCard
              key={col.title}
              delay={0.2 + i * 0.12}
              visible={visible}
              className="p-6 md:p-8"
            >
              <div className="w-8 h-px bg-primary/30 mb-5" />
              <h3 className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-primary/80 mb-4 group-hover:text-primary transition-colors duration-500">
                {col.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {col.text}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SECTION: CSR / COMMUNITY ── */
const csrBlocks = [
  {
    title: "Empowering Education in Risk & Insurance",
    text: "Supporting academic programmes, scholarships and professional development in actuarial science and risk management.",
  },
  {
    title: "Supporting Communities and Resilience",
    text: "Partnering with organisations focused on disaster preparedness, financial literacy and community recovery.",
  },
  {
    title: "Advancing Diversity in (Re)Insurance Leadership",
    text: "Championing inclusive leadership and equitable opportunity across the global reinsurance industry.",
  },
]

function CsrCommunity() {
  const { ref, visible } = useReveal()
  return (
    <section id="csr" ref={ref} className="relative py-28 md:py-40 border-t border-border/10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[11px] font-mono text-primary/30 mb-4 block tracking-[0.2em]"
        >
          05
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight tracking-tight uppercase text-foreground mb-14 md:mb-18 leading-[1.05]"
        >
          Community
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {csrBlocks.map((block, i) => (
            <GlassCard
              key={block.title}
              delay={0.2 + i * 0.12}
              visible={visible}
              className="p-6 md:p-8"
            >
              <div className="w-8 h-px bg-primary/30 group-hover:w-16 transition-all duration-500 mb-5" />
              <h3 className="text-xs md:text-sm font-mono tracking-[0.12em] uppercase text-foreground/80 mb-3 leading-relaxed group-hover:text-primary/90 transition-colors duration-500">
                {block.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {block.text}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── EXPORT ── */
export default function ContentSections() {
  return (
    <div className="relative z-10">
      <WhoWeAre />
      <OurDivisions />
      <GlobalPresence />
      <EsgGovernance />
      <CsrCommunity />
    </div>
  )
}
