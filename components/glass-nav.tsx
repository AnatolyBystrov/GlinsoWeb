"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const linkClass = "text-[11px] font-semibold tracking-[0.18em] uppercase text-primary hover:text-primary/70 transition-colors duration-300 cursor-pointer"

const sections = [
  { id: "who-we-are", label: "About" },
  { id: "solutions",  label: "Solutions" },
  { id: "presence",   label: "Offices" },
  { id: "story",      label: "Story" },
  { id: "team",       label: "Team" },
  { id: "contact",    label: "Contact" },
]

export default function GlassNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isMarine = pathname === "/marine"

  const navStyle = {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px) saturate(1.2)",
    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
    border: "1px solid rgba(0,0,0,0.08)",
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - 100
      window.scrollTo({ top: offset, behavior: "smooth" })
    }
    setIsOpen(false)
  }

  // On home: smooth scroll; on other pages: navigate to /#section
  const SectionLink = ({ id, label }: { id: string; label: string }) =>
    isHome ? (
      <a onClick={() => scrollToSection(id)} className={linkClass}>{label}</a>
    ) : (
      <Link href={`/#${id}`} className={linkClass} onClick={() => setIsOpen(false)}>{label}</Link>
    )

  const logoColor = isMarine ? "#0097c4" : "hsl(28 95% 62%)"
  const logoHref  = isMarine ? "/marine" : "/"
  const logoClick = isHome
    ? (e: React.MouseEvent) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }
    : undefined

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-6 md:px-10">
      <nav
        className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 rounded-lg shadow-md"
        style={navStyle}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={logoHref}
          onClick={logoClick}
          className="font-serif text-lg md:text-xl font-semibold tracking-[0.1em] hover:opacity-75 transition-opacity duration-300"
          style={{ color: logoColor }}
        >
          GLINSO
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 md:gap-8">
          <SectionLink id="who-we-are" label="About" />
          <Link
            href="/marine"
            className={linkClass}
            style={{ color: "#0097c4", fontWeight: isMarine ? 700 : undefined }}
          >
            Marine
          </Link>
          {sections.filter(s => s.id !== "who-we-are").map((s) => <SectionLink key={s.id} id={s.id} label={s.label} />)}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span className="block w-5 h-px bg-foreground transition-all duration-300" style={{ transform: isOpen ? "rotate(45deg) translateY(4px)" : "none" }} />
          <span className="block w-5 h-px bg-foreground transition-all duration-300" style={{ opacity: isOpen ? 0 : 1 }} />
          <span className="block w-5 h-px bg-foreground transition-all duration-300" style={{ transform: isOpen ? "rotate(-45deg) translateY(-4px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && (
        <div
          className="md:hidden mx-auto max-w-7xl mt-2 rounded-lg shadow-md px-6 py-4 flex flex-col gap-4"
          style={navStyle}
        >
          <SectionLink id="who-we-are" label="About" />
          <Link href="/marine" className={linkClass} style={{ color: "#0097c4" }} onClick={() => setIsOpen(false)}>Marine</Link>
          {sections.filter(s => s.id !== "who-we-are").map((s) => <SectionLink key={s.id} id={s.id} label={s.label} />)}
        </div>
      )}
    </header>
  )
}
