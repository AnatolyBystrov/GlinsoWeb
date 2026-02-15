"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface ExpandableSectionProps {
  id: string
  title: string
  shortText: string
  fullText: string
  verticalLabel?: string
  index: number
}

const ease = [0.16, 1, 0.3, 1] as const

export default function ExpandableSection({
  id,
  title,
  shortText,
  fullText,
  verticalLabel,
  index,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const baseDelay = 0.15

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative py-20 md:py-28 border-t border-border/20"
    >
      <div className="flex items-start gap-6 md:gap-12 max-w-6xl mx-auto px-6 md:px-12">
        {/* Vertical label */}
        {verticalLabel && (
          <div className="hidden md:flex flex-col items-center gap-[3px] pt-3 min-w-[18px]">
            {verticalLabel.split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: baseDelay + i * 0.025, ease }}
                className="text-[9px] font-mono tracking-[0.3em] uppercase text-primary/35 leading-none"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Section number */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: baseDelay, ease }}
            className="text-[11px] font-mono text-primary/25 mb-4 block"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: baseDelay + 0.1, ease }}
            className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans font-light tracking-tight text-foreground mb-6 text-pretty leading-[1.2]"
          >
            {title}
          </motion.h2>

          {/* Short text */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: baseDelay + 0.2, ease }}
            className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl"
          >
            {shortText}
          </motion.p>

          {/* Expandable content */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pt-5 text-sm md:text-base text-muted-foreground/70 leading-relaxed max-w-3xl">
                  {fullText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: baseDelay + 0.3, ease }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 flex items-center gap-3 group cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full border border-primary/25 group-hover:border-primary/50 transition-colors duration-300">
              {isExpanded ? (
                <Minus className="w-3 h-3 text-primary/70" />
              ) : (
                <Plus className="w-3 h-3 text-primary/70" />
              )}
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary/40 group-hover:text-primary/70 transition-colors duration-300">
              {isExpanded ? "Collapse" : "Read more"}
            </span>
          </motion.button>
        </div>

        {/* Side accent line */}
        <div className="hidden lg:block min-w-[50px]">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isVisible ? { scaleY: 1 } : {}}
            transition={{ duration: 0.9, delay: baseDelay + 0.15, ease }}
            className="w-px h-28 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent origin-top"
          />
        </div>
      </div>
    </section>
  )
}
