"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import ExpandableSection from "./expandable-section"

const sections = [
  {
    id: "advantage",
    title: "The Glinso Advantage",
    shortText:
      "As a premier reinsurance broker, Glinso delivers strategic risk transfer solutions across global markets. Our portfolio spans property, casualty, specialty, and marine lines, providing clients with comprehensive access to capacity and innovative placement strategies.",
    fullText:
      "Through deep market relationships and analytical rigour, Glinso structures bespoke reinsurance programmes that optimise capital efficiency and protect against complex risk scenarios. Our team combines actuarial precision with market insight, ensuring every placement is tailored to the unique risk profile and strategic objectives of our clients. We leverage cutting-edge modelling tools and data analytics to deliver transparent, data-driven recommendations.",
    verticalLabel: "Advantage",
  },
  {
    id: "leadership",
    title: "Leadership driving growth and innovation",
    shortText:
      "Glinso's greatest strength lies in the synergy between its talented team and robust operating platform. The leadership team plays a pivotal role in managing a diverse portfolio of client relationships and reinsurance programmes, driving growth and innovation across every market we serve.",
    fullText:
      "With decades of combined experience spanning Lloyd's of London, Continental European markets, and emerging territories, our leadership navigates the complexities of today's dynamic risk landscape. Each team member brings specialised expertise in treaty and facultative placements, catastrophe modelling, and alternative risk transfer. This collective knowledge enables us to anticipate market shifts and deliver proactive solutions that create lasting value for our clients.",
    verticalLabel: "Leadership",
  },
  {
    id: "partnerships",
    title: "Strategic relationships and market access",
    shortText:
      "Glinso prioritises relationship building within global reinsurance markets, maintaining preferred access to leading reinsurers across London, Bermuda, Continental Europe, and Asia-Pacific. Our established partnerships ensure competitive terms and reliable capacity, even in challenging market conditions.",
    fullText:
      "We continuously expand our network of strategic partnerships, forging alliances with specialist capacity providers, managing general agents, and InsurTech innovators. This broad market reach enables us to identify and access unique solutions that match the evolving needs of our clients. Whether placing a complex specialty programme or a traditional treaty, Glinso's relationships unlock opportunities that others cannot.",
    verticalLabel: "Partnerships",
  },
  {
    id: "esg",
    title: "Empowering communities through social responsibility",
    shortText:
      "Beyond our core reinsurance operations, Glinso is committed to making a meaningful impact in the communities we serve. Our ESG framework integrates sustainability principles into every aspect of our business, from responsible underwriting practices to community engagement.",
    fullText:
      "Our initiatives include supporting education programmes in underserved regions, promoting financial literacy, and partnering with organisations focused on climate resilience. We believe that a responsible approach to business creates shared value for all stakeholders. Glinso actively participates in industry-wide sustainability initiatives and reports transparently on our environmental and social impact, holding ourselves accountable to the highest standards.",
    verticalLabel: "Community",
  },
  {
    id: "access",
    title: "Preferential market access",
    shortText:
      "Courtesy of Glinso's extensive global network spanning multiple continents, we are uniquely positioned to capitalise on opportunities and provide exclusive access to a diverse array of reinsurance markets and deal flow, delivering a tactical advantage for our clients.",
    fullText:
      "Our presence across key insurance hubs allows us to identify emerging opportunities in real-time, whether in established markets or frontier territories experiencing rapid growth. This geographic diversity combined with our deep sector expertise means that Glinso clients benefit from a truly global perspective, with placements optimised across the broadest possible range of counterparties and structures.",
    verticalLabel: "Access",
  },
  {
    id: "governance",
    title: "Corporate governance and global compliance",
    shortText:
      "Glinso operates under an integrated ESG management framework and adheres to strict corporate governance principles. Compliance with all relevant laws and regulations across global operations ensures that services are delivered responsibly and reliably.",
    fullText:
      "Our governance framework encompasses anti-money laundering protocols, sanctions screening, data protection compliance (including GDPR), and robust internal audit processes. We maintain the highest standards of ethical conduct, with regular training and certification programmes for all staff. Health, safety, environmental, and social considerations are woven into every activity, ensuring that our clients can rely on Glinso as a trusted, compliant, and transparent partner in all jurisdictions where we operate.",
    verticalLabel: "Governance",
  },
]

// Intro block that appears between hero and content sections -- mont-fort style
function ParallaxIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id="about"
      className="max-w-4xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-12 md:pb-16 text-center"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-px bg-primary/40 mx-auto mb-8 origin-center"
      />
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed text-balance"
      >
        As the dedicated reinsurance brokerage of the Glinso Group, we support
        our clients&apos; success through strategic risk transfer, innovative
        placement structures, and deep market intelligence. Functioning as
        both an advisor and an execution partner, Glinso delivers access to
        global reinsurance capacity while creating sustainable competitive
        advantages.
      </motion.p>
    </div>
  )
}

export default function ContentSections() {
  return (
    <div className="relative z-10">
      <ParallaxIntro />

      {sections.map((section, index) => (
        <ExpandableSection
          key={section.id}
          id={section.id}
          title={section.title}
          shortText={section.shortText}
          fullText={section.fullText}
          verticalLabel={section.verticalLabel}
          index={index}
        />
      ))}
    </div>
  )
}
