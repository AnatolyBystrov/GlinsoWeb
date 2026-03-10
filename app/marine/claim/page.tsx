"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import GlassNav from "@/components/glass-nav"
import AmbientMusic from "@/components/ambient-music"

const ease = [0.16, 1, 0.3, 1] as const

/* ── Reusable field components ── */
function Field({ label, name, value, onChange, type = "text", required, placeholder }: {
  label: string; name: string; value: string
  onChange: (n: string, v: string) => void
  type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "#0097c4" }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type} name={name} value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder} required={required}
        className="rounded px-3 py-2.5 text-sm focus:outline-none transition-all"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(0,151,196,0.25)", color: "rgba(255,255,255,0.9)" }}
        onFocus={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; e.currentTarget.style.borderColor = "rgba(0,151,196,0.6)" }}
        onBlur={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(0,151,196,0.25)" }}
      />
    </div>
  )
}

function TextArea({ label, name, value, onChange, required, placeholder, rows = 4 }: {
  label: string; name: string; value: string
  onChange: (n: string, v: string) => void
  required?: boolean; placeholder?: string; rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "#0097c4" }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        name={name} value={value} rows={rows}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder} required={required}
        className="rounded px-3 py-2.5 text-sm focus:outline-none transition-all resize-none"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(0,151,196,0.25)", color: "rgba(255,255,255,0.9)" }}
        onFocus={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; e.currentTarget.style.borderColor = "rgba(0,151,196,0.6)" }}
        onBlur={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(0,151,196,0.25)" }}
      />
    </div>
  )
}

function Select({ label, name, value, onChange, options, required }: {
  label: string; name: string; value: string
  onChange: (n: string, v: string) => void
  options: { value: string; label: string }[]; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-mono tracking-[0.15em] uppercase" style={{ color: "#0097c4" }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        name={name} value={value} required={required}
        onChange={e => onChange(name, e.target.value)}
        className="rounded px-3 py-2.5 text-sm focus:outline-none transition-all"
        style={{ background: "rgba(20,40,70,0.95)", border: "1px solid rgba(0,151,196,0.25)", color: value ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: "#0c2340" }}>{o.label}</option>)}
      </select>
    </div>
  )
}

const STEP_LABELS = ["Contact", "Vessel", "Incident", "Damage"] as const

const INITIAL_FORM = {
  claimantName: "", policyHolderName: "", address: "", mobile: "", email: "",
  policyNumber: "", boatName: "", boatNameMarked: "", boatDetails: "", boatColor: "",
  incidentDate: "", incidentTime: "", wasUnderway: "", isStormClaim: "", stormName: "",
  location: "", weatherConditions: "", windSpeed: "", windDirection: "",
  seaCondition: "", vesselSpeed: "", whatHappened: "",
  vesselDamage: "", equipmentDamage: "", hasPhotos: "",
  wasOperator: "", operatorName: "", operatorExperience: "", operatorQualifications: "",
  personsAboard: "", useType: "", injuries: "", boatLocation: "", remarks: "",
}

