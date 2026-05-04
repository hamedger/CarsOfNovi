import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import HeroSection from "@/sections/HeroSection";
import ServicesSection from "@/sections/ServicesSection";
import SpecialsSection from "@/sections/SpecialsSection";
import AboutSection from "@/sections/AboutSection";
import EstimateSection from "@/sections/EstimateSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import ContactSection from "@/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <SpecialsSection />
        <AboutSection />
        <EstimateSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <BookingWidget />
    </>
  );
}
