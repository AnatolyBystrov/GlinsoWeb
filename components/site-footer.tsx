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
  { label: "Privacy Policy", href: "#privacy-policy" },
  { label: "Terms of Use", href: "#terms" },
]

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-border/30 bg-background/80 backdrop-blur-md"
    >
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Logo and tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-lg font-sans font-semibold tracking-[0.15em] uppercase text-foreground mb-4 block">
            Glinso
          </span>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Strategic reinsurance brokerage delivering global market access and
            innovative risk solutions.
          </p>
        </motion.div>

        {/* Offices grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          {offices.map((office, index) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-mono tracking-[0.2em] uppercase text-primary mb-3">
                {office.city}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
        <div className="w-full h-px bg-border/30 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Links */}
          <nav
            className="flex flex-wrap items-center gap-6"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/50 font-mono">
            {"© 2026 Glinso Group. All rights reserved."}
          </p>
        </div>
      </div>

      {/* Large brand text at the very bottom */}
      <div className="overflow-hidden border-t border-border/20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 md:px-12 py-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            {["Reinsurance", "Brokerage", "Advisory", "Analytics"].map(
              (word, i) => (
                <span
                  key={word}
                  className="text-xs font-mono tracking-[0.3em] uppercase"
                  style={{
                    color: `hsl(38 70% ${55 - i * 10}%)`,
                  }}
                >
                  {word}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
