"use client"

import { motion } from "framer-motion"

interface ScrollIndicatorProps {
  sections: string[]
  activeSection: number
  onNavigate: (index: number) => void
}

export default function ScrollIndicator({ sections, activeSection, onNavigate }: ScrollIndicatorProps) {
  return (
    <nav
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3 hidden md:flex"
      aria-label="Section navigation"
    >
      {sections.map((id, i) => {
        const isActive = activeSection === i
        return (
          <button
            key={id}
            onClick={() => onNavigate(i)}
            className="group relative flex items-center justify-end gap-3 cursor-pointer"
            aria-label={`Navigate to ${id}`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Tooltip label on hover */}
            <span className="absolute right-6 whitespace-nowrap text-[10px] font-mono tracking-[0.15em] uppercase text-foreground/0 group-hover:text-foreground/60 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
              {id}
            </span>

            {/* Dot */}
            <motion.span
              animate={{
                scale: isActive ? 1 : 0.6,
                opacity: isActive ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="block rounded-full transition-colors duration-300"
              style={{
                width: isActive ? 8 : 6,
                height: isActive ? 8 : 6,
                backgroundColor: isActive ? "hsl(38 70% 55%)" : "hsl(40 20% 92% / 0.3)",
                boxShadow: isActive ? "0 0 12px hsl(38 70% 55% / 0.4)" : "none",
              }}
            />
          </button>
        )
      })}

      {/* Vertical connecting line behind dots */}
      <div
        className="absolute right-[3px] top-0 bottom-0 w-px -z-10"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(38 70% 55% / 0.1), transparent)" }}
      />
    </nav>
  )
}
