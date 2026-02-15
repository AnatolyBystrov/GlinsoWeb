"use client"

import { motion } from "framer-motion"

interface VerticalTextProps {
  text: string
  className?: string
  delay?: number
  side?: "left" | "right"
}

export default function VerticalText({
  text,
  className = "",
  delay = 0,
  side = "left",
}: VerticalTextProps) {
  const letters = text.split("")

  return (
    <div
      className={`flex flex-col items-center gap-1 ${className}`}
      aria-label={text}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.05,
            ease: "easeOut",
          }}
          className="text-xs font-mono tracking-[0.3em] uppercase text-foreground/40 leading-none"
          aria-hidden="true"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  )
}
