import { Metadata } from "next";
import { CheckCircle, MapPin, Clock, DollarSign, Mail, Phone, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "We're Hiring — C.A.R.S. Complete Auto Repair Specialist",
  description:
    "Join the C.A.R.S. team. We're looking for a certified mechanic in Novi, MI. Send your resume to carsofnovi@gmail.com.",
};

const requirements = [
  "ASE Certification (one or more areas required)",
  "3+ years of hands-on automotive repair experience",
  "Proficiency in engine, brake, suspension, and electrical diagnosis",
  "Ability to operate diagnostic scan tools and shop equipment",
  "Valid driver's license with clean driving record",
  "Reliable, punctual, and team-oriented work ethic",
];

const responsibilities = [
  "Diagnose and repair a wide range of domestic and foreign vehicles",
  "Perform routine maintenance services (oil changes, brakes, tires, filters)",
  "Document work performed accurately in the shop management system",
  "Communicate findings clearly to service advisors",
  "Maintain a clean, safe, and organized work bay",
  "Stay current with manufacturer TSBs and industry best practices",
];

const benefits = [
  "Competitive flat-rate or hourly pay based on experience",
  "Health & dental benefits package",
  "Paid time off and holidays",
  "Ongoing training and ASE certification support",
  "Supportive team environment with modern equipment",
  "Monday – Friday schedule, Saturdays optional",
];

export default function CareersPage() {
  const applyHref =
    "mailto:carsofnovi@gmail.com?subject=Application%3A%20Certified%20Mechanic&body=Hi%20C.A.R.S.%20team%2C%0A%0APlease%20find%20my%20resume%20attached.%0A%0AName%3A%0APhone%3A%0AYears%20of%20experience%3A%0AASE%20certifications%3A%0A%0AThank%20you%2C";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-[72px]">

        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0EA5E9]/8 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Now Hiring
            </span>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Certified Mechanic
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              We&apos;re growing and looking for a skilled, passionate mechanic to join the C.A.R.S. team in Novi, MI.
            </p>

            {/* Quick info pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {[
                { icon: MapPin, label: "Novi, MI" },
                { icon: Clock, label: "Full-Time" },
                { icon: DollarSign, label: "Competitive Pay" },
                { icon: Wrench, label: "ASE Certified" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-[#111] border border-[#1F1F1F] px-4 py-2 rounded-full text-sm text-gray-300"
                >
                  <Icon size={14} className="text-[#0EA5E9]" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={applyHref}
              className="inline-flex items-center gap-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/25"
            >
              <Mail size={18} />
              Apply Now — Send Your Resume
            </a>
            <p className="text-gray-600 text-xs mt-3">
              Opens your email app · carsofnovi@gmail.com
            </p>
          </div>
        </section>

        {/* Details */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Requirements */}
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                <h2 className="font-display text-lg font-bold text-white mb-5 pb-3 border-b border-[#1F1F1F]">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400 leading-snug">
                      <CheckCircle size={14} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                <h2 className="font-display text-lg font-bold text-white mb-5 pb-3 border-b border-[#1F1F1F]">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400 leading-snug">
                      <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
                <h2 className="font-display text-lg font-bold text-white mb-5 pb-3 border-b border-[#1F1F1F]">
                  What We Offer
                </h2>
                <ul className="space-y-3">
                  {benefits.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400 leading-snug">
                      <CheckCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* About the shop */}
            <div className="mt-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8">
              <h2 className="font-display text-xl font-bold text-white mb-3">About C.A.R.S.</h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                C.A.R.S. (Complete Auto Repair Specialist) has been serving Novi and surrounding
                communities for over 15 years. We&apos;re a team of dedicated professionals committed
                to honest, high-quality auto repair. Our shop is equipped with modern diagnostic
                tools and we service all makes and models — domestic and import. If you take pride
                in your work and want to grow with a shop that values its technicians, we&apos;d love
                to hear from you.
              </p>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 bg-[#0EA5E9] rounded-2xl p-8 text-center">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Ready to Join the Team?
              </h2>
              <p className="text-white/80 text-sm mb-6">
                Email your resume and a brief introduction to us. We review every application and
                will be in touch within 2 business days.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={applyHref}
                  className="flex items-center gap-2 bg-white text-[#0EA5E9] hover:bg-gray-100 font-bold text-base px-8 py-3.5 rounded-xl transition-colors"
                >
                  <Mail size={18} />
                  Email Your Resume
                </a>
                <a
                  href="tel:+15555550100"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-colors"
                >
                  <Phone size={18} />
                  Call (555) 555-0100
                </a>
              </div>
              <p className="text-white/60 text-xs mt-4">carsofnovi@gmail.com</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
