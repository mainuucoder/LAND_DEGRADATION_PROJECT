import { useState } from "react";
import { Microscope, Mail, Phone, MapPin, ChevronUp, Send, Twitter, Linkedin, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const links = {
    technology: [
      { label: "Satellite Analysis", href: "#", badge: "New" },
      { label: "IoT Integration", href: "#", badge: "Beta" },
      { label: "Machine Learning", href: "#" },
      { label: "Blockchain MRV", href: "#", badge: "Coming Soon" },
    ],
    partners: [
      { label: "SoilGrids", href: "#" },
      { label: "Google Earth Engine", href: "#" },
      { label: "FAO", href: "#" },
      { label: "NASA Harvest", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Research Papers", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Blog", href: "#" },
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <footer className="bg-gradient-to-br from-primary via-primary/95 to-secondary text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="container px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid lg:grid-cols-5 gap-8 py-12">
              {/* Brand & Newsletter */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                    <Microscope className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                      Terra_Guard_AI
                    </span>
                    <Badge variant="secondary" className="ml-2 bg-primary-foreground/20 text-primary-foreground">
                      Beta
                    </Badge>
                  </div>
                </div>
                
                <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
                  Advanced soil health assessment using satellite imagery and machine learning for sustainable agriculture.
                </p>

                {/* Newsletter Subscription */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Stay Updated</h4>
                  {isSubscribed ? (
                    <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-sm">
                      🎉 Thank you for subscribing! We'll keep you updated.
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                        required
                      />
                      <Button 
                        type="submit" 
                        size="sm"
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  )}
                  <p className="text-xs text-primary-foreground/60">
                    Join 2,000+ farmers and researchers receiving monthly insights
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 pt-4">
                  {socialLinks.map((social) => (
                    <Tooltip key={social.label}>
                      <TooltipTrigger asChild>
                        <a
                          href={social.href}
                          className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110"
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{social.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Technology Links */}
              <div>
                <h5 className="font-semibold text-lg mb-6 pb-2 border-b border-primary-foreground/20">
                  Technology
                </h5>
                <ul className="space-y-3">
                  {links.technology.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-1 text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/40 group-hover:bg-primary-foreground transition-colors"></span>
                        {link.label}
                        {link.badge && (
                          <Badge variant="outline" className="ml-2 text-xs bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
                            {link.badge}
                          </Badge>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Partners & Resources */}
              <div className="space-y-8">
                <div>
                  <h5 className="font-semibold text-lg mb-6 pb-2 border-b border-primary-foreground/20">
                    Partners
                  </h5>
                  <ul className="space-y-3">
                    {links.partners.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="group flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/40 group-hover:bg-primary-foreground transition-colors"></span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-lg mb-6 pb-2 border-b border-primary-foreground/20">
                    Resources
                  </h5>
                  <ul className="space-y-3">
                    {links.resources.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="group flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/40 group-hover:bg-primary-foreground transition-colors"></span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h5 className="font-semibold text-lg mb-6 pb-2 border-b border-primary-foreground/20">
                  Contact
                </h5>
                <ul className="space-y-4 text-sm">
                  <li>
                    <a
                      href="mailto:soil@terraguard.ai"
                      className="group flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2 rounded-lg hover:bg-primary-foreground/10"
                    >
                      <div className="p-2 rounded-lg bg-primary-foreground/10">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span>soil@terraguard.ai</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+254703343652"
                      className="group flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2 rounded-lg hover:bg-primary-foreground/10"
                    >
                      <div className="p-2 rounded-lg bg-primary-foreground/10">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div>+254 703 343 652</div>
                        <div className="text-xs text-primary-foreground/60">+254 794 852 592</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center gap-3 text-primary-foreground/80 p-2">
                      <div className="p-2 rounded-lg bg-primary-foreground/10">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span>Nairobi, Kenya</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-primary-foreground/20 pt-8 pb-6">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="text-center lg:text-left">
                  <p className="text-primary-foreground/80 text-sm mb-2">
                    &copy; 2025 Terra_Guard_AI. All rights reserved. Terms and Conditions Apply
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-primary-foreground/60">
                    <span>Advancing Sustainable Development Goals 2 & 15</span>
                    <p>•</p>
                    <p>Developed by Daniel Maina Mutahi & Joseph Mutinda</p>
                  </div>
                </div>
                {/* Scroll to Top Button */}
                <Button
                  onClick={scrollToTop}
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Back to Top
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </TooltipProvider>
  );
};

export default Footer;