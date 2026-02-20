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

/* ── 4. STORY ── */
const timeline = [
  {
    year: "2009",
    title: "The Vision",
    text: "On 2 July 2009, the concept behind GLINSO was first developed with the vision of building a focused, technically strong brokerage platform operating across international markets.",
  },
  {
    year: "2010",
    title: "First License",
    text: "The first brokerage license was granted on 5 July 2010, marking the official beginning of GLINSO's journey as an independent insurance and reinsurance brokerage.",
  },
  {
    year: "2018",
    title: "Strategic Relocation",
    text: "On 27 November 2018, operations were strategically relocated to the United Arab Emirates, where GLINSO Brokers FZE was established in Ras Al Khaimah.",
  },
  {
    year: "2026",
    title: "Long-Term Commitment",
    text: "A new Ras Al Khaimah license was granted on 29 January 2026, valid until 28 January 2031, reinforcing the company's long-term commitment to regulatory compliance and sustainable growth in the region.",
  },
]

function Story() {
  const { ref, visible } = useReveal()
  return (
    <section
      id="story"
      ref={ref}
      className="relative py-28 md:py-40 bg-background"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease }}
          className="mb-20 md:mb-28"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-6">
            About GLINSO
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 leading-[1.05]">
            Independent insurance excellence
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
            GLINSO Brokers FZE is an independent insurance and reinsurance brokerage headquartered in Ras Al Khaimah, United Arab Emirates. <span className="text-primary">Founded in 2009, we combine disciplined risk assessment, global market access, and direct decision-making to deliver efficient placement solutions for insurers, reinsurers, and corporate clients.</span>
          </p>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, ease }}
          className="mb-24 py-16 border-y border-border/20"
        >
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-[1.3] tracking-[-0.01em] text-balance">
            We act for insurers, reinsurers, MGAs, and corporate clients, delivering structured placement solutions and strategic market access. <span className="text-primary">Our focus is long-term partnerships, not transactional placements.</span>
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-16">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.2, ease }}
              className="relative pl-20 pb-12 border-l-2 border-border/20 last:border-l-0"
            >
              {/* Year badge */}
              <div className="absolute left-0 top-0 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-primary/40 bg-background flex items-center justify-center">
                <span className="text-[10px] font-mono tracking-wider text-primary">{item.year}</span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-4">{item.title}</h3>
              <p className="text-sm md:text-base text-secondary-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* RAK highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease }}
          className="mt-28 p-10 md:p-14 border border-primary/20 bg-white shadow-lg rounded-lg"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-4">Ras Al Khaimah</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
            Headquartered in the UAE
          </h2>
          <p className="text-base text-secondary-foreground leading-relaxed mb-6">
            GLINSO Brokers FZE is headquartered in Ras Al Khaimah, United Arab Emirates. Our headquarters serves as the central hub for treaty structuring, facultative placements, and international market coordination.
          </p>
          <p className="text-base text-secondary-foreground leading-relaxed">
            Our current license was granted on 29 January 2026 and is valid until 28 January 2031, reinforcing our long-term commitment to regulatory compliance and sustainable growth in the region. We operate under a regulated framework aligned with international standards.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease }}
          className="mt-28"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12">Our approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Technical Clarity", text: "Every placement begins with disciplined analysis and structured underwriting presentation." },
              { title: "Direct Market Access", text: "We work directly with decision-makers in regional and international markets to secure optimal terms." },
              { title: "Execution Without Noise", text: "We prioritize efficiency, transparency, and results over unnecessary layers." },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.2, ease }}
              >
                <h3 className="text-sm font-mono tracking-wider uppercase text-primary mb-3">{value.title}</h3>
                <p className="text-sm text-secondary-foreground leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="mt-24 text-center"
        >
          <p className="font-serif text-xl md:text-2xl text-foreground/80 mb-8">Ready to work together?</p>
          <a
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) {
                const headerOffset = 100
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
              }
            }}
            className="inline-block px-12 py-4 border border-primary/30 text-xs font-mono tracking-[0.2em] uppercase text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-500 cursor-pointer"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ── 5. TEAM ── */
