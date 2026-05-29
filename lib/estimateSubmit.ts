import { SHOP_EMAIL } from "@/lib/site";

export type EstimateFormPayload = {
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
};

export function createEstimateReferenceId() {
  return `EST-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export function buildEstimateMailtoUrl(data: EstimateFormPayload, referenceId: string) {
  const subject = `Estimate Request — ${data.name} · ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`;
  const body = [
    `Reference: ${referenceId}`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    "",
    `Vehicle: ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
    `License Plate: ${data.licensePlate}`,
    `VIN: ${data.vin || "Not provided"}`,
    `Service: ${data.serviceNeeded}`,
    "",
    `Message:`,
    data.message || "—",
  ].join("\n");

  return `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Free FormSubmit — one-time activation link in inbox, no paid plan. */
export async function submitEstimateViaFormSubmit(
  data: EstimateFormPayload,
  referenceId: string
): Promise<{ ok: true } | { ok: false; message: string; needsActivation: boolean }> {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SHOP_EMAIL)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _captcha: false,
      _template: "table",
      _subject: `New Estimate Request — ${data.name} · ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
      reference_id: referenceId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      vehicle_year: data.vehicleYear,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      vin: data.vin || "Not provided",
      license_plate: data.licensePlate,
      service_needed: data.serviceNeeded,
      message: data.message || "—",
    }),
  });

  const result = await res.json();
  const message = typeof result.message === "string" ? result.message : "";

  if (res.ok && result.success === "true") {
    return { ok: true };
  }

  const needsActivation = /activation|activate form/i.test(message);
  return { ok: false, message, needsActivation };
}
