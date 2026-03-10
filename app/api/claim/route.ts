import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  try {
    const d = await req.json()

    if (!d.claimantName || !d.email || !d.mobile) {
      return NextResponse.json({ error: "Name, email and mobile are required." }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const row = (label: string, value: string) =>
      value
        ? `<tr>
            <td style="padding:6px 0;color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;width:190px;vertical-align:top">${label}</td>
            <td style="padding:6px 0;font-size:14px">${value}</td>
           </tr>`
        : ""

    const section = (title: string) =>
      `<tr><td colspan="2" style="padding:18px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#0097c4;border-top:1px solid #edf2f6">${title}</td></tr>`

    const html = `
      <div style="font-family:sans-serif;max-width:700px;margin:0 auto;color:#1e2a3a">
        <div style="background:#0097c4;padding:20px 32px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px;font-weight:500;letter-spacing:0.05em">
            GLINSO Marine — New Claim Submission
          </h1>
        </div>
        <div style="background:#fff;border:1px solid #e8ecf0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            ${section("Contact Information")}
            ${row("Claimant Name", d.claimantName)}
            ${row("Policyholder", d.policyHolderName || d.claimantName)}
            ${row("Address", d.address)}
            ${row("Mobile", d.mobile)}
            ${row("Email", d.email)}
            ${section("Vessel Details")}
            ${row("Policy Number", d.policyNumber)}
            ${row("Boat Name", d.boatName)}
            ${row("Name on Exterior", d.boatNameMarked)}
            ${row("Year / Make / Model / Length", d.boatDetails)}
            ${row("Colour", d.boatColor)}
            ${section("Incident Details")}
            ${row("Date of Loss", d.incidentDate)}
            ${d.incidentTime ? row("Approximate Time", d.incidentTime) : ""}
            ${row("Vessel Underway", d.wasUnderway)}
            ${row("Storm / Named Event", d.isStormClaim)}
            ${d.stormName ? row("Storm Name / Number", d.stormName) : ""}
            ${row("Location of Loss", d.location)}
            ${row("Weather Conditions", d.weatherConditions)}
            ${row("Wind Speed", d.windSpeed ? d.windSpeed + " kts" : "")}
            ${row("Wind Direction", d.windDirection ? d.windDirection + "°" : "")}
            ${row("Sea State", d.seaCondition)}
            ${d.vesselSpeed ? row("Vessel Speed", d.vesselSpeed + " kts") : ""}
          </table>
          <p style="color:#6b7a8f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:16px 0 6px;border-top:1px solid #edf2f6;padding-top:16px">What Happened</p>
          <p style="font-size:14px;line-height:1.7;white-space:pre-line;margin:0 0 16px">${d.whatHappened}</p>
          <p style="color:#6b7a8f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px">Damage to Vessel</p>
          <p style="font-size:14px;line-height:1.7;white-space:pre-line;margin:0 0 16px">${d.vesselDamage}</p>
          ${d.equipmentDamage ? `<p style="color:#6b7a8f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px">Equipment Loss / Damage</p><p style="font-size:14px;line-height:1.7;white-space:pre-line;margin:0 0 16px">${d.equipmentDamage}</p>` : ""}
          <table style="width:100%;border-collapse:collapse">
            ${section("Operator & Additional")}
            ${row("Photos / Estimates", d.hasPhotos)}
            ${row("Was Operator", d.wasOperator)}
            ${d.operatorName ? row("Operator Name", d.operatorName) : ""}
            ${row("Experience", d.operatorExperience ? d.operatorExperience + " years" : "")}
            ${row("Qualifications", d.operatorQualifications)}
            ${row("Persons Aboard", d.personsAboard)}
            ${row("Vessel Use", d.useType)}
            ${row("Injuries", d.injuries)}
            ${row("Vessel Location", d.boatLocation)}
          </table>
          ${d.remarks ? `<p style="color:#6b7a8f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:16px 0 6px;border-top:1px solid #edf2f6;padding-top:16px">Remarks</p><p style="font-size:14px;line-height:1.7;white-space:pre-line;margin:0">${d.remarks}</p>` : ""}
        </div>
      </div>
    `

    const { error: teamError } = await resend.emails.send({
      from: "GLINSO Marine Claims <noreply@glinso.ae>",
      to: process.env.CONTACT_TO ?? "anatolyavbme@gmail.com",
      replyTo: d.email,
      subject: `Marine Claim — ${d.boatName || d.claimantName}`,
      html,
    })

    if (teamError) {
      console.error("[claim] Resend error:", JSON.stringify(teamError))
      return NextResponse.json({ error: teamError.message }, { status: 500 })
    }

    // Auto-reply to claimant
    await resend.emails.send({
      from: "GLINSO Marine Claims <noreply@glinso.ae>",
      to: d.email,
      subject: "Your marine claim has been received — GLINSO",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e2a3a">
          <div style="background:#0097c4;padding:20px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:500">GLINSO Marine</h1>
          </div>
          <div style="background:#fff;border:1px solid #e8ecf0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
            <p style="font-size:15px;margin:0 0 16px">Dear ${d.claimantName},</p>
            <p style="font-size:15px;line-height:1.7;margin:0 0 16px">
              We have received your marine claim for <strong>${d.boatName || "your vessel"}</strong>. Our claims team will review your submission and contact you within <strong>24 hours</strong>.
            </p>
            <p style="font-size:15px;line-height:1.7;margin:0 0 32px">
              For urgent matters, please contact us directly at <a href="mailto:team@glinso.ae" style="color:#0097c4">team@glinso.ae</a>.
            </p>
            <p style="font-size:12px;color:#6b7a8f;margin:0">GLINSO Brokers FZE · Ras Al Khaimah, UAE</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[claim] exception:", err?.message ?? err)
    return NextResponse.json({ error: "Failed to submit claim. Please try again." }, { status: 500 })
  }
}
