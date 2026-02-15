"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"
import ScrollIndicator from "@/components/scroll-indicator"

const sectionIds = ["hero", "about", "advantage", "leadership", "partnerships", "esg", "access", "governance", "contact"]

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
    setScrollProgress(progress)

    // Determine active section based on scroll position
    const sections = sectionIds.map((id) => document.getElementById(id))
    const viewportCenter = scrollTop + window.innerHeight / 2
    let current = 0
    sections.forEach((section, i) => {
      if (section && section.offsetTop <= viewportCenter) {
        current = i
      }
    })
    setActiveSection(current)
  }, [])

  useEffect(() => {
    setMounted(true)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToSection = (index: number) => {
    const el = document.getElementById(sectionIds[index])
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main ref={containerRef} className="relative min-h-screen bg-background">
      {/* Video background -- fixed behind everything */}
      <VideoBackground scrollProgress={scrollProgress} />

      {/* Side scroll indicator dots (mont-fort style) */}
      {mounted && (
        <ScrollIndicator
          sections={sectionIds}
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10">
        <HeroSection mounted={mounted} />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
