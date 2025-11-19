import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, DollarSign, FileText } from "lucide-react";

const CarbonCredits = () => {
  const carbonData = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Current Carbon Stock",
      value: "42.5",
      unit: "tons CO₂/ha",
      gradient: "from-success to-success/80",
    },
  
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Annual Sequestration",
      value: "2.8",
      unit: "tons CO₂/ha/year",
      gradient: "from-warning to-warning/80",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Credit Value",
      value: "$42",
      unit: "per hectare/year",
      gradient: "from-info to-info/80",
    },
  ];

  const practices = [
    {
      name: "Cover Cropping",
      impact: "+0.8 tCO₂/ha/yr",
      cost: "$120",
      roi: "2 years",
    },
    {
      name: "Reduced Tillage",
      impact: "+0.6 tCO₂/ha/yr",
      cost: "$80",
      roi: "1.5 years",
    },
    {
      name: "Compost Application",
      impact: "+1.2 tCO₂/ha/yr",
      cost: "$200",
      roi: "3 years",
    },
    {
      name: "Agroforestry",
      impact: "+2.1 tCO₂/ha/yr",
      cost: "$350",
      roi: "4 years",
    },
  ];

  return (
    <section id="carbon" className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Soil Carbon Credit Potential
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monetize your soil improvement efforts through carbon sequestration
            </p>
          </div>

          {/* Carbon Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {carbonData.map((item, index) => (
              <Card
                key={item.title}
                className={`p-6 bg-gradient-to-br ${item.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="text-4xl font-bold">{item.value}</div>
                  <p className="text-sm opacity-90">{item.unit}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Carbon Farming Plan */}
          <Card className="p-8 shadow-lg">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent" />
                Carbon Farming Plan
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Practice</th>
                      <th className="text-left py-3 px-4 font-semibold">Carbon Impact</th>
                      <th className="text-left py-3 px-4 font-semibold">Cost/ha</th>
                      <th className="text-left py-3 px-4 font-semibold">ROI Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {practices.map((practice, index) => (
                      <tr
                        key={practice.name}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">{practice.name}</td>
                        <td className="py-4 px-4 text-success font-semibold">
                          {practice.impact}
                        </td>
                        <td className="py-4 px-4">{practice.cost}</td>
                        <td className="py-4 px-4">{practice.roi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center pt-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground"
                >
                  <FileText className="mr-2 w-5 h-5" />
                  Generate Carbon Credit Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CarbonCredits;
