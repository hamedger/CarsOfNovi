import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EstimateEmailData {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  licensePlate: string;
  serviceNeeded: string;
  message: string;
  submittedAt: string;
}

export async function sendEstimateEmail(data: EstimateEmailData) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:12px;overflow:hidden;">
      <div style="background:#0EA5E9;padding:24px 32px;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;letter-spacing:2px;">C.A.R.S.</h1>
        <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:1px;">Complete Auto Repair Specialist</p>
      </div>

      <div style="padding:32px;">
        <h2 style="margin:0 0 8px;font-size:20px;color:#ffffff;">New Estimate Request</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Reference ID: <strong style="color:#0EA5E9;font-family:monospace;">${data.id}</strong></p>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;width:40%;">Customer</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#ffffff;font-size:14px;font-weight:600;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#ffffff;font-size:14px;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#0EA5E9;font-size:14px;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;">Vehicle</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#ffffff;font-size:14px;">${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;">License Plate</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#ffffff;font-size:14px;">${data.licensePlate}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;">VIN</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#ffffff;font-size:14px;">${data.vin || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;">Service</td>
            <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;color:#ffffff;font-size:14px;font-weight:600;">${data.serviceNeeded}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#9ca3af;font-size:13px;vertical-align:top;">Submitted</td>
            <td style="padding:10px 0;color:#ffffff;font-size:14px;">${new Date(data.submittedAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</td>
          </tr>
        </table>

        ${data.message ? `
        <div style="margin-top:24px;background:#111111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;">
          <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Customer Message</p>
          <p style="margin:0;color:#e5e7eb;font-size:14px;line-height:1.6;">${data.message}</p>
        </div>` : ""}

        <div style="margin-top:28px;padding:16px;border-left:3px solid #0EA5E9;border-radius:4px;">
          <p style="margin:0;font-size:13px;color:#9ca3af;">Reply directly to this email to contact the customer, or call <strong style="color:#ffffff;">${data.phone}</strong>.</p>
        </div>
      </div>

      <div style="padding:16px 32px;border-top:1px solid #1f1f1f;text-align:center;">
        <p style="margin:0;color:#4b5563;font-size:12px;">C.A.R.S. — Complete Auto Repair Specialist · carsofnovi@gmail.com</p>
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: "C.A.R.S. Website <onboarding@resend.dev>", // Update to noreply@yourdomain.com once domain verified
    to: "info@orynsolutions.io", // Switch to carsofnovi@gmail.com once domain is verified in Resend
    replyTo: data.email,
    subject: `New Estimate Request — ${data.name} · ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
    html,
  });

  if (error) throw new Error(error.message);
}
