"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  Activity,
  CircleDot,
  ArrowUpDown,
  Droplets,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Engine Repair",
    description:
      "Complete engine diagnostics, rebuild, and repair. From minor tune-ups to full overhauls — we keep your engine running at peak performance.",
  },
  {
    icon: Activity,
    title: "Diagnostics",
    description:
      "State-of-the-art OBD-II scanning and multi-point inspection to identify issues before they become costly problems.",
  },
  {
    icon: CircleDot,
    title: "Brake Service",
    description:
      "Brake pad replacement, rotor resurfacing, caliper service, and brake fluid flush. Your safety is our priority.",
  },
  {
    icon: ArrowUpDown,
    title: "Suspension",
    description:
      "Shocks, struts, ball joints, tie rods, and alignment. Restore the smooth, confident ride your vehicle was designed for.",
  },
  {
    icon: Droplets,
    title: "Oil Change",
    description:
      "Full synthetic, synthetic blend, and conventional oil changes with multi-point inspection. Fast, clean, and reliable.",
  },
  {
    icon: Zap,
    title: "Electrical",
    description:
      "Battery, alternator, starter, wiring, and lighting repairs. We diagnose and fix complex electrical faults with precision.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 bg-black">
      {/* Top edge accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#0EA5E9] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            What We Do
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            From routine maintenance to complex repairs, our certified technicians handle it all with precision and care.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-7 cursor-default overflow-hidden hover:border-[#0EA5E9]/30 transition-colors duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              {/* Icon */}
              <div className="relative w-12 h-12 bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#0EA5E9]/20 group-hover:border-[#0EA5E9]/40 transition-all duration-300">
                <Icon size={22} className="text-[#0EA5E9]" />
              </div>

              <h3 className="text-white font-display font-semibold text-xl mb-2 group-hover:text-[#0EA5E9] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0EA5E9] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm mb-4">
            Don&apos;t see your service? We handle almost everything.
          </p>
          <button
            onClick={() =>
              document.querySelector("#estimate")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 text-[#0EA5E9] border border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
          >
            Request a Custom Estimate
          </button>
        </motion.div>
      </div>
    </section>
  );
}
