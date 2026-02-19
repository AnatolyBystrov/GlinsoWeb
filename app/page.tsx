"use client"

/* cache-bust-2026-02-19 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react"

import VideoBackground from "@/components/video-background"
import HeroSection from "@/components/hero-section"
import ContentSections from "@/components/content-sections"
import SiteFooter from "@/components/site-footer"
import PhoenixCursor from "@/components/phoenix-cursor"
import ScrollProgress from "@/components/scroll-progress"
import GlassNav from "@/components/glass-nav"

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const raf = useRef(0)

  const update = useCallback(() => {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const top = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(top / total, 1) : 0)
    })
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", update)
      cancelAnimationFrame(raf.current)
    }
  }, [update])

  return progress
}

function useSmoothMouse() {
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06
      current.current.y += (target.current.y - current.current.y) * 0.06
      setMx(current.current.x)
      setMy(current.current.y)
      raf.current = requestAnimationFrame(tick)
    }
    window.addEventListener("mousemove", onMove)
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return { mouseX: mx, mouseY: my }
}

export default function Home() {
  const scrollProgress = useScrollProgress()
  const { mouseX, mouseY } = useSmoothMouse()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <main className="relative min-h-screen bg-background">
      {ready && <PhoenixCursor />}
      <ScrollProgress progress={scrollProgress} />
      <GlassNav scrollProgress={scrollProgress} />

      <VideoBackground
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      <div className="relative z-10">
        <HeroSection scrollProgress={scrollProgress} />
        <ContentSections />
        <SiteFooter />
      </div>
    </main>
  )
}