export default function MarineClaimPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const update = (name: string, value: string) => setForm(f => ({ ...f, [name]: value }))

  const handleSubmit = async () => {
    setStatus("submitting")
    setErrorMsg("")
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Unknown error")
      setStatus("success")
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message ?? "Something went wrong. Please try again.")
    }
  }

  const stepTitles = ["Contact Information", "Vessel Details", "Incident Details", "Damage & Operator"]
  const stepDescs = [
    "Your contact details and policy reference",
    "Information about your vessel",
    "What happened, when, and where",
    "Damage description and additional details",
  ]

  return (
    <main
      className="relative min-h-screen"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0c2340 45%, #093352 70%, #0a2a42 100%)" }}
    >
      <GlassNav />
      <AmbientMusic accentColor="#0097c4" label="ambient music" />

      {/* Subtle glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 65% 25%, rgba(0,151,196,0.07) 0%, transparent 55%)" }} />

      <div className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-12 text-center"
          >
            <Link href="/marine" className="inline-block text-[10px] font-mono tracking-[0.3em] uppercase mb-4 hover:opacity-70 transition-opacity" style={{ color: "#0097c4" }}>
              ← GLINSO Marine
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
              Marine Claim
            </h1>
            <p className="text-sm max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
              Complete all sections accurately. Our claims team responds within 24 hours.
            </p>
          </motion.div>

          {/* Step indicator */}
          {status !== "success" && (
            <div className="flex items-center justify-center mb-10">
              {STEP_LABELS.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono transition-all duration-400"
                      style={{
                        background: i === step ? "#0097c4" : i < step ? "rgba(0,151,196,0.35)" : "rgba(255,255,255,0.07)",
                        color: i <= step ? "#fff" : "rgba(255,255,255,0.3)",
                        border: i === step ? "none" : `1px solid ${i < step ? "rgba(0,151,196,0.4)" : "rgba(255,255,255,0.12)"}`,
                      }}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span className="hidden md:block text-[9px] font-mono tracking-widest uppercase" style={{ color: i === step ? "#0097c4" : "rgba(255,255,255,0.25)" }}>
                      {s}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="w-10 h-px mx-2 mb-4" style={{ background: i < step ? "rgba(0,151,196,0.45)" : "rgba(255,255,255,0.12)" }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="rounded-lg p-8 md:p-10"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,151,196,0.18)", backdropFilter: "blur(20px)" }}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(0,151,196,0.15)", border: "1px solid rgba(0,151,196,0.35)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0097c4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-light text-white mb-3">Claim Submitted</h2>
                <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Your claim for <strong className="text-white">{form.boatName || "your vessel"}</strong> has been received.<br />
                  Our marine claims team will contact you within 24 hours.
                </p>
                <Link href="/marine" className="text-[11px] font-mono tracking-[0.2em] uppercase hover:opacity-70 transition-opacity" style={{ color: "#0097c4" }}>
                  ← Back to Marine
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-serif text-xl font-light text-white mb-1">{stepTitles[step]}</h2>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{stepDescs[step]}</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-5"
                  >
                    {/* ── STEP 1: Contact ── */}
                    {step === 0 && (<>
                      <Field label="Your Name" name="claimantName" value={form.claimantName} onChange={update} required />
                      <Field label="Insured Client / Policyholder Name (if different)" name="policyHolderName" value={form.policyHolderName} onChange={update} placeholder="Leave blank if same as above" />
                      <Field label="Address" name="address" value={form.address} onChange={update} required />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Mobile Phone" name="mobile" value={form.mobile} onChange={update} type="tel" required />
                        <Field label="Email" name="email" value={form.email} onChange={update} type="email" required />
                      </div>
                    </>)}

                    {/* ── STEP 2: Vessel ── */}
                    {step === 1 && (<>
                      <Field label="Policy Number" name="policyNumber" value={form.policyNumber} onChange={update} placeholder="If known" />
                      <Field label="Boat's Name" name="boatName" value={form.boatName} onChange={update} required />
                      <Select
                        label="Is the boat name clearly marked on the exterior?"
                        name="boatNameMarked" value={form.boatNameMarked} onChange={update} required
                        options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                      />
                      <Field label="Year, Builder (Make), Model & Length" name="boatDetails" value={form.boatDetails} onChange={update} required placeholder="e.g. 2019 Bénéteau Oceanis 40.1" />
                      <Field label="Vessel Colour" name="boatColor" value={form.boatColor} onChange={update} required />
                    </>)}

                    {/* ── STEP 3: Incident ── */}
                    {step === 2 && (<>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Date of Loss (DD/MM/YYYY)" name="incidentDate" value={form.incidentDate} onChange={update} placeholder="e.g. 02/10/2025" required />
                        <Field label="Approximate Time (HH:MM)" name="incidentTime" value={(form as any).incidentTime ?? ""} onChange={update} placeholder="e.g. 14:20" />
                        <Select
                          label="Was the vessel underway?"
                          name="wasUnderway" value={form.wasUnderway} onChange={update} required
                          options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                        />
                      </div>
                      <Select
                        label="Named / Numbered Storm claim? (Hurricane, Typhoon, Cyclone)"
                        name="isStormClaim" value={form.isStormClaim} onChange={update} required
                        options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                      />
                      {form.isStormClaim === "yes" && (
                        <Field label="Name or Number of Storm" name="stormName" value={form.stormName} onChange={update} required />
                      )}
                      <Field label="Location of Loss" name="location" value={form.location} onChange={update} required placeholder="Port, marina, or GPS coordinates" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Field label="Weather" name="weatherConditions" value={form.weatherConditions} onChange={update} placeholder="e.g. Lightning" />
                        <Field label="Wind Speed (kts)" name="windSpeed" value={form.windSpeed} onChange={update} type="number" />
                        <Field label="Wind Dir (°)" name="windDirection" value={form.windDirection} onChange={update} type="number" />
                        <Select label="Sea State" name="seaCondition" value={form.seaCondition} onChange={update} options={[
                          { value: "calm", label: "Calm" },
                          { value: "slight", label: "Slight" },
                          { value: "moderate", label: "Moderate" },
                          { value: "rough", label: "Rough" },
                          { value: "very-rough", label: "Very Rough" },
                        ]} />
                      </div>
                      {form.wasUnderway === "yes" && (
                        <Field label="Vessel Speed at Time of Loss (knots)" name="vesselSpeed" value={form.vesselSpeed} onChange={update} type="number" />
                      )}
                      <TextArea label="Describe What Happened" name="whatHappened" value={form.whatHappened} onChange={update} required placeholder="Please provide a full account of the incident…" rows={5} />
                    </>)}

                    {/* ── STEP 4: Damage ── */}
                    {step === 3 && (<>
                      <TextArea label="Damage to Vessel" name="vesselDamage" value={form.vesselDamage} onChange={update} required placeholder="Describe all visible and known damage to the vessel…" rows={4} />
                      <TextArea label="Equipment Loss or Damage" name="equipmentDamage" value={form.equipmentDamage} onChange={update} placeholder="List any equipment lost or damaged…" rows={3} />
                      <Select
                        label="Do you have photos or repair estimates?"
                        name="hasPhotos" value={form.hasPhotos} onChange={update}
                        options={[
                          { value: "yes", label: "Yes, available now" },
                          { value: "soon", label: "Will have soon" },
                          { value: "no", label: "Not yet" },
                        ]}
                      />

                      <div className="pt-2" style={{ borderTop: "1px solid rgba(0,151,196,0.15)" }}>
                        <p className="text-[11px] font-mono tracking-wider uppercase mb-5" style={{ color: "#0097c4" }}>Operator Information</p>
                        <div className="flex flex-col gap-5">
                          <Select
                            label="Were you the skipper / operator at the time?"
                            name="wasOperator" value={form.wasOperator} onChange={update}
                            options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                          />
                          {form.wasOperator === "no" && (
                            <Field label="Name of Operator" name="operatorName" value={form.operatorName} onChange={update} required />
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Experience (years)" name="operatorExperience" value={form.operatorExperience} onChange={update} type="number" />
                            <Field label="Boating Qualifications" name="operatorQualifications" value={form.operatorQualifications} onChange={update} placeholder="e.g. RYA Day Skipper" />
                            <Field label="Persons Aboard" name="personsAboard" value={form.personsAboard} onChange={update} type="number" />
                          </div>
                          <Select label="Vessel Use at Time of Loss" name="useType" value={form.useType} onChange={update} options={[
                            { value: "pleasure", label: "Private Pleasure" },
                            { value: "charter", label: "Charter" },
                            { value: "delivery", label: "Delivery" },
                            { value: "racing", label: "Racing" },
                            { value: "other", label: "Other" },
                          ]} />
                        </div>
                      </div>

                      <Field label="Injuries (if any)" name="injuries" value={form.injuries} onChange={update} placeholder="e.g. No injuries — or name and nature of injury" />
                      <TextArea label="Where Can the Vessel Be Seen?" name="boatLocation" value={form.boatLocation} onChange={update} placeholder="Marina name, address, or contact for access…" rows={2} />
                      <TextArea label="Remarks" name="remarks" value={form.remarks} onChange={update} placeholder="Any additional information…" rows={3} />

                      {status === "error" && (
                        <p className="text-sm text-red-400">{errorMsg}</p>
                      )}
                    </>)}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  {step > 0 ? (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      className="text-[11px] font-mono tracking-[0.2em] uppercase transition-colors"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                      onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                    >
                      ← Back
                    </button>
                  ) : (
                    <Link href="/marine" className="text-[11px] font-mono tracking-[0.2em] uppercase transition-opacity" style={{ color: "rgba(255,255,255,0.35)" }}>
                      ← Marine
                    </Link>
                  )}

                  {step < 3 ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      className="px-8 py-3 text-[11px] font-mono tracking-[0.2em] uppercase text-white transition-opacity hover:opacity-80"
                      style={{ background: "#0097c4" }}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={status === "submitting"}
                      className="px-8 py-3 text-[11px] font-mono tracking-[0.2em] uppercase text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#0097c4" }}
                    >
                      {status === "submitting" ? "Submitting…" : "Submit Claim"}
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
