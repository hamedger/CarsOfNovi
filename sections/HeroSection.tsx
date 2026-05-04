"use client";

import { motion } from "framer-motion";
import { ChevronDown, Calendar, FileText, Shield, Clock, Star } from "lucide-react";
import Image from "next/image";

const badges = [
  { icon: Shield, label: "ASE Certified" },
  { icon: Clock, label: "Same Day Service" },
  { icon: Star, label: "5-Star Rated" },
];

export default function HeroSection() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />

      {/* Blue glow behind logo */}
      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#0EA5E9]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-[72px]">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 min-h-[calc(100vh-72px)] py-8 lg:py-0">

          {/* LEFT — Logo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-shrink-0 flex items-center justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#0EA5E9]/20 blur-2xl scale-110" />
              <Image
                src="/logo.png"
                alt="C.A.R.S. Complete Auto Repair Specialist"
                width={280}
                height={280}
                className="relative rounded-full object-cover shadow-2xl shadow-black/60 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px]"
                priority
              />
            </div>
          </motion.div>

          {/* RIGHT — Text + CTAs */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            >
              <span className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full animate-pulse" />
              Novi&apos;s Premier Auto Repair Shop
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.92] mb-4"
            >
              COMPLETE
              <br />
              <span className="text-[#0EA5E9]">AUTO REPAIR</span>
              <br />
              SPECIALIST
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-300 text-base sm:text-lg max-w-md mb-7 font-light tracking-wide"
            >
              Committed to Excellence — Expert mechanics you can trust, results you can see.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("#estimate")}
                className="flex items-center justify-center gap-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/25"
              >
                <FileText size={18} />
                Request Estimate
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.openBookingWidget?.()}
                className="flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all backdrop-blur-sm"
              >
                <Calendar size={18} />
                Book Appointment
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
            >
              {badges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon size={15} className="text-[#0EA5E9]" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => scrollTo("#services")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-gray-500 hover:text-[#0EA5E9] transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={26} />
        </motion.div>
      </motion.button>
    </section>
  );
}
