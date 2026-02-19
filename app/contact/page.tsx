"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const ease = [0.16, 1, 0.3, 1] as const

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  })

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus("success")
    setTimeout(() => {
      setStatus("idle")
      setFormData({ name: "", email: "", company: "", phone: "", service: "", message: "" })
    }, 3000)
  }

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
            <Link href="/story" className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
              Story
            </Link>
          </nav>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase block mb-6">
              Get in touch
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 leading-[1.05]">
              Let's discuss your risk transfer needs
            </h1>
            <p className="text-base text-secondary-foreground leading-relaxed mb-12">
              Whether you need reinsurance structuring, facultative placement, capital solutions or strategic advisory, our team is ready to deliver certainty.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-3">Global Headquarters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  30 St Mary Axe<br />
                  London EC3A 8BF<br />
                  United Kingdom
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-3">Direct Lines</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  +44 20 7123 4567<br />
                  contact@glinso.com
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-3">Other Offices</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>Zurich<br />Dubai</div>
                  <div>Singapore<br />New York</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="+44 20 ..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                  Service Interest
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="treaty">Treaty Reinsurance</option>
                  <option value="facultative">Facultative Placement</option>
                  <option value="capital">Capital Structuring</option>
                  <option value="analytics">Analytics & Modelling</option>
                  <option value="advisory">Strategic Advisory</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-mono tracking-wider uppercase text-muted-foreground block mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full bg-primary text-primary-foreground font-mono text-xs tracking-[0.2em] uppercase py-4 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all duration-300 relative overflow-hidden group"
              >
                {status === "idle" && "Send Message"}
                {status === "submitting" && "Sending..."}
                {status === "success" && "Message Sent ✓"}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-primary text-center"
              >
                Thank you. We'll be in touch within 24 hours.
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
