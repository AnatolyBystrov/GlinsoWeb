"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" prefetch={true} className="font-serif text-lg font-light tracking-[0.05em] text-foreground hover:text-primary transition-colors">
            Glinso
          </Link>
          <nav className="flex gap-8">
            <Link href="/#who-we-are" prefetch={true} className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" prefetch={true} className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/story" prefetch={true} className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
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
                animate={{ opacity: 1, y: 0 }}
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
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, ease }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <Link
              href="/contact"
              prefetch={true}
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
