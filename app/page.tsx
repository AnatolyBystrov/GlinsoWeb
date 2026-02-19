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

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
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

  useEffect(() => {
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const handleMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const animate = () => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06
      setMouseX(current.x)
      setMouseY(current.y)
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMove)
    const raf = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-background">
      {mounted && <PhoenixCursor />}
      <ScrollProgress progress={scrollProgress} />
      <GlassNav scrollProgress={scrollProgress} />

      <VideoBackground scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />

      <div className="relative z-10">
        <HeroSection scrollProgress={scrollProgress} />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
