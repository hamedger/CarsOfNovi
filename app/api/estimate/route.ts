import { NextRequest, NextResponse } from "next/server";
import { sendEstimateEmail } from "@/lib/mailer";
import { appendEstimateToSheet, getEstimatesFromSheet } from "@/lib/googleSheets";

export interface EstimateSubmission {
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
  adminResponse?: string;
  respondedAt?: string;
  submittedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      email,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      vin,
      licensePlate,
      serviceNeeded,
      message,
    } = body;

    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    if (!phone || !/^\+?[\d\s\-()]{7,15}$/.test(phone)) errors.phone = "Please enter a valid phone number.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
    if (!vehicleYear || isNaN(Number(vehicleYear)) || Number(vehicleYear) < 1980 || Number(vehicleYear) > new Date().getFullYear() + 1)
      errors.vehicleYear = "Please enter a valid vehicle year.";
    if (!vehicleMake || vehicleMake.trim().length < 2) errors.vehicleMake = "Please enter the vehicle make.";
    if (!vehicleModel || vehicleModel.trim().length < 1) errors.vehicleModel = "Please enter the vehicle model.";
    if (!licensePlate || licensePlate.trim().length < 2) errors.licensePlate = "Please enter a valid license plate.";
    if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin.trim())) errors.vin = "VIN must be 17 characters (letters and numbers).";
    if (!serviceNeeded) errors.serviceNeeded = "Please select a service.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const submission: EstimateSubmission = {
      id: `EST-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      vehicleYear: vehicleYear.trim(),
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      vin: vin?.trim().toUpperCase() || "",
      licensePlate: licensePlate.trim().toUpperCase(),
      serviceNeeded,
      message: message?.trim() || "",
      submittedAt: new Date().toISOString(),
    };

    await appendEstimateToSheet({
      referenceId: submission.id,
      name: submission.name,
      phone: submission.phone,
      email: submission.email,
      vehicleYear: submission.vehicleYear,
      vehicleMake: submission.vehicleMake,
      vehicleModel: submission.vehicleModel,
      vin: submission.vin,
      licensePlate: submission.licensePlate,
      serviceNeeded: submission.serviceNeeded,
      customerMessage: submission.message,
      submittedAt: submission.submittedAt,
    });

    // Send email notification — non-blocking so a mail failure doesn't break the response
    sendEstimateEmail(submission).catch((err) =>
      console.error("[estimate] email send failed:", err)
    );

    return NextResponse.json(
      {
        success: true,
        message: "Your estimate request has been received. We will contact you shortly.",
        referenceId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[estimate] failed to save submission:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rows = await getEstimatesFromSheet();
    const submissions: EstimateSubmission[] = rows.map((row) => ({
      id: row.referenceId,
      name: row.name,
      phone: row.phone,
      email: row.email,
      vehicleYear: row.vehicleYear,
      vehicleMake: row.vehicleMake,
      vehicleModel: row.vehicleModel,
      vin: row.vin,
      licensePlate: row.licensePlate,
      serviceNeeded: row.serviceNeeded,
      message: row.customerMessage,
      adminResponse: row.adminResponse,
      respondedAt: row.respondedAt,
      submittedAt: row.submittedAt,
    }));

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("[estimate] failed to read submissions:", error);
    return NextResponse.json({ submissions: [] }, { status: 200 });
  }
}
