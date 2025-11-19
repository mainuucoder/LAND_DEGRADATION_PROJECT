import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Microscope, Menu, X, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Analyze Soil", href: "#analyze" },
    { label: "Parameters", href: "#parameters" },
    { label: "Recommendations", href: "#recommendations" },
    { label: "Carbon Credits", href: "#carbon" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-primary-foreground">
            <Microscope className="w-6 h-6" />
            <span className="text-xl font-bold">TerraGuard AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="secondary"
                size="sm"
                className="ml-2"
              >
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button
                  onClick={() => navigate("/auth")}
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  variant="secondary"
                  size="sm"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-in">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-2 text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10 rounded transition-colors"
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <Button
                onClick={() => {
                  navigate("/dashboard");
                  setIsOpen(false);
                }}
                variant="secondary"
                className="w-full mx-4"
              >
                Dashboard
              </Button>
            ) : (
              <div className="px-4 pt-2 space-y-2">
                <Button
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full text-primary-foreground hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
