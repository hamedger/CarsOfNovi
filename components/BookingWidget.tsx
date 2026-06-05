"use client";

import { useEffect } from "react";

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
      bookService: (serviceId: string, businessId: string) => void;
    };
  }
}

export default function BookingWidget() {
  useEffect(() => {
    window.BookAPTConfig = {
      businessId: "PxaR98auJkN4a0YuTORaiziFo5e2",
      position: "button",
      embedMode: "fullscreen",
      theme: "default",
      buttonText: "Book Appointment",
      buttonColor: "#667eea",
      showPoweredBy: true,
      hideFloatingButton: true,
    };

    const existing = document.querySelector(
      'script[data-business-id="PxaR98auJkN4a0YuTORaiziFo5e2"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src =
      "https://bookapt-payment-api.onrender.com/widget/bookapt-widget.js";
    script.setAttribute("data-business-id", "PxaR98auJkN4a0YuTORaiziFo5e2");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const s = document.querySelector(
        'script[data-business-id="PxaR98auJkN4a0YuTORaiziFo5e2"]'
      );
      if (s) s.remove();
    };
  }, []);

  return null;
}
