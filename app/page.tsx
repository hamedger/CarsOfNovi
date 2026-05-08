import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import FloatingSocialBar from "@/components/FloatingSocialBar";
import HeroSection from "@/sections/HeroSection";
import ServicesSection from "@/sections/ServicesSection";
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
<AboutSection />
        <EstimateSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <BookingWidget />
      <FloatingSocialBar />
    </>
  );
}
