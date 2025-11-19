import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, TrendingUp, Loader2, Satellite, Brain, Sprout, ArrowRight } from "lucide-react";
import SoilParameters from "@/components/SoilParameters";
import Recommendations from "@/components/Recommendations";
import CarbonCredits from "@/components/CarbonCredits";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    }
  };

  const FeatureCard = ({ 
    title, 
    description, 
    icon: Icon, 
    route,
    color = "primary"
  }: { 
    title: string; 
    description: string; 
    icon: any; 
    route: string;
    color?: "primary" | "accent" | "secondary";
  }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary/20">
      <div 
        className="flex flex-col h-full"
        onClick={() => navigate(route)}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-lg bg-${color}/10 group-hover:bg-${color}/20 transition-colors`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-primary">Explore</span>
          <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analysis Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.user_metadata?.username || user.email}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Card */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-12 h-12 text-primary" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">Welcome to Your Soil Analysis Hub</h2>
                <p className="text-muted-foreground">
                  Access comprehensive soil health metrics, AI-powered diagnostics, and personalized recommendations for sustainable farming.
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Access Features */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                title="Satellite Analysis"
                description="Real-time satellite imagery and soil monitoring with advanced analytics"
                icon={Satellite}
                route="/satellite-analysis"
                color="primary"
              />
              <FeatureCard
                title="AI Diagnostics"
                description="Comprehensive soil health analysis powered by machine learning"
                icon={Brain}
                route="/ai-diagnostics"
                color="accent"
              />
              <FeatureCard
                title="Smart Recommendations"
                description="Personalized farming recommendations and action plans"
                icon={Sprout}
                route="/recommendations"
                color="secondary"
              />
            </div>
          </div>

        

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Last soil analysis completed 2 days ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Satellite data updated 5 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">New recommendations available</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;