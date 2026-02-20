"use client"

import { motion } from "framer-motion"
import Link from "next/link"

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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg font-light tracking-[0.05em] text-foreground hover:text-primary transition-colors">
            Glinso
          </Link>
          <nav className="flex gap-8">
            <Link href="/#who-we-are" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/team" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              Team
            </Link>
            <Link href="/contact" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
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
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2, ease }}
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
                transition={{ duration: 0.9, delay: i * 0.05, ease }}
                viewport={{ once: true }}
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
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
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
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
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
              className="inline-block px-12 py-4 border border-primary/30 text-xs font-mono tracking-[0.2em] uppercase text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-500"
            >
              Get in touch
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
