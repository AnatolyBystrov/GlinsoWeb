"use client"

import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as const

const offices = [
  { city: "Headquarters", address: "GLINSO Brokers FZE", detail: "Ras Al Khaimah", country: "United Arab Emirates" },
  { city: "Representative Office", address: "5, Building 2, Madison Astor", detail: "Majan, Wadi Al Safa 3, Dubai", country: "United Arab Emirates" },
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
            GLINSO Brokers FZE
          </span>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed mb-4">
            Independent insurance and reinsurance brokerage. Headquartered in Ras Al Khaimah, United Arab Emirates.
          </p>
          <div className="text-xs text-muted-foreground/70">
            <a href="mailto:legal@glinso.ae" className="hover:text-primary transition-colors">legal@glinso.ae</a>
            {" · "}
            <a href="mailto:veronica@glinso.ae" className="hover:text-primary transition-colors">veronica@glinso.ae</a>
            {" · "}
            <a href="mailto:team@glinso.ae" className="hover:text-primary transition-colors">team@glinso.ae</a>
          </div>
        </motion.div>

        {/* Offices grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-16 md:mb-20">
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
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
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
            {["Contact", "Privacy Policy", "Terms"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/50 hover:text-primary/70 transition-colors duration-500"
              >
                {link}
              </a>
            ))}
          </nav>
          <p className="text-[9px] font-mono text-muted-foreground/40 tracking-wider">
            {"\u00A9 2026 GLINSO Brokers FZE \u2014 All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  )
}
