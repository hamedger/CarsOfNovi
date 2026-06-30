import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "cars_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

async function deriveToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("cars-admin-session"));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ success: false, message: "Server misconfiguration." }, { status: 500 });
  }

  if (!password || password !== adminPassword) {
    // Small delay to slow brute-force
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ success: false, message: "Incorrect password." }, { status: 401 });
  }

  const token = await deriveToken(adminPassword);
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
