import { Button } from "@/components/ui/button";
import { ArrowRight, Satellite, Brain, Sprout } from "lucide-react";
import heroImage from "@/assets/hero-soil.jpg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToAnalysis = () => {
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFeatureClick = (feature: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: `Please log in to access ${feature}`,
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="border-white text-white"
          >
            Sign In
          </Button>
        ),
      });
      return;
    }

    // Navigate to respective pages when logged in
    switch (feature) {
      case "Satellite Analysis":
        navigate("/satellite-analysis");
        break;
      case "AI Diagnostics":
        navigate("/ai-diagnostics");
        break;
      case "Smart Recommendations":
        navigate("/recommendations");
        break;
      default:
        scrollToAnalysis();
    }
  };

  const FeaturePill = ({ 
    icon: Icon, 
    text, 
    feature 
  }: { 
    icon: any; 
    text: string; 
    feature: string;
  }) => (
    <button
      onClick={() => handleFeatureClick(feature)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
        isLoggedIn 
          ? "bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:border-white/50 hover:scale-105 cursor-pointer" 
          : "bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20"
      } group`}
    >
      <Icon className={`w-5 h-5 ${
        isLoggedIn ? "text-accent group-hover:text-accent/90" : "text-accent/70"
      }`} />
      <span className={`font-medium ${
        isLoggedIn ? "text-primary-foreground group-hover:text-white" : "text-primary-foreground/80"
      }`}>
        {text}
      </span>
      {!isLoggedIn && (
        <div className="absolute -top-1 -right-1">
          <div className="bg-accent rounded-full p-1">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );

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
          <div className="flex flex-wrap justify-center gap-4 pt-6 relative">
            <FeaturePill 
              icon={Satellite} 
              text="Satellite Analysis" 
              feature="Satellite Analysis"
            />
            <FeaturePill 
              icon={Brain} 
              text="AI Diagnostics" 
              feature="AI Diagnostics"
            />
            <FeaturePill 
              icon={Sprout} 
              text="Smart Recommendations" 
              feature="Smart Recommendations"
            />
            
            
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
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
      </div>  
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;