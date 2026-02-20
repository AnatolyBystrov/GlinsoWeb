"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio] = useState(() => {
    if (typeof window !== "undefined") {
      const a = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/audio/ambient.mp3`)
      a.loop = true
      a.volume = 0.3
      return a
    }
    return null
  })

  const togglePlay = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        // Autoplay blocked - user needs to interact first
      })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      onClick={togglePlay}
      className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.svg
            key="pause"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" fill="hsl(28 95% 62%)" />
            <rect x="14" y="4" width="4" height="16" rx="1" fill="hsl(28 95% 62%)" />
          </motion.svg>
        ) : (
          <motion.svg
            key="play"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5.14V19.14L19 12.14L8 5.14Z"
              fill="hsl(28 95% 62%)"
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Ripple effect when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: "hsl(28 95% 62%)" }}
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs font-mono tracking-wide" style={{ color: "hsl(220 15% 25%)" }}>
        {isPlaying ? "Pause" : "Play"} ambient music
      </div>
    </motion.button>
  )
}
