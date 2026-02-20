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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 md:mb-20"
          style={{ willChange: "opacity" }}
        >
          <span className="font-serif text-lg md:text-xl font-light tracking-[0.05em] text-foreground block mb-3 drop-shadow-lg">
            GLINSO Brokers FZE
          </span>
          <p className="text-xs md:text-sm text-foreground/90 max-w-md leading-relaxed mb-4 drop-shadow-md">
            Independent insurance and reinsurance brokerage. Headquartered in Ras Al Khaimah, United Arab Emirates.
          </p>
          <div className="text-xs text-foreground/80 drop-shadow-md">
            <a href="mailto:team@glinso.ae" className="hover:text-primary transition-colors">team@glinso.ae</a>
          </div>
        </motion.div>

        {/* Offices grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-16 md:mb-20">
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              style={{ willChange: "opacity" }}
            >
              <h3 className="text-[9px] font-mono tracking-[0.25em] uppercase text-primary mb-3 drop-shadow-md">
                {o.city}
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed drop-shadow-md">
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
                className="text-[9px] font-mono tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-colors duration-500 drop-shadow-md"
              >
                {link}
              </a>
            ))}
          </nav>
          <p className="text-[9px] font-mono text-foreground/60 tracking-wider drop-shadow-md">
            {"\u00A9 2026 GLINSO Brokers FZE \u2014 All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  )
}
