import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ContentCreateHeader from "@/components/ContentCreateHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ContentCreateHeader />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseSection />
      <BlogSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
