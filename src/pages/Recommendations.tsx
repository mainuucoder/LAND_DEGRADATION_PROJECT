import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Droplets, Sun, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const Recommendations = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
         {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        <Sprout className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Smart Recommendations</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Irrigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Optimize water usage based on soil moisture levels.
            </p>
            <Button variant="outline" className="w-full">
              View Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-500" />
              Fertilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Balanced nutrient recommendations for your crops.
            </p>
            <Button variant="outline" className="w-full">
              Get Plan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Crop Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Preventative measures for common soil diseases.
            </p>
            <Button variant="outline" className="w-full">
              See Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Action Plan</CardTitle>
          <CardDescription>Personalized recommendations for your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Water northern section</span>
              <Button size="sm">Mark Complete</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Apply nitrogen fertilizer</span>
              <Button size="sm">Mark Complete</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span>Soil sample collection</span>
              <Button size="sm">Mark Complete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;