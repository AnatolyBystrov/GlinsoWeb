import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, phone, service, message } = await req.json()

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const serviceLabels: Record<string, string> = {
      treaty: "Treaty Reinsurance",
      facultative: "Facultative Placement",
      capital: "Capital Structuring",
      analytics: "Analytics & Modelling",
      advisory: "Strategic Advisory",
    }

    // ── Email to GLINSO team ──────────────────────────────────────────
    const { data: teamData, error: teamError } = await resend.emails.send({
      from: "GLINSO Website <noreply@glinso.ae>",
      to: process.env.CONTACT_TO ?? "team@glinso.ae",
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` · ${company}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e2a3a">
          <div style="background:#f5821f;padding:20px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:500;letter-spacing:0.05em">
              New contact form submission
            </h1>
          </div>
          <div style="background:#fff;border:1px solid #e8ecf0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;width:120px">Name</td><td style="padding:8px 0;font-size:15px">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Email</td><td style="padding:8px 0;font-size:15px"><a href="mailto:${email}" style="color:#f5821f">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Company</td><td style="padding:8px 0;font-size:15px">${company}</td></tr>` : ""}
              ${phone ? `<tr><td style="padding:8px 0;color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Phone</td><td style="padding:8px 0;font-size:15px">${phone}</td></tr>` : ""}
              ${service ? `<tr><td style="padding:8px 0;color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Service</td><td style="padding:8px 0;font-size:15px">${serviceLabels[service] ?? service}</td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #e8ecf0;margin:24px 0" />
            <p style="color:#6b7a8f;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px">Message</p>
            <p style="font-size:15px;line-height:1.7;white-space:pre-line;margin:0">${message}</p>
          </div>
        </div>
      `,
    })

    if (teamError) {
      console.error("[contact] Resend error (team email):", JSON.stringify(teamError))
      return NextResponse.json({ error: teamError.message }, { status: 500 })
    }
    console.log("[contact] team email sent:", teamData?.id)

    // ── Auto-reply to sender ──────────────────────────────────────────
    const { error: replyError } = await resend.emails.send({
      from: "GLINSO Brokers <noreply@glinso.ae>",
      to: email,
      subject: "We received your message — GLINSO Brokers",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e2a3a">
          <div style="background:#f5821f;padding:20px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:500">GLINSO Brokers</h1>
          </div>
          <div style="background:#fff;border:1px solid #e8ecf0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
            <p style="font-size:15px;margin:0 0 16px">Dear ${name},</p>
            <p style="font-size:15px;line-height:1.7;margin:0 0 16px">
              Thank you for reaching out to GLINSO Brokers. We have received your enquiry and our team will respond within <strong>24 hours</strong>.
            </p>
            <p style="font-size:15px;line-height:1.7;margin:0 0 32px">
              For urgent matters, please contact us directly at <a href="mailto:team@glinso.ae" style="color:#f5821f">team@glinso.ae</a>.
            </p>
            <p style="font-size:12px;color:#6b7a8f;margin:0">GLINSO Brokers FZE · Ras Al Khaimah, UAE</p>
          </div>
        </div>
      `,
    })

    if (replyError) console.warn("[contact] auto-reply warning:", JSON.stringify(replyError))

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[contact] exception:", err?.message ?? err)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
