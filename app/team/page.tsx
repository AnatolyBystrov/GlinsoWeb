"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import SubPageHeader from "@/components/sub-page-header"

const ease = [0.16, 1, 0.3, 1] as const

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


export default function TeamPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <main className="relative min-h-screen bg-background">
      {/* Header */}
      <SubPageHeader links={[
        { href: "/#who-we-are", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/story", label: "Story" },
      ]} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
            {leadership.map((member, i) => {
              const isHovered = hoveredIndex === i

              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative overflow-hidden rounded-2xl border border-border/20"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.98) 100%)",
                    boxShadow: isHovered
                      ? "0 18px 42px -22px rgba(15,23,42,0.28)"
                      : "0 12px 28px -20px rgba(15,23,42,0.18)",
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 14% 14%, rgba(130,201,216,0.16) 0%, transparent 42%), radial-gradient(circle at 88% 18%, rgba(255,170,90,0.14) 0%, transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.94) 100%)",
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

                  <div className="relative p-8">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2 group-hover:text-primary transition-colors duration-500">
                          {member.name}
                        </h3>
                        <p className="text-xs font-mono tracking-wider uppercase text-primary/70 mb-1">{member.role}</p>
                        <p className="text-[10px] font-mono tracking-wider text-muted-foreground">{member.location}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="h-2 w-2 rounded-full bg-[hsl(192_45%_55%)]" />
                        <span className="h-2 w-2 rounded-full bg-[hsl(28_95%_62%)]" />
                      </div>
                    </div>
                    <div className="w-12 h-px bg-gradient-to-r from-[hsl(192_45%_55%/.6)] to-[hsl(28_95%_62%/.55)] mb-5 group-hover:w-20 transition-all duration-500" />
                    <p className="text-sm text-secondary-foreground leading-relaxed">{member.bio}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, ease }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <Link
              href="/contact"
              prefetch={true}
              className="inline-flex items-center justify-center px-12 py-4 bg-primary text-primary-foreground font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Work with us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
