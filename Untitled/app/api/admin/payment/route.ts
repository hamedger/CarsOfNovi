import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const {
      customerName,
      customerEmail,
      referenceId,
      vehicle,
      serviceNeeded,
      amount,
      note,
      paymentLink,
    } = await request.json();

    if (!customerEmail || !paymentLink?.trim() || !amount) {
      return NextResponse.json(
        { success: false, message: "Customer email, amount, and payment link are required." },
        { status: 400 }
      );
    }

    const formattedAmount = Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#0EA5E9;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;color:#ffffff;letter-spacing:2px;">C.A.R.S.</h1>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;">Complete Auto Repair Specialist</p>
        </div>

        <div style="padding:32px;">
          <h2 style="margin:0 0 6px;font-size:20px;color:#111827;">Invoice Ready for Payment</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Reference: <strong style="font-family:monospace;color:#0EA5E9;">${referenceId}</strong></p>

          <p style="margin:0 0 20px;color:#374151;font-size:15px;">Hi ${customerName},</p>
          <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.6;">
            Your vehicle service has been completed. Please use the link below to securely pay your invoice.
          </p>

          <!-- Invoice summary -->
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Vehicle</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;text-align:right;font-weight:600;">${vehicle}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Service</td>
                <td style="padding:6px 0;color:#111827;font-size:13px;text-align:right;">${serviceNeeded}</td>
              </tr>
              ${note ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;vertical-align:top;">Note</td>
                <td style="padding:6px 0;color:#374151;font-size:13px;text-align:right;">${note}</td>
              </tr>` : ""}
              <tr>
                <td colspan="2" style="border-top:1px solid #e5e7eb;padding-top:12px;margin-top:8px;"></td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#111827;font-size:15px;font-weight:700;">Total Due</td>
                <td style="padding:4px 0;color:#0EA5E9;font-size:20px;font-weight:700;text-align:right;">${formattedAmount}</td>
              </tr>
            </table>
          </div>

          <!-- Pay button -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${paymentLink}"
               style="display:inline-block;background:#0EA5E9;color:#ffffff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">
              Pay Now — ${formattedAmount}
            </a>
          </div>

          <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-align:center;">
            Button not working? Copy and paste this link into your browser:
          </p>
          <p style="margin:0 0 24px;font-size:11px;color:#9ca3af;text-align:center;word-break:break-all;">
            ${paymentLink}
          </p>

          <div style="padding-top:20px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              Questions? Call us at
              <a href="tel:+15555550100" style="color:#0EA5E9;text-decoration:none;">(555) 555-0100</a>
              or reply to this email.
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">123 Auto Drive, Detroit, MI 48201</p>
          </div>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "C.A.R.S. <onboarding@resend.dev>",
      to: customerEmail,
      replyTo: "carsofnovi@gmail.com",
      subject: `Your Invoice is Ready — ${formattedAmount} · ${referenceId}`,
      html,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
