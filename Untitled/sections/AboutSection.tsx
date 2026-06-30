"use client";

import { motion } from "framer-motion";
import { Award, Users, ThumbsUp, Clock } from "lucide-react";

const stats = [
  { icon: Clock, value: "20+", label: "Years Serving Community" },
  { icon: Award, value: "25+", label: "Years of Experience" },
  { icon: Users, value: "8,000+", label: "Vehicles Serviced" },
  { icon: Award, value: "ASE", label: "Certified Mechanics" },
  { icon: ThumbsUp, value: "100%", label: "Quality Guarantee" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left — image / visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="/about-us-office.png"
                alt="C.A.R.S. team member at front desk"
                className="w-full h-full object-cover object-[center_22%] sm:object-[center_26%] contrast-110 saturate-110 scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/15 to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#0EA5E9] rounded-2xl px-6 py-5 shadow-2xl shadow-[#0EA5E9]/30"
            >
              <p className="text-white font-display font-bold text-4xl leading-none">20+</p>
              <p className="text-white/80 text-xs mt-1">Years Serving</p>
              <p className="text-white/80 text-xs">the Community</p>
            </motion.div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#0EA5E9] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              About Us
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Your Trusted
              <br />
              <span className="text-[#0EA5E9]">Auto Care</span> Partner
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-5">
              C.A.R.S. (Complete Auto Repair Specialist) has been serving drivers in
              Novi and surrounding communities for over 20 years. Our team of ASE-certified
              mechanics brings decades of combined experience to every vehicle that rolls
              through our doors. Led by trusted mechanic DJ Pilloci, we treat every car like
              it belongs to our own family and every customer like a neighbor.
            </p>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              We believe in transparent pricing, honest assessments, and repairs done right
              the first time. Whether you drive a domestic sedan or a European import, we
              have the tools, training, and passion to get you back on the road safely. From
              preventative maintenance and diagnostics to major repairs, our process is built
              around clear communication, dependable timelines, and workmanship you can trust.
              Our mission is simple: keep Novi families driving with confidence every day.
            </p>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-4"
                >
                  <div className="w-9 h-9 bg-[#0EA5E9]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#0EA5E9]" />
                  </div>
                  <div>
                    <p className="text-white font-display font-bold text-xl leading-none mb-0.5">
                      {value}
                    </p>
                    <p className="text-gray-500 text-xs leading-snug">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
