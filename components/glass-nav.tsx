"use client"

export default function GlassNav() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-6 md:px-10">
      <nav
        className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 rounded-sm"
        style={{
          background: "rgba(10,10,10,0.65)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="/"
          className="font-serif text-lg md:text-xl font-light tracking-[0.1em] text-foreground hover:text-primary transition-colors duration-300"
        >
          GLINSO
        </a>

        {/* Navigation links */}
        <div className="flex items-center gap-8">
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
            Global
          </a>
          <a
            href="#esg"
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            ESG
          </a>
          <a
            href="#contact"
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}
