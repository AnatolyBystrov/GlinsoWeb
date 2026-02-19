"use client"
/* v1 */
import { useState, useEffect, useCallback, useRef } from "react"
import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"
import PhoenixCursor from "@/components/phoenix-cursor"
import ScrollProgress from "@/components/scroll-progress"
import GlassNav from "@/components/glass-nav"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const rafScroll = useRef<number>(0)
  const rafMouse = useRef<number>(0)
  const targetMouse = useRef({ x: 0, y: 0 })
  const currentMouse = useRef({ x: 0, y: 0 })

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafScroll.current)
    rafScroll.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
      setScrollProgress(progress)
    })
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    const lerpLoop = () => {
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.06
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.06
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

  return (
    <main className="relative min-h-screen bg-background">
      {mounted && <PhoenixCursor />}
      <ScrollProgress progress={scrollProgress} />
      <GlassNav scrollProgress={scrollProgress} />

      {/* Cinematic video background */}
      <VideoBackground
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Content layer */}
      <div className="relative z-10">
        <HeroSection scrollProgress={scrollProgress} />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
