import { Button } from "@/components/ui/button";
import { ArrowRight, Satellite, Brain, Sprout } from "lucide-react";
import heroImage from "@/assets/hero-soil.jpg";

const Hero = () => {
  const scrollToAnalysis = () => {
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
  };

  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-secondary/85" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            AI-Powered Soil Health Analysis
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Revolutionizing soil management with satellite imagery, IoT sensors, and machine learning for sustainable agriculture
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Satellite className="w-5 h-5 text-accent" />
              <span className="text-primary-foreground font-medium">Satellite Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Brain className="w-5 h-5 text-accent" />
              <span className="text-primary-foreground font-medium">AI Diagnostics</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Sprout className="w-5 h-5 text-accent" />
              <span className="text-primary-foreground font-medium">Smart Recommendations</span>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={scrollToAnalysis}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Soil Analysis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
