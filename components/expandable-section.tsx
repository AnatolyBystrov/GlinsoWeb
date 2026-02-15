"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface ExpandableSectionProps {
  id: string
  title: string
  shortText: string
  fullText: string
  verticalLabel?: string
  index: number
}

export default function ExpandableSection({
  id,
  title,
  shortText,
  fullText,
  verticalLabel,
  index,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3])
  const lineScale = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <motion.div
      ref={sectionRef}
      id={id}
      style={{ y, opacity }}
      className="relative py-16 md:py-24 border-t border-border/30"
    >
      <div className="flex items-start gap-6 md:gap-12 max-w-6xl mx-auto px-6 md:px-12">
        {/* Vertical label */}
        {verticalLabel && (
          <div className="hidden md:flex flex-col items-center gap-1 pt-2 min-w-[20px]">
            {verticalLabel.split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.03 }}
                viewport={{ once: true }}
                className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary/40 leading-none"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {/* Section number */}
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-primary/30 mb-4 block"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-sans font-light tracking-tight text-foreground mb-6 text-pretty"
          >
            {title}
          </motion.h2>

          {/* Short text */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl"
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
                <p className="pt-6 text-base text-muted-foreground/80 leading-relaxed max-w-3xl">
                  {fullText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand button */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 flex items-center gap-3 group cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-primary/30 group-hover:border-primary/60 transition-colors duration-300">
              {isExpanded ? (
                <Minus className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-primary" />
              )}
            </span>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-primary/60 group-hover:text-primary transition-colors duration-300">
              {isExpanded ? "Collapse" : "Expand text"}
            </span>
          </motion.button>
        </div>

        {/* Animated side line */}
        <div className="hidden lg:block min-w-[60px]">
          <motion.div
            style={{ scaleY: lineScale }}
            className="w-px h-32 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent origin-top"
          />
        </div>
      </div>
    </motion.div>
  )
}
