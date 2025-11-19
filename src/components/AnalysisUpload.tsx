import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, Radar, MapPin, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const AnalysisUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [region, setRegion] = useState("laikipia");
  const [sensorId, setSensorId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} ready for analysis`,
      });
    }
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          toast({
            title: "Analysis Complete!",
            description: "Your soil analysis results are ready.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <section id="analyze" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              AI Soil Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload satellite imagery or connect IoT sensors for comprehensive soil health assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <CloudUpload className="w-6 h-6 text-accent" />
                Data Input Methods
              </h3>

              {/* Satellite Imagery Upload */}
              <div className="space-y-4 p-6 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors cursor-pointer bg-card">
                <div className="text-center space-y-3">
                  <CloudUpload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-lg">Upload Satellite Imagery</h4>
                    <p className="text-sm text-muted-foreground">
                      Sentinel-2, Landsat, or PlanetScope imagery
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*,.tif,.tiff,.geojson,.json"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <p className="text-sm text-accent font-medium">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {/* IoT Sensor Input */}
              <div className="space-y-4 p-6 border-2 border-dashed border-border rounded-lg hover:border-success transition-colors bg-card">
                <div className="text-center space-y-3">
                  <Radar className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-lg">IoT Sensor Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect soil sensors for real-time analysis
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensorId">Sensor ID</Label>
                    <Input
                      id="sensorId"
                      placeholder="Enter sensor identifier"
                      value={sensorId}
                      onChange={(e) => setSensorId(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="w-full border-success text-success hover:bg-success hover:text-success-foreground">
                    Connect Sensors
                  </Button>
                </div>
              </div>
            </Card>

            {/* Location Selection */}
            <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <MapPin className="w-6 h-6 text-accent" />
                Location Analysis
              </h3>

              {/* Map Placeholder */}
              <div className="h-64 bg-muted rounded-lg overflow-hidden shadow-inner">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="w-16 h-16 mx-auto text-primary/40" />
                    <p className="text-muted-foreground">Interactive map will load here</p>
                  </div>
                </div>
              </div>

              {/* Region Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Select Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laikipia">Laikipia County, Kenya</SelectItem>
                      <SelectItem value="punjab">Punjab, India</SelectItem>
                      <SelectItem value="iowa">Iowa, USA</SelectItem>
                      <SelectItem value="custom">Custom Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Analysis Button */}
                <Button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
                  size="lg"
                >
                  <Play className="mr-2 w-5 h-5" />
                  {analyzing ? "Analyzing..." : "Run AI Analysis"}
                </Button>

                {/* Progress Bar */}
                {analyzing && (
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Analyzing... {progress}%
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisUpload;
