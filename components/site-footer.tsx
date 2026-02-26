"use client"

import { motion } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as const

const offices = [
  { city: "Headquarters", address: "GLINSO Brokers FZE", detail: "Ras Al Khaimah", country: "United Arab Emirates" },
  { city: "Representative Office", address: "5, Building 2, Madison Astor", detail: "Majan, Wadi Al Safa 3, Dubai", country: "United Arab Emirates" },
]

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-border/30"
      style={{
        background:
          "linear-gradient(180deg, rgba(248,250,252,0.88) 0%, rgba(248,250,252,0.96) 100%)",
      }}
    >
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
          <span className="font-serif text-2xl md:text-3xl font-light tracking-[0.03em] text-foreground block mb-4">
            GLINSO Brokers FZE
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-[hsl(192_45%_55%/.6)] to-[hsl(28_95%_62%/.55)] mb-4" />
          <p className="text-sm md:text-base text-foreground/90 max-w-2xl leading-relaxed mb-5">
            Independent insurance and reinsurance brokerage. Headquartered in Ras Al Khaimah, United Arab Emirates.
          </p>
          <div className="text-sm md:text-base text-foreground/85">
            <a href="mailto:team@glinso.ae" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
              team@glinso.ae
            </a>
          </div>
        </motion.div>

        {/* Offices grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-16 md:mb-20">
          {offices.map((o, i) => (
            <motion.div
              key={o.city}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              style={{ willChange: "opacity" }}
              className="relative pl-5"
            >
              <div className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-[hsl(192_45%_55%/.75)] via-[hsl(28_95%_62%/.55)] to-transparent" />
              <h3 className="text-[10px] md:text-xs font-mono tracking-[0.22em] uppercase text-primary mb-3">
                {o.city}
              </h3>
              <p className="text-sm md:text-base text-foreground/85 leading-relaxed">
                {o.address}<br />
                {o.detail}<br />
                <span className="text-foreground/70">{o.country}</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer navigation">
            {["Contact", "Privacy Policy", "Terms"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                className="text-[10px] md:text-xs font-mono tracking-[0.18em] uppercase text-foreground/75 hover:text-primary transition-colors duration-500"
              >
                {link}
              </a>
            ))}
          </nav>
          <p className="text-[10px] md:text-xs font-mono text-foreground/65 tracking-[0.14em]">
            {"\u00A9 2026 GLINSO Brokers FZE \u2014 All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  )
}
