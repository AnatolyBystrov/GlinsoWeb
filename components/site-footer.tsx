"use client"

import { motion } from "framer-motion"

const offices = [
  {
    city: "London",
    address: "30 St Mary Axe",
    details: "London EC3A 8BF",
    country: "United Kingdom",
  },
  {
    city: "Zurich",
    address: "Bahnhofstrasse 42",
    details: "8001 Zurich",
    country: "Switzerland",
  },
  {
    city: "Singapore",
    address: "One Raffles Place",
    details: "Tower 2, #20-01",
    country: "Singapore 048616",
  },
  {
    city: "Dubai",
    address: "DIFC Gate Village",
    details: "Building 3, Level 5",
    country: "United Arab Emirates",
  },
]

const footerLinks = [
  { label: "Contact", href: "#contact" },
  { label: "ESG", href: "#esg" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
]

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-border/20"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-28">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-base md:text-lg font-sans font-light tracking-[0.2em] uppercase text-foreground block mb-3">
            Glinso Group
          </span>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Global reinsurance brokerage and risk advisory.
          </p>
        </motion.div>

        {/* Offices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-16">
          {offices.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary/70 mb-3">
                {office.city}
              </h3>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                {office.address}
                <br />
                {office.details}
                <br />
                {office.country}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/20 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <nav
            className="flex flex-wrap items-center gap-5 md:gap-7"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] md:text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground/50 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-[10px] md:text-xs text-muted-foreground/30 font-mono">
            {"\u00A9 2026 | Glinso Group \u2013 All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
