"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"

const Scene3D = dynamic(() => import("@/components/scene-3d"), { ssr: false })

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const [mounted, setMounted] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
    setScrollProgress(progress)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouseX((e.clientX / window.innerWidth - 0.5) * 2)
    setMouseY((e.clientY / window.innerHeight - 0.5) * 2)
  }, [])

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleScroll, handleMouseMove])

  return (
    <main className="relative min-h-screen bg-background">
      {/* Video background layer */}
      <VideoBackground />

      {/* 3D scene layer (desktop only) */}
      {mounted && !isMobile && (
        <Scene3D
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      )}

      {/* Content layer on top */}
      <div className="relative z-10">
        <HeroSection />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
