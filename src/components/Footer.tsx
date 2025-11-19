import { Microscope, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const links = {
    technology: [
      { label: "Satellite Analysis", href: "#" },
      { label: "IoT Integration", href: "#" },
      { label: "Machine Learning", href: "#" },
      { label: "Blockchain MRV", href: "#" },
    ],
    partners: [
      { label: "SoilGrids", href: "#" },
      { label: "Google Earth Engine", href: "#" },
      { label: "FAO", href: "#" },
      { label: "NASA Harvest", href: "#" },
    ],
  };

  
  return (
    <footer className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-12">
      <div className="container px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Microscope className="w-6 h-6" />
                <span className="text-xl font-bold">TerraGuard AI</span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Advanced soil health assessment using satellite imagery and machine learning for sustainable agriculture.
              </p>
            </div>

            {/* Technology */}
            <div>
              <h5 className="font-semibold mb-4">Technology</h5>
              <ul className="space-y-2">
                {links.technology.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h5 className="font-semibold mb-4">Partners</h5>
              <ul className="space-y-2">
                {links.partners.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-primary-foreground/80">
                  <Mail className="w-4 h-4" />
                  soil@terraguard.ai
                </li>
                <li className="flex items-center gap-2 text-primary-foreground/80">
                  <Phone className="w-4 h-4" />
                  +254 700 123 456
                </li>
                <li className="flex items-center gap-2 text-primary-foreground/80">
                  <MapPin className="w-4 h-4" />
                  Nairobi, Kenya
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>&copy; 2025 TerraGuard AI. All rights reserved.</p>
            <p>Advancing Sustainable Development Goals 2 & 15</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
