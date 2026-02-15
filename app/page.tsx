"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"
import ScrollIndicator from "@/components/scroll-indicator"
import PhoenixCursor from "@/components/phoenix-cursor"

const sectionIds = [
  "hero",
  "who-we-are",
  "divisions",
  "presence",
  "esg",
  "csr",
  "contact",
]

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [mounted, setMounted] = useState(false)
  const rafScroll = useRef<number>(0)
  const rafMouse = useRef<number>(0)
  const targetMouse = useRef({ x: 0, y: 0 })
  const currentMouse = useRef({ x: 0, y: 0 })

  // Smooth scroll tracking
  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafScroll.current)
    rafScroll.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      setScrollProgress(progress)

      const viewportCenter = scrollTop + window.innerHeight / 2
      let current = 0
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= viewportCenter) current = i
      }
      setActiveSection(current)
    })
  }, [])

  // Smooth mouse tracking with lerp for fluid parallax
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const lerpLoop = () => {
      const lerp = 0.06
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * lerp
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * lerp
      setMouseX(currentMouse.current.x)
      setMouseY(currentMouse.current.y)
      rafMouse.current = requestAnimationFrame(lerpLoop)
    }

    window.addEventListener("mousemove", onMouseMove)
    rafMouse.current = requestAnimationFrame(lerpLoop)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafMouse.current)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafScroll.current)
    }
  }, [handleScroll])

  const scrollToSection = (index: number) => {
    const el = document.getElementById(sectionIds[index])
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="relative min-h-screen bg-background">
      {/* Phoenix cursor -- desktop only */}
      {mounted && <PhoenixCursor />}
      {/* Fixed video background with particles -- always alive */}
      <VideoBackground
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Side scroll indicator */}
      {mounted && (
        <ScrollIndicator
          sections={sectionIds}
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
