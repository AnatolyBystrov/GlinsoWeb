"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import SubPageHeader from "@/components/sub-page-header"

const ease = [0.16, 1, 0.3, 1] as const

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

export default function StoryPage() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Header */}
      <SubPageHeader links={[
        { href: "/#who-we-are", label: "About" },
        { href: "/team", label: "Team" },
        { href: "/contact", label: "Contact" },
      ]} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease }}
            className="mb-20 md:mb-28"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-6">
              About GLINSO
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.015em] text-foreground mb-8 leading-[1.05]">
              Independent insurance excellence
            </h1>
            <p className="font-serif text-xl md:text-2xl text-foreground/82 leading-[1.45] tracking-[-0.01em] max-w-3xl text-balance">
              GLINSO was developed in 2009 as a focused brokerage platform built around technical execution and disciplined market access. <span className="text-primary">The timeline below highlights the key milestones in our licensing history, strategic relocation to the UAE, and long-term regulatory commitment in Ras Al Khaimah.</span>
            </p>
          </motion.div>

          {/* Philosophy */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, ease }}
            viewport={{ once: true }}
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
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease }}
                viewport={{ once: true }}
                className="relative grid grid-cols-[28px_1fr] md:grid-cols-[34px_1fr] gap-4 md:gap-5"
              >
                <div className="relative flex justify-center">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-1/2 top-4 bottom-[-2.7rem] -translate-x-1/2 w-px bg-border/70" />
                  )}
                  <div className="relative mt-2">
                    <div className="absolute inset-0 rounded-full bg-primary/12 blur-sm scale-150" />
                    <div className="relative w-3 h-3 rounded-full bg-primary ring-3 ring-primary/12 border border-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.45)]" />
                  </div>
                </div>

                <div className="pb-2">
                  <div className="relative overflow-hidden rounded-2xl border border-border/20 bg-white/95 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.22)]">
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 14% 14%, rgba(130,201,216,0.12) 0%, transparent 42%), radial-gradient(circle at 88% 18%, rgba(255,170,90,0.12) 0%, transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(248,250,252,0.94) 100%)",
                      }}
                    />
                    <div className="relative p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center rounded-full border border-primary/25 bg-white/80 px-3 py-1 text-[10px] font-mono tracking-[0.18em] text-primary shadow-[0_8px_18px_-14px_rgba(15,23,42,0.35)]">
                          {item.year}
                        </span>
                        <div className="h-px flex-1 bg-border/40" />
                      </div>

                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground leading-tight tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                      <div className="w-10 h-px bg-primary/35 mb-4" />
                      <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RAK highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
            className="group relative mt-28 overflow-hidden rounded-2xl border border-border/20"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.98) 100%)",
              boxShadow: "0 18px 42px -22px rgba(15,23,42,0.22)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 14% 14%, rgba(130,201,216,0.16) 0%, transparent 42%), radial-gradient(circle at 88% 18%, rgba(255,170,90,0.14) 0%, transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(248,250,252,0.94) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-55"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(130,201,216,0.14) 1px, transparent 0)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

            <div className="relative p-10 md:p-14">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block">
                  Ras Al Khaimah
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[hsl(192_45%_55%)]" />
                  <span className="h-2 w-2 rounded-full bg-[hsl(28_95%_62%)]" />
                </div>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight tracking-tight">
                Headquartered in the UAE
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[hsl(192_45%_55%/.6)] to-[hsl(28_95%_62%/.55)] mb-6 group-hover:w-24 transition-all duration-500" />
              <p className="text-base text-secondary-foreground leading-relaxed mb-6">
                GLINSO Brokers FZE is headquartered in Ras Al Khaimah, United Arab Emirates. Our headquarters serves as the central hub for treaty structuring, facultative placements, and international market coordination.
              </p>
              <p className="text-base text-secondary-foreground leading-relaxed">
                Our current license was granted on 29 January 2026 and is valid until 28 January 2031, reinforcing our long-term commitment to regulatory compliance and sustainable growth in the region. We operate under a regulated framework aligned with international standards.
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
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
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease }}
                  viewport={{ once: true }}
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
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <p className="font-serif text-xl md:text-2xl text-foreground/80 mb-8">Ready to work together?</p>
            <Link
              href="/contact"
              prefetch={true}
              className="inline-flex items-center justify-center px-12 py-4 bg-primary text-primary-foreground font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Get in touch</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
