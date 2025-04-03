import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CourseSection from "@/components/CourseSection";
import CategoriesSection from "@/components/CategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WaitlistCTA from "@/components/WaitlistCTA";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CourseSection />
      <CategoriesSection />
      <TestimonialsSection />
      <WaitlistCTA />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
