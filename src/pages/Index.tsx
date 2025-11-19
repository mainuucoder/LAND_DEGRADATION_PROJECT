import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AnalysisUpload from "@/components/AnalysisUpload";
import SoilParameters from "@/components/SoilParameters";
import Recommendations from "@/components/Recommendations";
import CarbonCredits from "@/components/CarbonCredits";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <AnalysisUpload />
        <SoilParameters />
        <Recommendations />
        <CarbonCredits />
      </main>
      <Footer />
    </div>
  );
};


export default Index;
