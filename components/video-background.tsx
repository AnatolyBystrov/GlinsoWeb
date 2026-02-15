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

  const opacity = Math.max(0.15, 1 - scrollProgress * 2.5)
  const scale = 1 + scrollProgress * 0.15

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity, transform: `scale(${scale})`, transformOrigin: "center center" }}
      >
        {/* Desktop: full cover as before */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          style={{
            filter: "brightness(0.7) saturate(1.1) contrast(1.05)",
            objectPosition: "center 40%",
          }}
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Mobile: video sits in upper portion at natural aspect ratio, no cropping */}
        <div className="absolute inset-0 flex flex-col md:hidden">
          <div className="relative w-full pt-16" style={{ flex: "0 0 auto" }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
              style={{
                filter: "brightness(0.75) saturate(1.1) contrast(1.05)",
              }}
            >
              <source src="/video/hero-bg.mp4" type="video/mp4" />
            </video>
            {/* Soft bottom fade into dark bg */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, hsl(220 25% 4%))",
              }}
            />
          </div>
          <div className="flex-1 bg-background" />
        </div>
      </div>

      {/* Soft vignette -- desktop only */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 45%, transparent 0%, hsl(220 25% 4% / 0.45) 60%, hsl(220 25% 4% / 0.88) 100%)",
        }}
      />

      {/* Bottom gradient for text sections */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(220 25% 4% / 0.7) 50%, hsl(220 25% 4%) 100%)",
        }}
      />

      {/* Top darkening for nav */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, hsl(220 25% 4% / 0.5) 0%, transparent 100%)",
        }}
      />
    </div>
  )
}
