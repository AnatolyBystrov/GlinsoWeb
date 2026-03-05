"use client"

/* GLINSO — Fixed Navbar with legacy brand palette (#F89848 / #90D0D8) */
export default function GlassNav() {
  const links = [
    { href: "#who-we-are", label: "About" },
    { href: "#solutions",   label: "Solutions" },
    { href: "#presence",    label: "Global" },
    { href: "#esg",         label: "ESG" },
    { href: "#contact",     label: "Contact" },
  ]

  const pages = [
    { href: "/story",   label: "Story" },
    { href: "/team",    label: "Team" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header
      className="fixed left-0 right-0 z-50 px-4 md:px-8"
      style={{ top: "16px" }}
    >
      <nav
        className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3 rounded-sm"
        style={{
          background: "rgba(10,10,10,0.72)",
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(248,152,72,0.12)",
          boxShadow: "0 1px 32px rgba(0,0,0,0.4)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="/"
          className="font-serif text-base md:text-lg font-light tracking-[0.15em]"
          style={{ color: "#F8F5F0" }}
        >
          GLINSO
          <span
            className="inline-block w-1 h-1 rounded-full ml-1 mb-1 align-middle"
            style={{ backgroundColor: "#F89848" }}
          />
        </a>

        {/* Section links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[10px] font-mono tracking-[0.22em] uppercase transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#F89848")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
            >
              {l.label}
            </a>
          ))}

          {/* Teal divider */}
          <span className="w-px h-3" style={{ background: "rgba(144,208,216,0.25)" }} />

          {pages.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="text-[10px] font-mono tracking-[0.22em] uppercase transition-colors duration-300"
              style={{ color: "rgba(144,208,216,0.6)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#90D0D8")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(144,208,216,0.6)")}
            >
              {p.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
