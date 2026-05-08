import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Estimate", href: "#estimate" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="C.A.R.S. Logo"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div>
                <span className="font-display font-bold text-xl tracking-widest text-white">
                  C.A.R.S.
                </span>
                <p className="text-[10px] text-gray-500 tracking-wider uppercase leading-none">
                  Complete Auto Repair Specialist
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Committed to excellence in every repair. Certified mechanics delivering
              quality automotive services you can trust.
            </p>
            <div className="mt-5">
              <p className="text-[11px] text-gray-500 tracking-wider uppercase mb-2">Connect With Us</p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/CARSofNOVI?mibextid=wwXIfr&rdid=hY3pADoV0Llpl0La&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1aLropLQiR%2F%3Fmibextid%3DwwXIfr%26ref%3D1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="C.A.R.S. Facebook"
                  className="w-9 h-9 bg-[#111] border border-[#1F1F1F] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30 transition-all"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://www.instagram.com/carsofnovi?igsh=ODk1d2pmM2x3eHU1&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="C.A.R.S. Instagram"
                  className="w-9 h-9 bg-[#111] border border-[#1F1F1F] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30 transition-all"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#0EA5E9] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+12483472021"
                  className="flex items-start gap-2.5 text-gray-400 hover:text-[#0EA5E9] text-sm transition-colors"
                >
                  <Phone size={15} className="text-[#0EA5E9] mt-0.5 shrink-0" />
                  (248) 347-2021
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@carsautoshop.com"
                  className="flex items-start gap-2.5 text-gray-400 hover:text-[#0EA5E9] text-sm transition-colors"
                >
                  <Mail size={15} className="text-[#0EA5E9] mt-0.5 shrink-0" />
                  info@carsautoshop.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-gray-400 text-sm">
                <MapPin size={15} className="text-[#0EA5E9] mt-0.5 shrink-0" />
                24400 Novi Rd #102, Novi, MI 48375
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} C.A.R.S. Complete Auto Repair Specialist. All rights reserved.
          </p>
          <a
            href="/admin"
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            Admin Portal
          </a>
        </div>
      </div>
    </footer>
  );
}
