import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { 
  LogOut, 
  TrendingUp, 
  Loader2, 
  Satellite, 
  Brain, 
  Sprout, 
  ArrowRight, 
  User as UserIcon,
  Calendar,
  BarChart3,
  Leaf,
  Shield,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(78);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

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
    color = "primary",
    badge,
    gradient
  }: { 
    title: string; 
    description: string; 
    icon: any; 
    route: string;
    color?: "primary" | "accent" | "secondary" | "success";
    badge?: string;
    gradient?: string;
  }) => (
    <Card className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden ${gradient}`}>
      <CardContent className="p-6 h-full">
        <div 
          className="flex flex-col h-full"
          onClick={() => navigate(route)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-background/80 backdrop-blur-sm border`}>
              <Icon className={`w-6 h-6 text-${color}`} />
            </div>
            {badge && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {badge}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium text-primary">Explore Now</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }: { 
    title: string; 
    value: string; 
    subtitle: string; 
    icon: any;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card className="border-0 bg-gradient-to-br from-background to-muted/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            {trend && (
              <Badge variant={trend.isPositive ? "default" : "destructive"} className="mt-2">
                {trend.isPositive ? "+" : ""}{trend.value}%
              </Badge>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <div className="relative">
            <Leaf className="w-12 h-12 text-primary animate-pulse" />
            <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-spin" />
          </div>
          <p className="text-lg font-semibold">Loading your dashboard...</p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Soil Analysis Hub
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <UserIcon className="w-3 h-3" />
                  Welcome back, {user.user_metadata?.username || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Pro Plan
              </Badge>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="space-y-8">
          {/* Welcome & Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="lg:col-span-2 border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 relative overflow-hidden">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-2xl bg-primary/20 backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome to Your Farming Command Center</h2>
                      <p className="text-muted-foreground">
                        Monitor soil health, get AI-powered insights, and optimize your farm's sustainability with real-time data analytics.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">System Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Score Card */}
            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-emerald-400/10">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Soil Health Score</h3>
                  </div>
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-8 border-green-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-600">{healthScore}</span>
                    </div>
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-500 animate-spin"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">Good • Improved 5% this month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Fields Monitored"
              value="12"
              subtitle="Active fields"
              icon={Satellite}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Carbon Credits"
              value="245"
              subtitle="Tons sequestered"
              icon={Leaf}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Analysis Complete"
              value="98%"
              subtitle="Success rate"
              icon={BarChart3}
            />
            <StatCard
              title="Recommendations"
              value="15"
              subtitle="Active suggestions"
              icon={Brain}
            />
          </div>

          {/* Quick Access Features */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Quick Access</h2>
              <Badge variant="outline" className="text-sm">
                Updated Recently
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                title="Satellite Analysis"
                description="Real-time satellite imagery and soil monitoring with advanced analytics and NDVI mapping"
                icon={Satellite}
                route="/satellite-analysis"
                color="primary"
                badge="Live"
                gradient="bg-gradient-to-br from-blue-500/10 to-cyan-400/10"
              />
              <FeatureCard
                title="AI Diagnostics"
                description="Comprehensive soil health analysis powered by machine learning algorithms"
                icon={Brain}
                route="/ai-diagnostics"
                color="accent"
                badge="AI"
                gradient="bg-gradient-to-br from-purple-500/10 to-pink-400/10"
              />
              <FeatureCard
                title="Smart Recommendations"
                description="Personalized farming recommendations and sustainable action plans"
                icon={Sprout}
                route="/recommendations"
                color="success"
                badge="New"
                gradient="bg-gradient-to-br from-green-500/10 to-emerald-400/10"
              />
            </div>
          </div>

          {/* Recent Activity & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your farm monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="font-medium">Soil analysis completed</p>
                    <p className="text-sm text-muted-foreground">2 days ago • Field 4B</p>
                  </div>
                  <Badge variant="outline">Complete</Badge>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Satellite data updated</p>
                    <p className="text-sm text-muted-foreground">5 hours ago • All fields</p>
                  </div>
                  <Badge variant="default">Live</Badge>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">New recommendations available</p>
                    <p className="text-sm text-muted-foreground">1 hour ago • Based on latest data</p>
                  </div>
                  <Badge variant="secondary">Review</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Progress
                </CardTitle>
                <CardDescription>Your sustainability metrics this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Soil Health Improvement</span>
                    <span className="font-medium text-green-600">+5%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Carbon Sequestration</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Water Efficiency</span>
                    <span className="font-medium text-blue-600">+8%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    View Detailed Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;