"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import {
  formatHolidayDate,
  getActiveHolidayClosure,
  getDismissStorageKey,
  type HolidayClosure,
} from "@/lib/holidays";

export default function HolidayNotice() {
  const [holiday, setHoliday] = useState<HolidayClosure | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const active = getActiveHolidayClosure();
    if (!active) return;
    if (localStorage.getItem(getDismissStorageKey(active.id)) === "1") return;
    setHoliday(active);
    setVisible(true);
  }, []);

  const dismiss = () => {
    if (!holiday) return;
    localStorage.setItem(getDismissStorageKey(holiday.id), "1");
    setVisible(false);
  };

  if (!visible || !holiday) return null;

  const dateLabel = formatHolidayDate(holiday.date);
  const isPatriotic =
    holiday.name.includes("Memorial") ||
    holiday.name.includes("Independence") ||
    holiday.name.includes("Labor");

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-[#0c1a2e]/95 via-[#0a0a0a]/95 to-[#1a0c12]/95 backdrop-blur-sm shadow-lg shadow-black/40"
    >
      {isPatriotic && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[8%] top-2 text-red-500/25 text-lg">★</span>
          <span className="absolute right-[10%] top-3 text-[#0EA5E9]/30 text-sm">★</span>
          <span className="absolute left-[22%] bottom-1 text-white/15 text-xs">★</span>
          <span className="absolute right-[24%] bottom-2 text-red-500/20 text-base">★</span>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" />
        </div>
      )}

      <div className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-5 px-4 py-3.5 sm:px-5 sm:py-4 pr-10 sm:pr-12">
        <Image
          src="/logo.png"
          alt=""
          width={56}
          height={56}
          aria-hidden
          className="hidden sm:block h-12 w-auto object-contain flex-shrink-0 opacity-90"
        />

        <div className="text-center sm:text-left flex-1 min-w-0">
          <p className="font-display text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#93c5fd]/90">
            {holiday.observanceLabel ?? `In Observance of ${holiday.name}`}
          </p>
          <p className="mt-1 font-display text-lg sm:text-xl font-bold tracking-wide text-white">
            We Will Be <span className="text-[#EF4444]">Closed</span>
            <span className="text-white/80 font-semibold text-base sm:text-lg">
              {" "}
              — {dateLabel}
            </span>
          </p>
          {holiday.footerText && (
            <p className="mt-1 text-xs sm:text-sm text-gray-400 tracking-wide">
              {holiday.footerText}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss holiday notice"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
