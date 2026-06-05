"use client";

import { useEffect } from "react";

const BUSINESS_ID = "PxaR98auJkN4a0YuTORaiziFo5e2";
const BOOKING_URL = `https://bookapt.io/?widgetBook=1&businessId=${encodeURIComponent(BUSINESS_ID)}`;
const OVERLAY_ID = "bookapt-fullscreen-overlay";

declare global {
  interface Window {
    BookAPTConfig?: {
      businessId: string;
      position: string;
      embedMode: string;
      theme: string;
      buttonText: string;
      buttonColor: string;
      showPoweredBy: boolean;
      hideFloatingButton: boolean;
    };
    bookaptWidget?: {
      openBooking: () => void;
      showWidget: () => void;
      bookService: (serviceId: string, businessId: string) => void;
    };
  }
}

function closeFullscreenBooking() {
  document.getElementById(OVERLAY_ID)?.remove();
  document.body.style.overflow = "";
}

function openFullscreenBooking() {
  if (document.getElementById(OVERLAY_ID)) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;";

  const header = document.createElement("div");
  header.style.cssText =
    "display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#111;border-bottom:1px solid #222;";

  const title = document.createElement("span");
  title.textContent = "Book Appointment";
  title.style.cssText = "color:#fff;font:600 15px/1.2 system-ui,sans-serif;";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close booking");
  closeBtn.textContent = "×";
  closeBtn.style.cssText =
    "border:0;background:transparent;color:#fff;font-size:28px;line-height:1;cursor:pointer;padding:0 4px;";
  closeBtn.onclick = closeFullscreenBooking;

  const iframe = document.createElement("iframe");
  iframe.src = BOOKING_URL;
  iframe.title = "Book Appointment";
  iframe.allow = "payment";
  iframe.style.cssText = "flex:1;width:100%;border:0;background:#fff;";

  header.append(title, closeBtn);
  overlay.append(header, iframe);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
}

function attachOpenBooking() {
  if (!window.bookaptWidget) {
    window.bookaptWidget = {
      openBooking: openFullscreenBooking,
      showWidget: () => {},
      bookService: () => {},
    };
    return;
  }

  window.bookaptWidget.openBooking = openFullscreenBooking;
}

export default function BookingWidget() {
  useEffect(() => {
    window.BookAPTConfig = {
      businessId: BUSINESS_ID,
      position: "button",
      embedMode: "fullscreen",
      theme: "default",
      buttonText: "Book Appointment",
      buttonColor: "#667eea",
      showPoweredBy: true,
      hideFloatingButton: true,
    };

    attachOpenBooking();

    const existing = document.querySelector(
      `script[data-business-id="${BUSINESS_ID}"]`
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src =
      "https://bookapt-payment-api.onrender.com/widget/bookapt-widget.js";
    script.setAttribute("data-business-id", BUSINESS_ID);
    script.async = true;
    script.onload = attachOpenBooking;
    document.body.appendChild(script);

    return () => {
      closeFullscreenBooking();
      const s = document.querySelector(
        `script[data-business-id="${BUSINESS_ID}"]`
      );
      if (s) s.remove();
    };
  }, []);

  return null;
}
