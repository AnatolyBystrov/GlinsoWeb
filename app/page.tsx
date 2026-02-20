"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Core layout components
import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"

// UI enhancements
import PhoenixCursor from "@/components/phoenix-cursor"
import ScrollProgress from "@/components/scroll-progress"
import GlassNav from "@/components/glass-nav"
import AmbientMusic from "@/components/ambient-music"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY
      setScrollProgress(total > 0 ? Math.min(current / total, 1) : 0)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative min-h-screen bg-background">
      {mounted && <PhoenixCursor />}
      {mounted && <AmbientMusic />}
      <ScrollProgress progress={scrollProgress} />
      <GlassNav />

      <VideoBackground scrollProgress={scrollProgress} mouseX={0} mouseY={0} />

      <div className="relative z-10">
        <HeroSection scrollProgress={scrollProgress} />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
