"use client"

import Link from "next/link"
import { useState } from "react"

interface NavLink {
  href: string
  label: string
}

interface SubPageHeaderProps {
  links: NavLink[]
}

const linkClass = "text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"

export default function SubPageHeader({ links }: SubPageHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" prefetch={true} className="font-serif text-lg font-light tracking-[0.05em] text-foreground hover:text-primary transition-colors">
          Glinso
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={true} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
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
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border/10 bg-background/95 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={true} className={linkClass} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
