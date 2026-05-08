import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail, referenceId, vehicle, serviceNeeded, message } =
      await request.json();

    if (!customerEmail || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Customer email and message are required." },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#0EA5E9;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;color:#ffffff;letter-spacing:2px;">C.A.R.S.</h1>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;">Complete Auto Repair Specialist</p>
        </div>

        <div style="padding:32px;">
          <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Re: Estimate Request — <strong style="font-family:monospace;color:#0EA5E9;">${referenceId}</strong></p>
          <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">${vehicle} · ${serviceNeeded}</p>

          <p style="margin:0 0 16px;color:#111827;font-size:15px;">Hi ${customerName},</p>

          <div style="background:#f9fafb;border-left:3px solid #0EA5E9;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#1f2937;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>

          <p style="margin:0 0 4px;color:#374151;font-size:14px;font-weight:600;">C.A.R.S. Team</p>
          <p style="margin:0;color:#6b7280;font-size:13px;">Complete Auto Repair Specialist</p>

          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              📞 <a href="tel:+12483472021" style="color:#0EA5E9;text-decoration:none;">(248) 347-2021</a> &nbsp;·&nbsp;
              ✉️ <a href="mailto:carsofnovi@gmail.com" style="color:#0EA5E9;text-decoration:none;">carsofnovi@gmail.com</a>
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">24400 Novi Rd #102, Novi, MI 48375</p>
          </div>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "C.A.R.S. <onboarding@resend.dev>", // TODO: change to noreply@yourdomain.com once domain verified in Resend
      to: customerEmail,
      replyTo: "carsofnovi@gmail.com",
      subject: `Re: Your Estimate Request — ${referenceId}`,
      html,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
