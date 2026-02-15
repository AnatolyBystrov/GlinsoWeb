"use client"

import { useState, useEffect, useCallback } from "react"
import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    setMounted(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return (
    <main className="relative min-h-screen bg-background">
      {/* Video background layer -- the phoenix animation IS the hero visual */}
      <VideoBackground scrollProgress={scrollProgress} />

      {/* Content layer on top */}
      <div className="relative z-10">
        <HeroSection mounted={mounted} />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
