import Navbar from "../../../components/Landing/Navbar";
import HeroSection from "../../../components/Landing/HeroSection";
import FeaturesSection from "../../../components/Landing/FeaturesSection";
import Footer from "../../../components/Landing/Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#030303] selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};
