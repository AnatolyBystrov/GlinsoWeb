"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"

const ease = [0.16, 1, 0.3, 1] as const

/* ── Intersection Observer hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── SECTION: WHO WE ARE ── */
function WhoWeAre() {
  const { ref, visible } = useReveal()
  return (
    <section id="who-we-are" ref={ref} className="py-24 md:py-36 border-t border-border/15">
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
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="text-2xl md:text-4xl lg:text-5xl font-sans font-extralight tracking-tight uppercase text-foreground mb-8 leading-[1.1]"
        >
          Who We Are
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="w-16 h-px bg-primary/30 mb-8 origin-left"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease }}
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
  },
  {
    name: "Glinso Advisory",
    desc: "Strategic risk and capital advisory for insurers navigating complex regulatory and market landscapes.",
  },
  {
    name: "Glinso Analytics",
    desc: "Data-driven underwriting, portfolio insights and catastrophe modelling that sharpen decision-making.",
  },
  {
    name: "Glinso Capital Solutions",
    desc: "Connecting risk with global capital markets through ILS, sidecars and alternative risk transfer structures.",
  },
]

function OurDivisions() {
  const { ref, visible } = useReveal()
  return (
    <section id="divisions" ref={ref} className="py-24 md:py-36 border-t border-border/15">
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
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="text-2xl md:text-4xl lg:text-5xl font-sans font-extralight tracking-tight uppercase text-foreground mb-4 leading-[1.1]"
        >
          Our Divisions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-sm md:text-base text-muted-foreground mb-12 md:mb-16 max-w-2xl"
        >
          Four interlinked divisions that complement each other, creating a
          unified platform for comprehensive risk transfer and advisory.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {divisions.map((div, i) => (
            <motion.div
              key={div.name}
              initial={{ opacity: 0, y: 25 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease }}
              className="group relative p-6 md:p-8 border border-border/20 hover:border-primary/20 transition-colors duration-500"
            >
              <div className="absolute top-0 left-0 w-8 h-px bg-primary/30 group-hover:w-full transition-all duration-700" />
              <h3 className="text-xs md:text-sm font-mono tracking-[0.15em] uppercase text-primary mb-3">
                {div.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {div.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SECTION: GLOBAL PRESENCE ── */
const cities = ["London", "Zurich", "Singapore", "Dubai"]

function GlobalPresence() {
  const { ref, visible } = useReveal()
  return (
    <section id="presence" ref={ref} className="py-24 md:py-36 border-t border-border/15">
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
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="text-2xl md:text-4xl lg:text-5xl font-sans font-extralight tracking-tight uppercase text-foreground mb-8 leading-[1.1]"
        >
          Global Presence
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="w-16 h-px bg-primary/30 mb-8 origin-left"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-12"
        >
          Glinso maintains a strategic presence in the world{"'"}s major reinsurance
          and financial hubs, ensuring proximity to markets and clients across
          every time zone.
        </motion.p>

        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          {cities.map((city, i) => (
            <motion.span
              key={city}
              initial={{ opacity: 0, y: 15 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease }}
              className="text-lg md:text-2xl lg:text-3xl font-sans font-extralight tracking-[0.05em] uppercase text-foreground/60"
            >
              {city}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="mt-8 text-xs font-mono tracking-[0.15em] text-muted-foreground/50"
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
    <section id="esg" ref={ref} className="py-24 md:py-36 border-t border-border/15">
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
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="text-2xl md:text-4xl lg:text-5xl font-sans font-extralight tracking-tight uppercase text-foreground mb-12 md:mb-16 leading-[1.1]"
        >
          {"ESG & Governance"}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {esgColumns.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 25 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease }}
            >
              <div className="w-8 h-px bg-primary/30 mb-5" />
              <h3 className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-primary mb-4">
                {col.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {col.text}
              </p>
            </motion.div>
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
    <section id="csr" ref={ref} className="py-24 md:py-36 border-t border-border/15">
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
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="text-2xl md:text-4xl lg:text-5xl font-sans font-extralight tracking-tight uppercase text-foreground mb-12 md:mb-16 leading-[1.1]"
        >
          Community
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {csrBlocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 25 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease }}
              className="group"
            >
              <div className="w-8 h-px bg-primary/30 group-hover:w-16 transition-all duration-500 mb-5" />
              <h3 className="text-xs md:text-sm font-mono tracking-[0.12em] uppercase text-foreground/80 mb-3 leading-relaxed">
                {block.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {block.text}
              </p>
            </motion.div>
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