const leadership = [
  {
    name: "Svetlana Lisunova",
    role: "Chief Financial Officer",
    location: "Ras Al Khaimah",
    bio: "Responsible for financial operations, regulatory compliance, and corporate governance. Ensures operational efficiency and financial transparency.",
  },
  {
    name: "Veronica Bystrova",
    role: "Treaty Broker",
    location: "Dubai",
    bio: "Specialist in treaty reinsurance structuring and placement. Manages complex reinsurance programmes across property, casualty, and specialty lines.",
  },
]

function Team() {
  const { ref, visible } = useReveal()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="team"
      ref={ref}
      className="relative py-28 md:py-40 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease }}
          className="mb-20 md:mb-28"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-6">
            Leadership
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 leading-[1.05] max-w-4xl">
            Leadership team driving technical excellence
          </h1>
          <p className="text-base text-secondary-foreground leading-relaxed max-w-2xl">
            Our team combines deep market knowledge, technical expertise, and disciplined execution in reinsurance placement and risk structuring.
          </p>
        </motion.div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {leadership.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, ease }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative p-8 bg-white border border-border/20 hover:border-primary/30 hover:shadow-md transition-all duration-500"
            >
              <div className="mb-5">
                <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2 group-hover:text-primary transition-colors duration-500">
                  {member.name}
                </h3>
                <p className="text-xs font-mono tracking-wider uppercase text-primary/70 mb-1">{member.role}</p>
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground">{member.location}</p>
              </div>
              <div className="w-12 h-px bg-primary/30 mb-5 group-hover:w-20 transition-all duration-500" />
              <p className="text-sm text-secondary-foreground leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, ease }}
          className="mt-24 text-center"
        >
          <a
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) {
                const headerOffset = 100
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
              }
            }}
            className="inline-block px-12 py-4 border border-primary/30 text-xs font-mono tracking-[0.2em] uppercase text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-500 cursor-pointer"
          >
            Work with us
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ── 6. CONTACT ── */
function Contact() {
  const { ref, visible } = useReveal()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contact from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nService: ${formData.service}\n\nMessage:\n${formData.message}`
    )
    window.location.href = `mailto:team@glinso.ae?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-28 md:py-40 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2, ease }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-6">
              Get in touch
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 leading-[1.05]">
              Let's discuss your placement requirements
            </h1>
            <p className="text-base text-secondary-foreground leading-relaxed mb-12">
              For partnership inquiries, placement submissions, or strategic discussions, please contact us directly through our main office. <span className="text-primary">Serious risks. Serious capacity. Direct execution.</span>
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-3">Headquarters – Ras Al Khaimah</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  GLINSO Brokers FZE<br />
                  Ras Al Khaimah<br />
                  United Arab Emirates
                </p>
                <p className="text-xs text-muted-foreground/80 mt-2 italic">
                  Central hub for treaty structuring, facultative placements, and international market coordination.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-3">Representative Office – Dubai</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  GLINSO Brokers – Dubai Representative Office<br />
                  5, Building 2, Madison Astor<br />
                  Majan, Wadi Al Safa 3<br />
                  Dubai, United Arab Emirates
                </p>
                <p className="text-xs text-muted-foreground/80 mt-2 italic">
                  Supporting regional client engagement.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-3">Contact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  team@glinso.ae
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="+44 20 ..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                  Service Interest
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="treaty">Treaty Reinsurance</option>
                  <option value="facultative">Facultative Placement</option>
                  <option value="capital">Capital Structuring</option>
                  <option value="analytics">Analytics & Modelling</option>
                  <option value="advisory">Strategic Advisory</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full bg-primary text-primary-foreground font-mono text-xs tracking-[0.2em] uppercase py-4 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all duration-300 relative overflow-hidden group"
              >
                {status === "idle" && "Send Message"}
                {status === "submitting" && "Sending..."}
                {status === "success" && "Message Sent ✓"}
                {status === "error" && "Try Again"}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-primary text-center"
              >
                Thank you. We'll be in touch within 24 hours.
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 7. PHILOSOPHY (visually distinct full-width band) ── */
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
      <Story />
      <Team />
      <Contact />
      <Philosophy />
    </div>
  )
}
