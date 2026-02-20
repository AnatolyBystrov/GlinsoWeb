"use client"

import Link from "next/link"
import { useState } from "react"

const linkClass = "text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"

export default function GlassNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navStyle = {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px) saturate(1.2)",
    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
    border: "1px solid rgba(0,0,0,0.08)",
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-6 md:px-10">
      <nav
        className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 rounded-lg shadow-md"
        style={navStyle}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="/"
          className="font-serif text-lg md:text-xl font-semibold tracking-[0.1em] hover:text-primary transition-colors duration-300"
          style={{ color: "hsl(220 15% 20%)" }}
        >
          GLINSO
        </a>

        {/* Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-6 md:gap-8">
          <a href="#who-we-are" className={linkClass}>About</a>
          <a href="#solutions" className={linkClass}>Solutions</a>
          <a href="#presence" className={linkClass}>Offices</a>
          <Link href="/story" prefetch={true} className={linkClass}>Story</Link>
          <Link href="/team" prefetch={true} className={linkClass}>Team</Link>
          <Link href="/contact" prefetch={true} className={linkClass}>Contact</Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span
            className="block w-5 h-px bg-foreground transition-all duration-300"
            style={{ transform: isOpen ? "rotate(45deg) translateY(4px)" : "none" }}
          />
          <span
            className="block w-5 h-px bg-foreground transition-all duration-300"
            style={{ opacity: isOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-px bg-foreground transition-all duration-300"
            style={{ transform: isOpen ? "rotate(-45deg) translateY(-4px)" : "none" }}
          />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div
          className="md:hidden mx-auto max-w-7xl mt-2 rounded-lg shadow-md px-6 py-4 flex flex-col gap-4"
          style={navStyle}
        >
          <a href="#who-we-are" className={linkClass} onClick={() => setIsOpen(false)}>About</a>
          <a href="#solutions" className={linkClass} onClick={() => setIsOpen(false)}>Solutions</a>
          <a href="#presence" className={linkClass} onClick={() => setIsOpen(false)}>Offices</a>
          <Link href="/story" prefetch={true} className={linkClass} onClick={() => setIsOpen(false)}>Story</Link>
          <Link href="/team" prefetch={true} className={linkClass} onClick={() => setIsOpen(false)}>Team</Link>
          <Link href="/contact" prefetch={true} className={linkClass} onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  )
}
