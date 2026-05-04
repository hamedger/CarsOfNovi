import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COUPONS_FILE = path.join(process.cwd(), "data", "coupons.json");

export interface Coupon {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  code: string;
  terms: string;
  expires: string;
  accent: string;
  active: boolean;
}

function readCoupons(): Coupon[] {
  try {
    return JSON.parse(fs.readFileSync(COUPONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeCoupons(coupons: Coupon[]) {
  fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

// GET — return active coupons (or all if ?all=true)
export async function GET(request: NextRequest) {
  const all = request.nextUrl.searchParams.get("all") === "true";
  const coupons = readCoupons();
  return NextResponse.json(all ? coupons : coupons.filter((c) => c.active));
}

// POST — create new coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const coupons = readCoupons();

    const errors: Record<string, string> = {};
    if (!body.title?.trim()) errors.title = "Title is required.";
    if (!body.subtitle?.trim()) errors.subtitle = "Subtitle is required.";
    if (!body.code?.trim()) errors.code = "Coupon code is required.";
    if (!body.expires?.trim()) errors.expires = "Expiry date is required.";
    if (coupons.find((c) => c.code === body.code?.trim().toUpperCase()))
      errors.code = "Coupon code already exists.";

    if (Object.keys(errors).length > 0)
      return NextResponse.json({ success: false, errors }, { status: 400 });

    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      badge: body.badge?.trim() || "Special Offer",
      title: body.title.trim(),
      subtitle: body.subtitle.trim(),
      description: body.description?.trim() || "",
      code: body.code.trim().toUpperCase(),
      terms: body.terms?.trim() || "One coupon per visit. Cannot combine with other offers.",
      expires: body.expires.trim(),
      accent: body.accent || "#0EA5E9",
      active: body.active !== false,
    };

    coupons.push(newCoupon);
    writeCoupons(coupons);

    return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

// PUT — update existing coupon
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const coupons = readCoupons();
    const idx = coupons.findIndex((c) => c.id === body.id);
    if (idx === -1)
      return NextResponse.json({ success: false, message: "Coupon not found." }, { status: 404 });

    coupons[idx] = { ...coupons[idx], ...body };
    writeCoupons(coupons);

    return NextResponse.json({ success: true, coupon: coupons[idx] });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

// DELETE — remove coupon by id
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const coupons = readCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    if (filtered.length === coupons.length)
      return NextResponse.json({ success: false, message: "Coupon not found." }, { status: 404 });

    writeCoupons(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
