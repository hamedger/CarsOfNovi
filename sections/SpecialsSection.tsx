"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Printer, Scissors, Tag, Clock, CheckCircle } from "lucide-react";

interface Coupon {
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

function printCoupon(coupon: Coupon) {
  const win = window.open("", "_blank", "width=620,height=440");
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html><html><head>
      <title>C.A.R.S. Coupon — ${coupon.subtitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Inter,Arial,sans-serif;background:#fff;padding:32px}
        .coupon{border:3px dashed #0EA5E9;border-radius:16px;padding:32px;max-width:520px;margin:0 auto;position:relative}
        .scissors{position:absolute;top:-14px;left:16px;background:#fff;padding:0 8px;font-size:18px;color:#0EA5E9}
        .logo{font-size:28px;font-weight:700;letter-spacing:4px;color:#000}
        .logo span{color:#0EA5E9}
        .tagline{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:2px;margin-top:2px}
        hr{border:none;border-top:1px solid #e5e7eb;margin:20px 0}
        .offer{font-size:48px;font-weight:700;color:${coupon.accent};line-height:1}
        .offer-sub{font-size:20px;font-weight:600;color:#111;margin-top:4px}
        .desc{font-size:13px;color:#4b5563;margin-top:8px;line-height:1.5}
        .code-row{display:flex;align-items:center;gap:12px;margin-top:20px}
        .code-label{font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px}
        .code{font-family:monospace;font-size:18px;font-weight:700;background:#f3f4f6;border:1px solid #e5e7eb;padding:6px 14px;border-radius:6px;color:#111;letter-spacing:2px}
        .footer{margin-top:20px;display:flex;justify-content:space-between;align-items:flex-end}
        .terms{font-size:10px;color:#9ca3af;max-width:300px;line-height:1.4}
        .expires{font-size:12px;color:#6b7280;text-align:right}
        .expires strong{display:block;color:#ef4444;font-size:13px}
        .contact{margin-top:16px;padding-top:16px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;text-align:center}
        @media print{body{padding:16px}}
      </style>
    </head><body>
      <div class="coupon">
        <div class="scissors">✂</div>
        <div class="logo">C<span>.</span>A<span>.</span>R<span>.</span>S<span>.</span></div>
        <div class="tagline">Complete Auto Repair Specialist — Committed to Excellence</div>
        <hr/>
        <div class="offer">${coupon.title}</div>
        <div class="offer-sub">${coupon.subtitle}</div>
        <div class="desc">${coupon.description}</div>
        <div class="code-row">
          <span class="code-label">Coupon Code</span>
          <span class="code">${coupon.code}</span>
        </div>
        <div class="footer">
          <div class="terms">${coupon.terms}</div>
          <div class="expires">Expires<strong>${coupon.expires}</strong></div>
        </div>
        <div class="contact">(555) 555-0100 · 123 Auto Drive, Detroit, MI 48201 · carsofnovi@gmail.com</div>
      </div>
      <script>window.onload=()=>window.print()<\/script>
    </body></html>
  `);
  win.document.close();
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SpecialsSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then(setCoupons)
      .catch(() => {});
  }, []);

  if (coupons.length === 0) return null;

  return (
    <section id="specials" className="relative py-24 bg-black">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#0EA5E9] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Limited Time Offers
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Specials & Coupons
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Print a coupon or show it on your phone at the counter. One coupon per visit.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              variants={cardVariants}
              className="group relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#1F1F1F] hover:border-[#0EA5E9]/30 transition-colors duration-300"
            >
              <div className="h-1 w-full" style={{ background: coupon.accent }} />

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${coupon.accent}18`, color: coupon.accent }}
                  >
                    {coupon.badge}
                  </span>
                  <Tag size={14} className="text-gray-600" />
                </div>

                <p className="font-display text-5xl font-bold leading-none mb-1" style={{ color: coupon.accent }}>
                  {coupon.title}
                </p>
                <p className="text-white font-semibold text-base mb-3">{coupon.subtitle}</p>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{coupon.description}</p>

                <div className="mt-4 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider">Code</span>
                  <span className="font-mono text-sm font-bold text-white tracking-widest">{coupon.code}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                  <Clock size={11} />
                  Expires {coupon.expires}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => printCoupon(coupon)}
                    className="flex items-center justify-center gap-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    <Printer size={13} />
                    Print
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => document.querySelector("#estimate")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex items-center justify-center gap-1.5 bg-[#111] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    <CheckCircle size={13} />
                    Redeem
                  </motion.button>
                </div>
              </div>

              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Scissors size={12} className="shrink-0" />
                  <div className="flex-1 border-t border-dashed border-gray-800" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 text-xs mt-8"
        >
          Present coupon at time of service. Cannot be combined with other offers. One per visit.
        </motion.p>
      </div>
    </section>
  );
}
