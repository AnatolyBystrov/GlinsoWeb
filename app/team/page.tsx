"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const ease = [0.16, 1, 0.3, 1] as const

const leadership = [
  {
    name: "James Richardson",
    role: "Chief Executive Officer",
    location: "London",
    bio: "25+ years in reinsurance markets. Previously Global Head of Treaty at Lloyd's syndicate. Led $2B+ in annual placements.",
  },
  {
    name: "Sophia Al-Mansoori",
    role: "Managing Director, MENA",
    location: "Dubai",
    bio: "15 years structuring complex risk programmes across Middle East and Africa. Expert in Takaful and Islamic finance solutions.",
  },
  {
    name: "David Chen",
    role: "Chief Analytics Officer",
    location: "Singapore",
    bio: "Former catastrophe modelling lead at RMS. PhD in Applied Mathematics. Built proprietary risk assessment frameworks.",
  },
  {
    name: "Elena Müller",
    role: "Head of Capital Markets",
    location: "Zurich",
    bio: "20 years in ILS and alternative capital. Structured $500M+ in catastrophe bonds and collateralized reinsurance.",
  },
]

const advisors = [
  { name: "Sir Michael Thompson", title: "Senior Advisor", expertise: "Regulatory & Compliance" },
  { name: "Dr. Yuki Tanaka", title: "Technical Advisor", expertise: "Catastrophe Modelling" },
  { name: "Fatima Hassan", title: "Regional Advisor", expertise: "MENA Markets" },
]

export default function TeamPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <main className="relative min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg font-light tracking-[0.05em] text-foreground hover:text-primary transition-colors">
            Glinso
          </Link>
          <nav className="flex gap-8">
            <Link href="/#who-we-are" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/story" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              Story
            </Link>
          </nav>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="mb-20 md:mb-28"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-6">
              Leadership
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 leading-[1.05] max-w-4xl">
              Experienced professionals delivering global certainty
            </h1>
            <p className="text-base text-secondary-foreground leading-relaxed max-w-2xl">
              Our team combines deep market knowledge, technical expertise and client-first thinking across every continent.
            </p>
          </motion.div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {leadership.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative p-8 border border-border/20 hover:border-primary/30 transition-all duration-500"
                style={{
                  background: hoveredIndex === i ? "hsl(220 12% 13%)" : "hsl(220 10% 12%)",
                }}
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

          {/* Advisory Board */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
            className="border-t border-border/20 pt-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12">Advisory Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advisors.map((advisor, i) => (
                <motion.div
                  key={advisor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                  viewport={{ once: true }}
                  className="pb-6 border-b border-border/10"
                >
                  <h3 className="text-lg font-serif font-light text-foreground mb-2">{advisor.name}</h3>
                  <p className="text-xs font-mono tracking-wider uppercase text-primary/70 mb-1">{advisor.title}</p>
                  <p className="text-xs text-muted-foreground">{advisor.expertise}</p>
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
            <Link
              href="/contact"
              className="inline-block px-12 py-4 border border-primary/30 text-xs font-mono tracking-[0.2em] uppercase text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-500"
            >
              Work with us
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
