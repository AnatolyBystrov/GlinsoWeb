"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const WorldMap = dynamic(() => import("react-svg-worldmap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading map...</div>
    </div>
  )
})

interface WorldMapComponentProps {
  visible: boolean
}

export default function WorldMapComponent({ visible }: WorldMapComponentProps) {
  // Regional statistics
  const regions = [
    { name: "North America", percent: "25%", desc: "Leading insurance markets" },
    { name: "Europe", percent: "22%", desc: "Lloyd's & continental markets" },
    { name: "Middle East", percent: "14%", desc: "Regional hub operations" },
    { name: "Asia Pacific", percent: "18%", desc: "Growth markets access" },
    { name: "Latin America", percent: "15%", desc: "Emerging markets" },
    { name: "Africa", percent: "6%", desc: "Frontier markets" },
  ]

  // Data for the map - country codes with values matching percentages
  const data = [
    // North America - 25%
    { country: "us", value: 15 },
    { country: "ca", value: 10 },
    // Europe - 22%
    { country: "gb", value: 8 },
    { country: "de", value: 5 },
    { country: "fr", value: 4 },
    { country: "ch", value: 3 },
    { country: "it", value: 2 },
    // Middle East - 14% (UAE - Our offices!)
    { country: "ae", value: 14 }, // UAE - HEADQUARTERS
    // Asia Pacific - 18%
    { country: "sg", value: 6 },
    { country: "cn", value: 5 },
    { country: "jp", value: 4 },
    { country: "au", value: 3 },
    // Latin America - 15%
    { country: "br", value: 8 },
    { country: "mx", value: 4 },
    { country: "ar", value: 3 },
    // Africa - 6%
    { country: "za", value: 3 },
    { country: "eg", value: 2 },
    { country: "ke", value: 1 },
  ]

  return (
    <div className="w-full">
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12"
      >
        <div className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200/50 p-4 md:p-16">
          {/* Header */}
          <div className="mb-8">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl md:text-3xl font-serif font-semibold tracking-wide mb-2"
              style={{ color: "hsl(220 15% 25%)" }}
            >
              Global Partner Network
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-base"
              style={{ color: "hsl(220 10% 45%)" }}
            >
              100+ insurance & reinsurance partners worldwide
            </motion.p>
          </div>

          {/* World Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="my-8 w-full overflow-hidden"
          >
            <div className="w-full" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <WorldMap
                color="hsl(28 95% 62%)"
                size="responsive"
                data={data}
                backgroundColor="transparent"
                strokeOpacity={0.3}
                valueSuffix=" partners"
                styleFunction={(context: any) => {
                // UAE (our offices) - make it stand out in blue!
                if (context.countryCode === "AE") {
                  return {
                    fill: "hsl(192 45% 55%)",
                    fillOpacity: 1,
                    stroke: "hsl(192 45% 45%)",
                    strokeWidth: 2.5,
                    strokeOpacity: 1,
                    cursor: "default",
                    filter: "drop-shadow(0 0 10px hsl(192 45% 55%))",
                  }
                }

                // Other countries with partners
                const opacityLevel = context.countryValue
                  ? Math.min(0.4 + (context.countryValue * 0.04), 0.9)
                  : 0.1

                return {
                  fill: context.countryValue ? "hsl(28 95% 62%)" : "hsl(192 45% 70%)",
                  fillOpacity: opacityLevel,
                  stroke: "hsl(192 45% 60%)",
                  strokeWidth: 0.5,
                  strokeOpacity: 0.3,
                  cursor: "default",
                }
              }}
              />
            </div>
          </motion.div>

          {/* Office markers overlay text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-8 p-5 rounded-lg border border-slate-200/50"
            style={{ background: "linear-gradient(135deg, rgba(130, 201, 216, 0.08) 0%, rgba(255, 255, 255, 0.5) 100%)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="hsl(192 45% 55%)"
                />
              </svg>
              <p className="text-sm md:text-base font-semibold" style={{ color: "hsl(192 45% 45%)" }}>
                Our Offices
              </p>
            </div>
            <p className="text-xs md:text-sm font-mono tracking-wide" style={{ color: "hsl(220 10% 45%)" }}>
              <span style={{ color: "hsl(192 45% 55%)", fontWeight: 600 }}>●</span> Headquarters: Ras Al Khaimah, UAE
              <span className="mx-3">•</span>
              <span style={{ color: "hsl(192 45% 55%)", fontWeight: 600 }}>●</span> Representative Office: Dubai, UAE
            </p>
            <p className="text-[10px] mt-2 italic" style={{ color: "hsl(220 10% 55%)" }}>
              Highlighted in blue on the map above
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Regional Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {regions.map((region, i) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-5 rounded-lg bg-white border border-slate-200/50 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="text-2xl md:text-3xl font-bold font-serif"
                style={{ color: "hsl(28 95% 62%)" }}
              >
                {region.percent}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
            </div>
            <h4
              className="text-sm md:text-base font-semibold mb-1"
              style={{ color: "hsl(220 15% 25%)" }}
            >
              {region.name}
            </h4>
            <p className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>
              {region.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
