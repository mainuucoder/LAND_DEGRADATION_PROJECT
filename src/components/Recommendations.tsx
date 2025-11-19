import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Droplet, Layers, Sprout, TestTube } from "lucide-react";

interface Recommendation {
  icon: React.ReactNode;
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
  actions: string[];
  improvement: string;
}


const Recommendations = () => {
  const recommendations: Recommendation[] = [
    {
      icon: <Sprout className="w-6 h-6" />,
      title: "Organic Matter Boost",
      priority: "high",
      description: "Increase soil organic carbon from 1.8% to target 3.0%",
      actions: [
        "Apply 5 tons/ha compost",
        "Plant green manure crops",
        "Reduce tillage intensity",
      ],
      improvement: "Expected improvement: 0.5% SOC in 6 months",
    },
    {
      icon: <TestTube className="w-6 h-6" />,
      title: "pH Adjustment",
      priority: "medium",
      description: "Adjust soil pH from 5.2 to optimal 6.5",
      actions: [
        "Apply 2 tons/ha agricultural lime",
        "Incorporate wood ash",
        "Monitor pH monthly",
      ],
      improvement: "Expected improvement: pH 6.0 in 3 months",
    },
    {
      icon: <Droplet className="w-6 h-6" />,
      title: "Nitrogen Management",
      priority: "high",
      description: "Increase nitrogen availability from 125 to 180 kg/ha",
      actions: [
        "Apply 50 kg/ha urea fertilizer",
        "Plant legume cover crops",
        "Use slow-release nitrogen",
      ],
      improvement: "Expected improvement: 160 kg/ha in 2 months",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Soil Structure",
      priority: "medium",
      description: "Improve soil structure and reduce compaction",
      actions: [
        "Deep ripping to 40cm",
        "Add gypsum for clay soils",
        "Practice controlled traffic",
      ],
      improvement: "Expected improvement: 10% porosity increase",
    },
  ];

  const getPriorityColor = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
    }
  };

  const getPriorityLabel = (priority: Recommendation["priority"]) => {
    return `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;
  };

  return (
    <section id="recommendations" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              AI-Powered Soil Improvement Recommendations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized interventions based on your soil analysis
            </p>
          </div>

          {/* Recommendations Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <Card
                key={rec.title}
                className="p-6 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === "high" ? "bg-destructive/10 text-destructive" :
                      rec.priority === "medium" ? "bg-warning/10 text-warning" :
                      "bg-info/10 text-info"
                    }`}>
                      {rec.icon}
                    </div>
                    <h3 className="font-semibold text-xl">{rec.title}</h3>
                  </div>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {getPriorityLabel(rec.priority)}
                  </Badge>
                </div>

                <p className="text-muted-foreground">
                  {rec.description}
                </p>

                <ul className="space-y-2">
                  {rec.actions.map((action) => (
                    <li key={action} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {rec.improvement}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
