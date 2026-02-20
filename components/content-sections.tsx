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
      className="relative py-28 md:py-40"
      style={{
        background: "hsl(210 20% 98%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader
          index="04"
          title="Our Story"
          subtitle="From vision to execution — building a focused, technically strong brokerage platform."
          visible={visible}
        />

        <div className="space-y-12 md:space-y-16">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.2, delay: i * 0.1, ease }}
              className="flex flex-col md:flex-row gap-6 md:gap-12"
            >
              <div className="md:w-32 flex-shrink-0">
                <div className="text-4xl md:text-5xl font-serif font-light text-primary">
                  {item.year}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-4 text-foreground">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-secondary-foreground leading-relaxed">
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
      className="relative py-28 md:py-40"
      style={{
        background: "linear-gradient(180deg, transparent 0%, hsl(210 20% 95%) 20%, hsl(210 20% 95%) 80%, transparent 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader
          index="05"
          title="Leadership Team"
          subtitle="Strategic expertise driving technical excellence and market execution."
          visible={visible}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadership.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, delay: i * 0.1, ease }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border"
            >
              <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-2 text-foreground">
                {member.name}
              </h3>
              <p className="text-sm font-mono tracking-wider text-primary uppercase mb-1">
                {member.role}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {member.location}
              </p>
              <p className="text-base text-secondary-foreground leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
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
      className="relative py-28 md:py-40"
      style={{
        background: "hsl(210 20% 98%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader
          index="06"
          title="Contact Us"
          subtitle="Let's discuss how we can support your reinsurance requirements."
          visible={visible}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2, ease }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-foreground">Email</h3>
              <a href="mailto:team@glinso.ae" className="text-primary hover:underline text-lg">
                team@glinso.ae
              </a>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-foreground">Headquarters</h3>
              <p className="text-secondary-foreground">
                GLINSO Brokers FZE<br />
                Ras Al Khaimah<br />
                United Arab Emirates
              </p>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-foreground">Representative Office</h3>
              <p className="text-secondary-foreground">
                Dubai<br />
                United Arab Emirates
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2, ease }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2 text-foreground">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-300"
            >
              Send Message
            </button>
          </motion.form>
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
