"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    title: "Engine Repair",
    image: "/services/engine-repair.jpg",
    description:
      "Complete engine diagnostics, rebuild, and repair. From minor tune-ups to full overhauls — we keep your engine running at peak performance.",
  },
  {
    title: "AC Repair",
    image: "/services/ac-repair.jpg",
    description:
      "Stay cool with full A/C system diagnostics, leak detection, compressor service, and refrigerant recharge for dependable cabin comfort.",
  },
  {
    title: "Heater Repair",
    image: "/services/heater-repair.jpg",
    description:
      "Reliable cabin heat restoration with heater core checks, blower motor repair, thermostat service, and climate control diagnostics.",
  },
  {
    title: "Check Engine Light",
    image: "/services/check-engine-light.jpg",
    description:
      "Fast and accurate OBD-II diagnostics to pinpoint warning light causes and provide clear, cost-effective repair recommendations.",
  },
  {
    title: "Computer Programming",
    image: "/services/computer-programming.jpg",
    description:
      "Module coding, ECU programming, key programming, and software updates using professional tools to match factory specifications.",
  },
  {
    title: "Drivetrain & Differential",
    image: "/services/drivetrain-differential.jpg",
    description:
      "Inspection and repair of axles, driveshafts, CV joints, and differential components to restore smooth, reliable power delivery.",
  },
  {
    title: "Transmission Repair",
    image: "/services/transmission-repair.jpg",
    description:
      "Automatic and manual transmission diagnostics, fluid service, clutch work, and repairs that improve shifting performance and longevity.",
  },
  {
    title: "Wheel Alignment",
    image: "/services/wheel-alignment.jpg",
    description:
      "Precision wheel alignment service to correct steering pull, reduce tire wear, and improve handling, safety, and fuel efficiency.",
  },
  {
    title: "Scheduled Maintenance",
    image: "/services/scheduled-maintenance.jpg",
    description:
      "Factory-recommended maintenance including inspections, fluid checks, filter changes, and tune-ups to keep your vehicle reliable.",
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
          {services.map(({ title, image, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 cursor-default overflow-hidden hover:border-[#0EA5E9]/30 transition-colors duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              {/* Service photo */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#1F1F1F] mb-5">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
