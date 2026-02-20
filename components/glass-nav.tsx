"use client"

import Link from "next/link"

export default function GlassNav() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-6 md:px-10">
      <nav
        className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 rounded-lg shadow-md"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
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

        {/* Navigation links */}
        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="#who-we-are"
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            About
          </a>
          <a
            href="#solutions"
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Solutions
          </a>
          <a
            href="#presence"
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Offices
          </a>
          <Link
            href="/story"
            prefetch={true}
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Story
          </Link>
          <Link
            href="/team"
            prefetch={true}
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Team
          </Link>
          <Link
            href="/contact"
            prefetch={true}
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
}
