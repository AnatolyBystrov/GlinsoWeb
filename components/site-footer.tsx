"use client"

import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as const

const offices = [
  { city: "London", address: "30 St Mary Axe", detail: "London EC3A 8BF", country: "United Kingdom" },
  { city: "Zurich", address: "Bahnhofstrasse 42", detail: "8001 Zurich", country: "Switzerland" },
  { city: "Singapore", address: "One Raffles Place", detail: "Tower 2, #20-01", country: "Singapore" },
  { city: "Dubai", address: "DIFC Gate Village", detail: "Building 3, Level 5", country: "UAE" },
]

export default function SiteFooter() {
  return (
    <footer id="contact" className="relative z-10 border-t border-border/30">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-24 md:py-32">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <span className="font-serif text-lg md:text-xl font-light tracking-[0.05em] text-foreground/80 block mb-3">
            Glinso Group
          </span>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
            Global reinsurance brokerage and risk advisory.
            Engineering certainty across every continent.
          </p>
        </motion.div>

        {/* Offices grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16 md:mb-20">
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              viewport={{ once: true }}
            >
              <h3 className="text-[9px] font-mono tracking-[0.25em] uppercase text-primary mb-3">
                {o.city}
              </h3>
              <p className="text-xs text-muted-foreground/35 leading-relaxed">
                {o.address}<br />
                {o.detail}<br />
                {o.country}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer navigation">
            {["Contact", "ESG", "Privacy Policy", "Terms"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/30 hover:text-primary/50 transition-colors duration-500"
              >
                {link}
              </a>
            ))}
          </nav>
          <p className="text-[9px] font-mono text-muted-foreground/20 tracking-wider">
            {"\u00A9 2026 Glinso Group \u2014 All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  )
}
