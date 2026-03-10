"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import GlassNav from "@/components/glass-nav"
import AmbientMusic from "@/components/ambient-music"

const ease = [0.16, 1, 0.3, 1] as const

/* ── Inline video background for marine page ── */
function MarineVideoBackground({ scrollProgress }: { scrollProgress: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const wrap1Ref = useRef<HTMLDivElement>(null)
  const wrap2Ref = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef<number>(0)
  const activeRef = useRef<1 | 2>(1)
  const fadingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const FADE_DURATION = 1800  // ms

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Force-play whenever the video element changes (mount OR isMobile switch)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
    // Set gentle playback speed on desktop (looks cinematic, not choppy)
    if (!isMobile) v.playbackRate = 0.65
    // Periodically recover from unexpected pauses (iOS Low Power Mode etc.)
    const id = setInterval(() => {
      if (v.paused && !v.ended) v.play().catch(() => {})
    }, 2000)
    return () => clearInterval(id)
  }, [isMobile])

  // Direct DOM crossfade — desktop only, no React state, no re-render hang
  const startCrossfade = useCallback(() => {
    if (fadingRef.current) return
    fadingRef.current = true

    const v1 = videoRef.current
    const v2 = video2Ref.current
    const w1 = wrap1Ref.current
    const w2 = wrap2Ref.current
    if (!v1 || !v2 || !w1 || !w2) return

    const incoming = activeRef.current === 1 ? v2 : v1
    const wOut    = activeRef.current === 1 ? w1 : w2
    const wIn     = activeRef.current === 1 ? w2 : w1

    incoming.currentTime = 0
    incoming.play().catch(() => {})

    wOut.style.transition = `opacity ${FADE_DURATION}ms ease-in-out`
    wIn.style.transition  = `opacity ${FADE_DURATION}ms ease-in-out`
    wOut.style.opacity = "0"
    wIn.style.opacity  = "1"

    setTimeout(() => {
      activeRef.current = activeRef.current === 1 ? 2 : 1
      fadingRef.current = false
    }, FADE_DURATION + 200)
  }, [])

  // Trigger crossfade when active video finishes (desktop only)
  useEffect(() => {
    if (isMobile) return
    const v1 = videoRef.current
    const v2 = video2Ref.current
    if (!v1 || !v2) return

    const onEnd1 = () => { if (activeRef.current === 1) startCrossfade() }
    const onEnd2 = () => { if (activeRef.current === 2) startCrossfade() }

    v1.addEventListener("ended", onEnd1)
    v2.addEventListener("ended", onEnd2)
    return () => {
      v1.removeEventListener("ended", onEnd1)
      v2.removeEventListener("ended", onEnd2)
    }
  }, [startCrossfade, isMobile])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Ocean shimmer lines
    const lineAlpha = Math.max(0, 0.06 - scrollProgress * 0.1)
    if (lineAlpha > 0.005) {
      ctx.strokeStyle = `rgba(0,151,196,${lineAlpha})`
      ctx.lineWidth = 0.6
      for (let i = 0; i < 5; i++) {
        const yy = h * 0.6 + i * 30
        ctx.beginPath()
        ctx.moveTo(0, yy)
        for (let x = 0; x <= w; x += 8) {
          const wave = Math.sin(x * 0.008 + Date.now() * 0.0004 + i * 1.2) * 3
          ctx.lineTo(x, yy + wave)
        }
        ctx.stroke()
      }
    }

    // Floating particles (ocean foam)
    const moteAlpha = Math.max(0, 0.25 - scrollProgress * 0.5)
    for (let i = 0; i < 8; i++) {
      const t = (Date.now() * 0.0001 + i * 0.7) % 1
      ctx.beginPath()
      ctx.arc(((i * 137 + t * 200) % w), h * 0.5 + Math.sin(t * Math.PI * 2 + i) * h * 0.15, 1.2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(180,220,240,${moteAlpha})`
      ctx.fill()
    }

    animFrame.current = requestAnimationFrame(draw)
  }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    animFrame.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animFrame.current) }
  }, [draw])

  // Sync video opacity with scroll — direct DOM, no re-render
  useEffect(() => {
    const videoOpacity = Math.max(0.35, 0.65 - scrollProgress * 0.4)
    if (isMobile) {
      // Single video path on mobile
      const v = videoRef.current
      if (v && !fadingRef.current) v.style.opacity = String(videoOpacity)
      return
    }
    const w1 = wrap1Ref.current
    const w2 = wrap2Ref.current
    if (!w1 || !w2 || fadingRef.current) return
    if (activeRef.current === 1) {
      w1.style.opacity = String(videoOpacity)
    } else {
      w2.style.opacity = String(videoOpacity)
    }
  }, [scrollProgress, isMobile])

  const videoStyle: React.CSSProperties = {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%,-50%)",
    minWidth: "100%", minHeight: "100%", objectFit: "cover",
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ backgroundColor: "hsl(210 25% 96%)" }}>
      {isMobile ? (
        /* ── Mobile: single looping video, no crossfade, plays at normal speed ── */
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ ...videoStyle, position: "absolute", opacity: 0.65 }}
          onLoadedData={(e) => {
            const v = e.currentTarget
            v.play().catch(() => {})
          }}
          onCanPlayThrough={(e) => {
            // Extra trigger for iOS that sometimes fires after loadeddata is skipped
            e.currentTarget.play().catch(() => {})
          }}
        >
          <source src={`${basePath}/video/marine-bg.mp4`} type="video/mp4" />
        </video>
      ) : (
        /* ── Desktop: crossfade between two clones ── */
        <>
          <div ref={wrap1Ref} className="absolute inset-0" style={{ opacity: "0.65", transition: "opacity 2s ease-in-out" }}>
            <video ref={videoRef} autoPlay muted playsInline preload="auto" style={videoStyle}
              onLoadedData={(e) => { const v = e.currentTarget; v.playbackRate = 0.65; v.play().catch(() => {}) }}>
              <source src={`${basePath}/video/marine-bg.mp4`} type="video/mp4" />
            </video>
          </div>
          <div ref={wrap2Ref} className="absolute inset-0" style={{ opacity: "0", transition: "opacity 2s ease-in-out" }}>
            <video ref={video2Ref} muted playsInline preload="auto" style={videoStyle}>
              <source src={`${basePath}/video/marine-bg.mp4`} type="video/mp4" />
            </video>
          </div>
        </>
      )}
      {/* Ocean tint overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,60,100,0.18) 0%, rgba(0,100,160,0.10) 50%, rgba(0,40,80,0.25) 100%)" }} />
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ mixBlendMode: "screen", opacity: 0.7 }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: "linear-gradient(to bottom, transparent, hsl(210 25% 96%))" }} />
    </div>
  )
}

/* ── SVG marine icons ── */
const icons: Record<string, React.ReactElement> = {
  anchor: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0097c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="8" r="3" />
      <line x1="16" y1="11" x2="16" y2="28" />
      <path d="M8 15h16" />
      <path d="M8 28c0-4 3-6 8-6s8 2 8 6" />
    </svg>
  ),
  shield: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0097c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3 L28 8 V17 C28 23 22 28 16 30 C10 28 4 23 4 17 V8 Z" />
      <polyline points="11,16 14.5,19.5 21,13" />
    </svg>
  ),
  sailboat: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0097c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="3" x2="16" y2="24" />
      <path d="M16 5 L28 20 L16 20 Z" />
      <path d="M16 10 L7 20 L16 20 Z" />
      <path d="M6 26 Q16 22 26 26" />
      <path d="M4 29 Q16 25 28 29" />
    </svg>
  ),
  compass: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0097c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <polygon points="16,7 18.5,14.5 16,13 13.5,14.5" fill="#0097c4" stroke="none" />
      <polygon points="16,25 13.5,17.5 16,19 18.5,17.5" fill="#b0ccd8" stroke="none" />
      <circle cx="16" cy="16" r="1.5" fill="#0097c4" stroke="none" />
    </svg>
  ),
  document: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0097c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4 H20 L26 10 V28 H8 Z" />
      <path d="M20 4 V10 H26" />
      <line x1="12" y1="16" x2="22" y2="16" />
      <line x1="12" y1="20" x2="22" y2="20" />
      <line x1="12" y1="24" x2="18" y2="24" />
    </svg>
  ),
  helm: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0097c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="4" />
      <circle cx="16" cy="16" r="11" />
      <line x1="16" y1="5" x2="16" y2="12" />
      <line x1="16" y1="20" x2="16" y2="27" />
      <line x1="5" y1="16" x2="12" y2="16" />
      <line x1="20" y1="16" x2="27" y2="16" />
      <line x1="8.5" y1="8.5" x2="13.2" y2="13.2" />
      <line x1="18.8" y1="18.8" x2="23.5" y2="23.5" />
      <line x1="23.5" y1="8.5" x2="18.8" y2="13.2" />
      <line x1="13.2" y1="18.8" x2="8.5" y2="23.5" />
    </svg>
  ),
}

/* ── Coverage card ── */
function CoverageCard({ iconKey, title, items }: { iconKey: string; title: string; items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="border border-border/30 bg-white/70 backdrop-blur-sm p-8 hover:border-[#0097c4]/40 hover:bg-white/85 transition-all duration-300"
    >
      <div className="mb-4">{icons[iconKey]}</div>
      <h3 className="font-serif text-xl font-light text-foreground mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-[#0097c4] mt-0.5 shrink-0">—</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

/* ── Stat block ── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="text-center"
    >
      <div className="font-serif text-4xl md:text-5xl font-light text-[#0097c4] mb-2">{value}</div>
      <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">{label}</div>
    </motion.div>
  )
}

export default function MarinePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const sp = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
      setScrollProgress(sp)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main className="relative min-h-screen">
      <MarineVideoBackground scrollProgress={scrollProgress} />

      <AmbientMusic
        accentColor="#0097c4"
        label="ambient music"
      />

      <GlassNav />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-24 px-6"
        style={{ paddingTop: "clamp(60px, 8vh, 100px)" }}>

        {/* Light overlay fade-in */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "hsl(210 25% 96%)" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase >= 1 ? 0 : 1 }}
          transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Persistent dark gradient so text is always readable */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to bottom, rgba(0,15,35,0.55) 0%, rgba(0,20,50,0.35) 50%, rgba(0,10,30,0.65) 100%)"
        }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="block text-[10px] font-mono tracking-[0.4em] uppercase mb-6"
            style={{ color: "#7dd8f0", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            Specialist Marine Division
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={phase >= 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.6, delay: 0.2, ease }}
            className="font-serif font-semibold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.03em] leading-[1.1] mb-6"
            style={{ color: "hsl(28 95% 62%)", textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)" }}
          >
            GLINSO Marine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={phase >= 2 ? { opacity: 1, letterSpacing: "0.2em" } : {}}
            transition={{ duration: 1.4, delay: 0.1, ease }}
            className="font-sans text-sm md:text-base uppercase tracking-[0.2em] mb-12"
            style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
          >
            Yacht &amp; Pleasure Craft Insurance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="px-10 py-3.5 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300"
              style={{ background: "#0097c4", color: "#fff" }}
            >
              Request a Quote
            </Link>
            <Link
              href="/marine/claim"
              className="px-10 py-3.5 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.75)", color: "rgba(255,255,255,0.90)", backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.08)" }}
            >
              File a Claim
            </Link>
            <a
              href="#coverage"
              onClick={(e) => { e.preventDefault(); document.getElementById("coverage")?.scrollIntoView({ behavior: "smooth" }) }}
              className="px-10 py-3.5 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.65)", backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.04)" }}
            >
              Explore Coverage
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator — same style as main page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 19L19 12M12 19L5 12"
                stroke="rgba(255,255,255,0.7)" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 bg-white/80 backdrop-blur-sm border-y border-border/20 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value="$6M" label="Hull limit" />
          <Stat value="$3M" label="P&I (ROW)" />
          <Stat value="3" label="Use types" />
          <Stat value="Lloyd's" label="Capacity" />
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section id="coverage" className="relative z-10 py-28 px-6" style={{ background: "rgba(245,248,252,0.97)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-16"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#0097c4] uppercase block mb-4">Coverage</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.1]">
              Comprehensive protection<br />for every voyage
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CoverageCard
              iconKey="anchor"
              title="Hull & Machinery"
              items={[
                "Physical loss or damage to the vessel",
                "Up to $6,000,000 hull value",
                "All navigation areas covered",
                "In-transit and laid-up coverage",
              ]}
            />
            <CoverageCard
              iconKey="shield"
              title="Protection & Indemnity"
              items={[
                "Third-party liability up to $3M (ROW)",
                "Crew injury & illness",
                "Pollution liability",
                "Wreck removal",
              ]}
            />
            <CoverageCard
              iconKey="sailboat"
              title="Use Types"
              items={[
                "Private pleasure use",
                "Charter operations",
                "Bareboat charter",
                "Bluewater & coastal cruising",
              ]}
            />
            <CoverageCard
              iconKey="compass"
              title="Territories"
              items={[
                "US, Canada, Mexico",
                "Caribbean waters",
                "Rest of World (ROW)",
                "Flexible navigation limits",
              ]}
            />
            <CoverageCard
              iconKey="document"
              title="Facility Details"
              items={[
                "Facility: GLINSO Marine — Active",
                "Carrier: Sun Re",
                "Min premium: $250",
                "Instant premium calculation",
              ]}
            />
            <CoverageCard
              iconKey="helm"
              title="Why GLINSO Marine"
              items={[
                "Specialist uw team",
                "Specialist claims team",
                "Fast turnaround on submissions",
                "Tailored programme structuring",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-28 px-6" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-16 text-center"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#0097c4] uppercase block mb-4">Process</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-foreground">
              From submission to bound
            </h2>
          </motion.div>

          <style>{`
            @keyframes wave-drift {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes bubble-up {
              0%   { transform: translateY(0) scale(1);   opacity: 0.55; }
              80%  { opacity: 0.3; }
              100% { transform: translateY(-90px) scale(0.4); opacity: 0; }
            }
            @keyframes float-num {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(-4px); }
            }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { step: "01", title: "Submit", desc: "Provide vessel details, intended use and navigation area via our contact form.", delay: 0 },
              { step: "02", title: "Quote",  desc: "Our underwriters calculate an instant premium using Lloyd's approved rate tables.", delay: 0.12 },
              { step: "03", title: "Bind",   desc: "Accept the terms, make payment, sign the slip and receive your certificate of insurance within 24 hours.", delay: 0.24 },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: s.delay, ease }}
                whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(0,151,196,0.18)" }}
                className="relative overflow-hidden group cursor-default"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,151,196,0.18)",
                  borderRadius: "3px",
                  transition: "box-shadow 0.4s ease",
                }}
              >
                {/* Water fill — slides up on hover */}
                <div
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,151,196,0.13) 0%, rgba(0,100,170,0.06) 55%, transparent 100%)",
                    transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />

                {/* Animated wave at card bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-14 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.5s ease" }}>
                  <svg viewBox="0 0 400 28" preserveAspectRatio="none"
                    className="absolute bottom-0 h-7"
                    style={{ width: "200%", animation: "wave-drift 3.5s linear infinite" }}>
                    <path d="M0 14 C50 4, 100 24, 150 14 C200 4, 250 24, 300 14 C350 4, 400 24, 400 14 L400 28 L0 28 Z" fill="rgba(0,151,196,0.25)" />
                  </svg>
                  <svg viewBox="0 0 400 28" preserveAspectRatio="none"
                    className="absolute bottom-0 h-5"
                    style={{ width: "200%", animation: "wave-drift 5.5s linear infinite reverse", opacity: 0.5 }}>
                    <path d="M0 18 C60 6, 120 26, 180 18 C240 6, 300 26, 360 18 C390 10, 400 22, 400 18 L400 28 L0 28 Z" fill="rgba(0,151,196,0.18)" />
                  </svg>
                </div>

                {/* Floating bubbles */}
                {[
                  { size: 7,  left: "18%", bot: "18%", dur: 2.8, del: i * 0.4 },
                  { size: 5,  left: "42%", bot: "12%", dur: 3.5, del: i * 0.4 + 0.8 },
                  { size: 9,  left: "68%", bot: "22%", dur: 2.2, del: i * 0.4 + 0.4 },
                  { size: 4,  left: "82%", bot: "8%",  dur: 4.1, del: i * 0.4 + 1.1 },
                ].map((b, j) => (
                  <div key={j} className="absolute rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
                    style={{
                      width: b.size, height: b.size,
                      left: b.left, bottom: b.bot,
                      background: "rgba(0,151,196,0.3)",
                      animation: `bubble-up ${b.dur}s ease-in infinite`,
                      animationDelay: `${b.del}s`,
                      transition: "opacity 0.4s ease",
                    }} />
                ))}

                {/* Card content */}
                <div className="relative z-10 p-8 pb-12">
                  <div
                    className="text-[11px] font-mono tracking-[0.35em] text-[#0097c4] uppercase mb-4 inline-block"
                    style={{ animation: "float-num 3s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}
                  >
                    {s.step}
                  </div>
                  <h3 className="font-serif text-2xl font-light mb-3 transition-colors duration-400 group-hover:text-[#004f7c]" style={{ color: "hsl(222 47% 22%)" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 45%)" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-28 px-6 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#0097c4] uppercase block mb-6">Get started</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-6 text-background">
              Ready to protect your vessel?
            </h2>
            <p className="text-sm text-background/60 leading-relaxed mb-10 max-w-xl mx-auto">
              Contact our marine specialists for a tailored quote. We provide fast, transparent placements through Lloyd's of London.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block px-12 py-4 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300"
                style={{ background: "#0097c4", color: "#fff" }}
              >
                Contact Us
              </Link>
              <Link
                href="/marine/claim"
                className="inline-block px-12 py-4 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)" }}
              >
                File a Claim
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
