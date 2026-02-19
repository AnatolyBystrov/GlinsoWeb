"use client"

interface ScrollProgressProps {
  progress: number
}

export default function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-px pointer-events-none">
      <div
        className="h-full origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          background: "linear-gradient(90deg, rgba(190,165,120,0.3) 0%, rgba(190,165,120,0.7) 100%)",
        }}
      />
    </div>
  )
}
