"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Estimate", href: "#estimate" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md border-b border-[#1F1F1F] shadow-lg shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <Image
                src="/logo.png"
                alt="C.A.R.S. Logo"
                width={52}
                height={52}
                className="rounded-full object-cover"
                priority
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-gray-300 hover:text-[#0EA5E9] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0EA5E9] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
              <Link
                href="/careers"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400 hover:text-green-300 transition-colors relative group"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                We&apos;re Hiring
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+12483472021"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-[#0EA5E9] transition-colors"
              >
                <Phone size={15} />
                (248) 347-2021
              </a>
              <button
                onClick={() => handleNavClick("#estimate")}
                className="hidden md:block bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Get Estimate
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-black/97 backdrop-blur-md border-b border-[#1F1F1F] md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-base font-medium text-gray-300 hover:text-[#0EA5E9] hover:bg-[#111] px-4 py-3 rounded-lg transition-all"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/careers"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-green-400 hover:text-green-300 hover:bg-[#111] px-4 py-3 rounded-lg transition-all"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                We&apos;re Hiring
              </Link>
              <div className="mt-3 pt-3 border-t border-[#1F1F1F] flex flex-col gap-2">
                <a
                  href="tel:+12483472021"
                  className="flex items-center gap-2 text-gray-300 px-4 py-2"
                >
                  <Phone size={15} className="text-[#0EA5E9]" />
                  (248) 347-2021
                </a>
                <button
                  onClick={() => handleNavClick("#estimate")}
                  className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-4 py-3 rounded-lg transition-colors"
                >
                  Get Free Estimate
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
