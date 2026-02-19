"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const ease = [0.16, 1, 0.3, 1] as const

const timeline = [
  {
    year: "2015",
    title: "Foundation in London",
    text: "Glinso was founded by a team of Lloyd's market veterans who saw an opportunity to build a new kind of reinsurance broker — one that combined deep technical expertise with client-first thinking.",
  },
  {
    year: "2017",
    title: "Dubai Expansion",
    text: "Opened our MENA headquarters in Dubai International Financial Centre (DIFC), establishing a strategic foothold in one of the world's fastest-growing insurance markets. Our Dubai team focuses on Takaful, energy and construction risks across the Middle East and North Africa.",
  },
  {
    year: "2019",
    title: "Asia Pacific Launch",
    text: "Expanded to Singapore to serve the region's booming specialty and marine markets. Built partnerships with major Asian carriers and alternative capital providers.",
  },
  {
    year: "2021",
    title: "Capital Markets Capability",
    text: "Launched dedicated ILS and alternative capital platform in Zurich, connecting traditional reinsurance with pension funds, hedge funds and other institutional investors seeking insurance-linked returns.",
  },
  {
    year: "2023",
    title: "Analytics & Technology",
    text: "Invested heavily in proprietary catastrophe modelling and portfolio analytics, building in-house capabilities that rival the major vendors. Today we deliver data-driven underwriting insights that materially improve client outcomes.",
  },
  {
    year: "2026",
    title: "Global Platform",
    text: "Operating across four continents with 200+ professionals. Placing $3B+ in annual premium and advising on complex programmes for Fortune 500 companies and leading specialty carriers worldwide.",
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
              Our story
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 leading-[1.05]">
              A decade engineering certainty
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed">
              From a single London office to a global platform spanning four continents, Glinso has grown by staying true to one principle: <span className="text-primary">certainty lives in expertise, discipline and client obsession.</span>
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
              Insurance is about promises made in the present that must be kept in the future. <span className="text-primary">We exist to make those promises bankable.</span>
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

          {/* Dubai highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
            className="mt-28 p-10 md:p-14 border border-primary/20"
            style={{ background: "linear-gradient(135deg, hsl(38 30% 8%) 0%, hsl(220 12% 10%) 100%)" }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-4">Dubai</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              A strategic gateway to the MENA region
            </h2>
            <p className="text-base text-secondary-foreground leading-relaxed mb-6">
              Our Dubai office sits at the heart of the region's insurance ecosystem in DIFC. From here we serve clients across the UAE, Saudi Arabia, Egypt, Qatar and beyond — structuring programmes for energy risks in the Gulf, construction megaprojects, and the region's fast-growing Takaful sector.
            </p>
            <p className="text-base text-secondary-foreground leading-relaxed">
              Led by Managing Director Sophia Al-Mansoori, the team combines local market knowledge with global reinsurance connectivity, delivering solutions that respect cultural nuances while accessing the full depth of international capacity.
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
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12">What drives us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Expertise", text: "Deep technical knowledge in underwriting, actuarial science and market dynamics." },
                { title: "Discipline", text: "Rigorous process, robust governance and relentless attention to detail in every placement." },
                { title: "Partnership", text: "Long-term client relationships built on trust, transparency and shared success." },
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
