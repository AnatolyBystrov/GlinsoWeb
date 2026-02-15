"use client"

import { useRef, useEffect } from "react"

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.25) saturate(0.5)" }}
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Softer gradient overlays -- less black, more translucent deep navy */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(220 25% 3% / 0.65) 0%, hsl(220 25% 3% / 0.25) 40%, hsl(220 25% 3% / 0.6) 80%, hsl(220 25% 3% / 0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 45%, transparent 0%, hsl(220 25% 3% / 0.5) 100%)",
        }}
      />
    </div>
  )
}
