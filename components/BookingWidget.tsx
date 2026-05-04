"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    BookAPTConfig?: {
      businessId: string;
      position: string;
      theme: string;
      buttonText: string;
      buttonColor: string;
      showPoweredBy: boolean;
    };
    bookaptWidget?: {
      showWidget: () => void;
      bookService: (serviceId: string, businessId: string) => void;
    };
    openBookingWidget?: () => void;
  }
}

export default function BookingWidget() {
  useEffect(() => {
    window.BookAPTConfig = {
      businessId: "PxaR98auJkN4a0YuTORaiziFo5e2",
      position: "floating",
      theme: "default",
      buttonText: "Book Appointment",
      buttonColor: "#667eea",
      showPoweredBy: true,
    };

    const existing = document.querySelector(
      'script[data-business-id="PxaR98auJkN4a0YuTORaiziFo5e2"]'
    );
    if (existing) return;

    // Expose a global helper other components can call
    window.openBookingWidget = () => {
      if (window.bookaptWidget?.showWidget) {
        window.bookaptWidget.showWidget();
        return;
      }
      // Fallback: click the floating button the widget renders
      const btn = document.querySelector<HTMLElement>('.bookapt-float-btn, [class*="bookapt-btn"]');
      btn?.click();
    };

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
      delete window.openBookingWidget;
    };
  }, []);

  return null;
}
