"use client"

/*
  SVG dune silhouettes that layer over the phoenix video.
  3 layers at different depths create a parallax effect.
  Each layer moves at a different speed relative to scroll + mouse.
  Colors go from semi-transparent dark at the back to the solid page
  background at the front, creating a smooth blend from video to content.
*/

/* Pre-computed deterministic sand particle positions to avoid hydration mismatch */
const SAND_PARTICLES = Array.from({ length: 20 }, (_, i) => {
  // Simple seeded pseudo-random using index
  const seed = (i * 2654435761) >>> 0
  const r1 = ((seed & 0xff) / 255)
  const r2 = (((seed >> 8) & 0xff) / 255)
  const r3 = (((seed >> 16) & 0xff) / 255)
  const r4 = (((seed >> 24) & 0xff) / 255)
  return {
    x: 5 + r1 * 90,
    y: 50 + r2 * 45,
    delay: r3 * 6,
    dur: 4 + r4 * 4,
  }
})

interface DuneLayersProps {
  scrollProgress: number
  mouseX: number
}

export default function DuneLayers({ scrollProgress, mouseX }: DuneLayersProps) {
  // Parallax factors: back moves slow, front moves fast
  const backY = scrollProgress * -120
  const midY = scrollProgress * -200
  const frontY = scrollProgress * -280

  const backX = mouseX * 6
  const midX = mouseX * 12
  const frontX = mouseX * 18

  // Fade out as you scroll deep into content
  const layerOpacity = Math.max(0, 1 - scrollProgress * 1.2)

  return (
    <div
      className="fixed inset-0 z-[2] pointer-events-none overflow-hidden"
      style={{ opacity: layerOpacity }}
      aria-hidden="true"
    >
      {/* Back dune layer -- furthest, darkest, slow parallax */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-[110%] -ml-[5%] h-[55vh]"
        style={{
          transform: `translate(${backX}px, ${backY}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <defs>
          <linearGradient id="dune-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(30 30% 8%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(25 25% 5%)" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M0,280 C120,200 240,240 360,210 C480,180 540,250 720,200 C900,150 1020,230 1140,190 C1260,150 1380,220 1440,180 L1440,400 L0,400 Z"
          fill="url(#dune-back)"
        />
      </svg>

      {/* Mid dune layer -- medium depth */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-[115%] -ml-[7%] h-[45vh]"
        style={{
          transform: `translate(${midX}px, ${midY}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <defs>
          <linearGradient id="dune-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(28 28% 10%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(25 22% 6%)" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        <path
          d="M0,300 C180,240 300,280 480,230 C660,180 780,260 960,220 C1080,190 1200,250 1320,210 C1380,195 1440,230 1440,230 L1440,400 L0,400 Z"
          fill="url(#dune-mid)"
        />
      </svg>

      {/* Front dune layer -- closest, matches page background */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-[120%] -ml-[10%] h-[35vh]"
        style={{
          transform: `translate(${frontX}px, ${frontY}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <defs>
          <linearGradient id="dune-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(25 20% 7%)" stopOpacity="0.92" />
            <stop offset="100%" stopColor="hsl(220 20% 4%)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0,310 C200,270 360,300 540,260 C720,220 840,280 1020,250 C1140,230 1280,270 1380,240 L1440,250 L1440,400 L0,400 Z"
          fill="url(#dune-front)"
        />
      </svg>

      {/* Sand particle overlay -- deterministic positions to avoid hydration mismatch */}
      <div className="absolute inset-0 hidden md:block">
        {SAND_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute w-px h-px rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: "hsl(38 60% 55% / 0.15)",
              boxShadow: "0 0 2px hsl(38 60% 55% / 0.1)",
              animation: `sand-drift ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
