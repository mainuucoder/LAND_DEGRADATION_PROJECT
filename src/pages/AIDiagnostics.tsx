import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const AIDiagnostics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Diagnostics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Soil Health Report</CardTitle>
            <CardDescription>AI-powered analysis results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">pH Level</p>
                <p className="text-sm text-green-600">Optimal (6.5)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium">Nutrient Balance</p>
                <p className="text-sm text-yellow-600">Needs attention</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Last Analysis</p>
                <p className="text-sm text-blue-600">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run New Analysis</CardTitle>
            <CardDescription>Get latest AI diagnostics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              Start Comprehensive Analysis
            </Button>
            <p className="text-sm text-muted-foreground">
              Our AI will analyze soil samples, satellite data, and environmental factors to provide detailed recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIDiagnostics;