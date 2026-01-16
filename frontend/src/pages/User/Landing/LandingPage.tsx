import Navbar from "../../../components/Landing/Navbar";
import Footer from "../../../components/Landing/Footer";
import FeaturesSection from "../../../components/Landing/FeaturesSection";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <FeaturesSection />
      <Footer />
    </div>
  );
};
