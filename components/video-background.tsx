"use client"

import { useRef, useEffect } from "react"

interface VideoBackgroundProps {
  scrollProgress: number
}

export default function VideoBackground({ scrollProgress }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85
    }
  }, [])

  // Video fades & scales with scroll -- like Fort Energy's bg depth effect
  const opacity = Math.max(0.15, 1 - scrollProgress * 2.5)
  const scale = 1 + scrollProgress * 0.15

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Video -- the phoenix animation plays prominently */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity, transform: `scale(${scale})`, transformOrigin: "center center" }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "brightness(0.7) saturate(1.1) contrast(1.05)",
            objectPosition: "center 40%",
          }}
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Soft vignette edges -- keeps the phoenix centre bright, darkens edges for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 45%, transparent 0%, hsl(220 25% 4% / 0.45) 60%, hsl(220 25% 4% / 0.88) 100%)",
        }}
      />

      {/* Bottom gradient for text sections transition */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(220 25% 4% / 0.7) 50%, hsl(220 25% 4%) 100%)",
        }}
      />

      {/* Top subtle darkening for nav readability */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(220 25% 4% / 0.5) 0%, transparent 100%)",
        }}
      />
    </div>
  )
}
