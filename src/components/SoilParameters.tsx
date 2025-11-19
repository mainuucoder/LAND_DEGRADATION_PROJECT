import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom, Droplet, Weight, Leaf, Flame, TestTube } from "lucide-react";

interface Parameter {
  icon: React.ReactNode;
  name: string;
  value: string;
  status: "optimal" | "moderate" | "poor";
  description: string;
}


const SoilParameters = () => {
  const parameters: Parameter[] = [
    {
      icon: <Atom className="w-6 h-6" />,
      name: "Soil Organic Carbon",
      value: "1.8%",
      status: "poor",
      description: "Measures carbon content in soil. Optimal range: 2.5-4%",
    },
    {
      icon: <TestTube className="w-6 h-6" />,
      name: "pH Level",
      value: "5.2",
      status: "moderate",
      description: "Soil acidity/alkalinity. Optimal range: 6.0-7.0",
    },
    {
      icon: <Droplet className="w-6 h-6" />,
      name: "Moisture Content",
      value: "18%",
      status: "optimal",
      description: "Water content in soil. Optimal range: 15-25%",
    },
    {
      icon: <Weight className="w-6 h-6" />,
      name: "Bulk Density",
      value: "1.45 g/cm³",
      status: "moderate",
      description: "Soil compaction measure. Optimal: 1.1-1.4 g/cm³",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      name: "Nitrogen (N)",
      value: "125 kg/ha",
      status: "poor",
      description: "Essential plant nutrient. Optimal: 150-200 kg/ha",
    },
    {
      icon: <Flame className="w-6 h-6" />,
      name: "Phosphorus (P)",
      value: "45 ppm",
      status: "optimal",
      description: "Critical for energy transfer. Optimal: 30-50 ppm",
    },
  ];

  const getStatusColor = (status: Parameter["status"]) => {
    switch (status) {
      case "optimal":
        return "bg-success/10 text-success border-success/20";
      case "moderate":
        return "bg-warning/10 text-warning border-warning/20";
      case "poor":
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const getStatusLabel = (status: Parameter["status"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <section id="parameters" className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Comprehensive Soil Health Parameters
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered assessment of 15+ critical soil parameters
            </p>
          </div>

          {/* Parameters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parameters.map((param, index) => (
              <Card
                key={param.name}
                className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-accent animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-accent">{param.icon}</div>
                    <h3 className="font-semibold text-lg">{param.name}</h3>
                  </div>
                  <Badge variant="outline" className={getStatusColor(param.status)}>
                    {getStatusLabel(param.status)}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-primary">
                  {param.value}
                </div>

                <p className="text-sm text-muted-foreground">
                  {param.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Soil Composition */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card className="p-6 space-y-4 shadow-lg">
              <h3 className="text-2xl font-semibold">Soil Composition</h3>
              <div className="space-y-3">
                {[
                  { name: "Sandy", percentage: 40, color: "bg-yellow-500" },
                  { name: "Clay", percentage: 25, color: "bg-purple-500" },
                  { name: "Loam", percentage: 20, color: "bg-green-500" },
                  { name: "Silt", percentage: 15, color: "bg-blue-400" },
                ].map((soil) => (
                  <div key={soil.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{soil.name}</span>
                      <span className="text-muted-foreground">{soil.percentage}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${soil.color} transition-all duration-500`}
                        style={{ width: `${soil.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4 shadow-lg">
              <h3 className="text-2xl font-semibold">Health Trends</h3>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoilParameters;
