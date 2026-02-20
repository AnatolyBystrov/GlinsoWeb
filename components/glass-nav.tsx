"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const linkClass = "text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"

export default function GlassNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navStyle = {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px) saturate(1.2)",
    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
    border: "1px solid rgba(0,0,0,0.08)",
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
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
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-serif text-lg md:text-xl font-semibold tracking-[0.1em] hover:text-primary transition-colors duration-300"
          style={{ color: "hsl(220 15% 20%)" }}
        >
          GLINSO
        </a>

        {/* Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-6 md:gap-8">
          <a onClick={() => scrollToSection('who-we-are')} className={linkClass}>About</a>
          <a onClick={() => scrollToSection('solutions')} className={linkClass}>Solutions</a>
          <a onClick={() => scrollToSection('presence')} className={linkClass}>Offices</a>
          <a onClick={() => scrollToSection('story')} className={linkClass}>Story</a>
          <a onClick={() => scrollToSection('team')} className={linkClass}>Team</a>
          <a onClick={() => scrollToSection('contact')} className={linkClass}>Contact</a>
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
          <a onClick={() => scrollToSection('who-we-are')} className={linkClass}>About</a>
          <a onClick={() => scrollToSection('solutions')} className={linkClass}>Solutions</a>
          <a onClick={() => scrollToSection('presence')} className={linkClass}>Offices</a>
          <a onClick={() => scrollToSection('story')} className={linkClass}>Story</a>
          <a onClick={() => scrollToSection('team')} className={linkClass}>Team</a>
          <a onClick={() => scrollToSection('contact')} className={linkClass}>Contact</a>
        </div>
      )}
    </header>
  )
}
