"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

const hours = [
  { day: "Monday – Friday", time: "7:30 AM – 6:00 PM" },
  { day: "Saturday", time: "8:00 AM – 3:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const contactItems = [
  {
    icon: Phone,
    label: "Phone",
    value: "(555) 555-0100",
    href: "tel:+15555550100",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@carsautoshop.com",
    href: "mailto:info@carsautoshop.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Auto Drive, Detroit, MI 48201",
    href: "https://maps.google.com",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 bg-black">
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
            Get In Touch
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Have questions? We&apos;re here to help. Reach out and one of our team members will be in touch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact info + hours */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Contact items */}
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 space-y-5">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-[#0EA5E9]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0EA5E9]/20 transition-colors">
                    <Icon size={18} className="text-[#0EA5E9]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p className="text-white text-sm group-hover:text-[#0EA5E9] transition-colors">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <Clock size={16} className="text-[#0EA5E9]" />
                <h3 className="text-white font-semibold text-sm">Hours of Operation</h3>
              </div>
              <div className="space-y-3">
                {hours.map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{day}</span>
                    <span
                      className={`text-sm font-medium ${
                        time === "Closed" ? "text-red-400" : "text-white"
                      }`}
                    >
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#0EA5E9] rounded-2xl p-6 cursor-pointer"
              onClick={() =>
                document.querySelector("#estimate")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <h3 className="text-white font-display font-bold text-xl mb-1">
                Ready to get started?
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Request a free estimate today — no commitment required.
              </p>
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                Get Free Estimate <ArrowRight size={16} />
              </div>
            </motion.div>
          </motion.div>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden min-h-[400px] lg:min-h-0"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d94267.43082782286!2d-83.24803!3d42.3314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824ca0110cb1d75%3A0x5776864e35b9c4d2!2sDetroit%2C%20MI!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="C.A.R.S. Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
