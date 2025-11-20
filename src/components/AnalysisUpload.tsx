import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudUpload, Radar, MapPin, Play, X, CheckCircle, AlertTriangle, Info, Droplets, Sprout, Thermometer, Leaf, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AnalysisUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [region, setRegion] = useState("laikipia");
  const [sensorId, setSensorId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sensorConnected, setSensorConnected] = useState(false);
  const [sensorData, setSensorData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Soil image validation
  const validateSoilImage = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/tif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, or TIFF images only",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload images smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    // Check filename for soil-related keywords (basic validation)
    const soilKeywords = ['soil', 'dirt', 'ground', 'earth', 'land', 'clay', 'sand', 'mud', 'farm', 'field', 'agriculture', 'crop'];
    const fileName = file.name.toLowerCase();
    const hasSoilKeyword = soilKeywords.some(keyword => fileName.includes(keyword));
    
    if (!hasSoilKeyword) {
      toast({
        title: "Possible non-soil image",
        description: "This doesn't appear to be a soil image. Please upload a proper soil sample photo.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!validateSoilImage(selectedFile)) {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFile(null);
        return;
      }

      setFile(selectedFile);
      toast({
        title: "Soil image uploaded",
        description: `${selectedFile.name} validated and ready for analysis`,
      });
    }
  };

  // Mock IoT sensor connection and data
  const connectSensors = () => {
    if (!sensorId.trim()) {
      toast({
        title: "Sensor ID required",
        description: "Please enter a valid sensor ID",
        variant: "destructive",
      });
      return;
    }

    // Simulate sensor connection
    setSensorConnected(true);
    
    // Mock sensor data
    const mockSensorData = {
      sensorId: sensorId,
      status: "connected",
      lastUpdate: new Date().toLocaleTimeString(),
      readings: {
        moisture: `${(25 + Math.random() * 15).toFixed(1)}%`,
        temperature: `${(20 + Math.random() * 10).toFixed(1)}°C`,
        pH: (6.0 + Math.random() * 1.5).toFixed(1),
        nitrogen: `${(15 + Math.random() * 20).toFixed(1)} ppm`,
        phosphorus: `${(10 + Math.random() * 15).toFixed(1)} ppm`,
        potassium: `${(100 + Math.random() * 80).toFixed(1)} ppm`,
      }
    };

    setSensorData(mockSensorData);
    
    toast({
      title: "Sensors Connected",
      description: `Sensor ${sensorId} is now providing real-time data`,
    });
  };

  const disconnectSensors = () => {
    setSensorConnected(false);
    setSensorData(null);
    setSensorId("");
    toast({
      title: "Sensors Disconnected",
      description: "IoT sensor connection terminated",
    });
  };

  const runAnalysis = () => {
    if (!file && !sensorConnected) {
      toast({
        title: "No data source",
        description: "Please upload a soil image or connect IoT sensors first",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setShowAnalysis(true);
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

  // Generate analysis results based on data source
  const generateAnalysisResults = () => {
    const baseResults = {
      imageInfo: file ? {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        resolution: "4000x3000",
        dateAnalyzed: new Date().toLocaleDateString(),
      } : null,
      
      soilProperties: sensorData ? {
        texture: "Loam",
        color: "Dark Brown",
        organicMatter: "3.2%",
        moisture: sensorData.readings.moisture,
        compaction: "Medium",
        temperature: sensorData.readings.temperature,
      } : {
        texture: "Clay Loam",
        color: "Dark Brown",
        organicMatter: "3.2%",
        moisture: "28%",
        compaction: "Medium",
        temperature: "25°C",
      },

      nutrients: sensorData ? {
        nitrogen: { 
          value: sensorData.readings.nitrogen, 
          status: parseFloat(sensorData.readings.nitrogen) > 25 ? "optimal" : "deficient", 
          recommendation: parseFloat(sensorData.readings.nitrogen) > 25 ? "Maintain current levels" : "Apply nitrogen fertilizer" 
        },
        phosphorus: { 
          value: sensorData.readings.phosphorus, 
          status: parseFloat(sensorData.readings.phosphorus) > 15 ? "optimal" : "deficient", 
          recommendation: parseFloat(sensorData.readings.phosphorus) > 15 ? "Monitor levels" : "Apply phosphate fertilizer" 
        },
        potassium: { 
          value: sensorData.readings.potassium, 
          status: parseFloat(sensorData.readings.potassium) > 150 ? "optimal" : "sufficient", 
          recommendation: "Maintain current levels" 
        },
        pH: { 
          value: sensorData.readings.pH, 
          status: parseFloat(sensorData.readings.pH) >= 6.0 && parseFloat(sensorData.readings.pH) <= 7.0 ? "optimal" : "needs_adjustment", 
          recommendation: parseFloat(sensorData.readings.pH) >= 6.0 && parseFloat(sensorData.readings.pH) <= 7.0 ? "Ideal for most crops" : "Consider pH adjustment" 
        },
      } : {
        nitrogen: { value: "2.8%", status: "optimal", recommendation: "Maintain current levels" },
        phosphorus: { value: "45 ppm", status: "deficient", recommendation: "Apply phosphate fertilizer" },
        potassium: { value: "180 ppm", status: "sufficient", recommendation: "Monitor levels" },
        pH: { value: "6.8", status: "optimal", recommendation: "Ideal for most crops" },
      },

      recommendations: [
        "Apply 50kg/ha of DAP fertilizer for phosphorus deficiency",
        "Maintain current irrigation schedule",
        "Consider adding organic compost to improve soil structure",
        "Test soil again in 4-6 weeks",
      ],

      cropSuitability: [
        { crop: "Wheat", suitability: "High", score: 85 },
        { crop: "Corn", suitability: "Medium", score: 72 },
        { crop: "Tomatoes", suitability: "High", score: 88 },
        { crop: "Beans", suitability: "High", score: 90 },
      ],

      aiInsights: sensorData ? [
        "Real-time sensor data shows stable soil conditions",
        "Good moisture retention detected",
        "Nutrient levels within acceptable ranges",
        "Ideal temperature for plant growth",
      ] : [
        "Soil shows good water retention capacity",
        "Moderate organic matter content detected",
        "Slight phosphorus deficiency identified",
        "Ideal pH level for most common crops",
      ],
    };

    return baseResults;
  };

  const analysisResults = generateAnalysisResults();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'sufficient':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'deficient':
      case 'needs_adjustment':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'sufficient':
        return 'bg-green-100 text-green-800';
      case 'deficient':
      case 'needs_adjustment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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
              Upload soil images or connect IoT sensors for comprehensive soil health assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <CloudUpload className="w-6 h-6 text-accent" />
                Data Input Methods
              </h3>

              {/* Soil Image Upload */}
              <div className="space-y-4 p-6 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors cursor-pointer bg-card">
                <div className="text-center space-y-3">
                  <CloudUpload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-lg">Upload Soil Image</h4>
                    <p className="text-sm text-muted-foreground">
                      JPEG, PNG, or TIFF images of soil samples only
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      ✓ Must contain soil/dirt/ground in filename
                    </p>
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.tiff,.tif"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <div className="space-y-2">
                      <p className="text-sm text-accent font-medium">
                        ✅ Valid soil image: {file.name}
                      </p>
                      <div className="flex justify-center">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Soil preview" 
                          className="max-h-32 rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* IoT Sensor Input */}
              <div className="space-y-4 p-6 border-2 border-dashed border-border rounded-lg hover:border-success transition-colors bg-card">
                <div className="text-center space-y-3">
                  <Radar className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-lg">IoT Soil Sensors</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect soil sensors for real-time analysis
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sensorId">Sensor ID</Label>
                    <Input
                      id="sensorId"
                      placeholder="Enter sensor identifier (e.g., SOIL-001)"
                      value={sensorId}
                      onChange={(e) => setSensorId(e.target.value)}
                      disabled={sensorConnected}
                    />
                  </div>

                  {sensorConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <Wifi className="w-5 h-5" />
                        <span className="font-medium">Connected to {sensorData?.sensorId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-green-50 rounded">
                          <div>Moisture</div>
                          <div className="font-bold">{sensorData?.readings.moisture}</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                          <div>Temperature</div>
                          <div className="font-bold">{sensorData?.readings.temperature}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        onClick={disconnectSensors}
                      >
                        <WifiOff className="w-4 h-4 mr-2" />
                        Disconnect Sensors
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-success text-success hover:bg-success hover:text-success-foreground"
                      onClick={connectSensors}
                      disabled={!sensorId.trim()}
                    >
                      <Wifi className="w-4 h-4 mr-2" />
                      Connect Sensors
                    </Button>
                  )}
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

                {/* Data Source Status */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Data Sources:</div>
                  <div className="space-y-1 text-xs">
                    {file && <div className="text-green-600">✓ Soil image uploaded</div>}
                    {sensorConnected && <div className="text-green-600">✓ IoT sensors connected</div>}
                    {!file && !sensorConnected && <div className="text-yellow-600">⚠ No data source selected</div>}
                  </div>
                </div>

                {/* Analysis Button */}
                <Button
                  onClick={runAnalysis}
                  disabled={analyzing || (!file && !sensorConnected)}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
                  size="lg"
                >
                  <Play className="mr-2 w-5 h-5" />
                  {analyzing ? "Analyzing..." : "Run AI Analysis"}
                </Button>

                {/* Progress Bar */}
                {analyzing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
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

      {/* Analysis Results Modal */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Leaf className="w-6 h-6 text-green-500" />
              Soil Analysis Results
            </DialogTitle>
            <DialogDescription>
              {sensorConnected 
                ? `Real-time analysis from sensor ${sensorData?.sensorId}` 
                : "Image-based soil analysis results"
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="crops">Crop Suitability</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Preview or Sensor Status */}
                <Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">
                      {file ? "Soil Image" : "Sensor Data"}
                    </h4>
                    {file ? (
                      <>
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Soil analysis" 
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="mt-3 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>File:</span>
                            <span className="font-medium">{analysisResults.imageInfo.fileName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium">{analysisResults.imageInfo.fileSize}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600">
                          <Wifi className="w-5 h-5" />
                          <span className="font-medium">Live Sensor Data</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-3 bg-green-50 rounded">
                            <div>Sensor ID</div>
                            <div className="font-bold">{sensorData?.sensorId}</div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded">
                            <div>Last Update</div>
                            <div className="font-bold">{sensorData?.lastUpdate}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between mt-3 text-sm">
                      <span>Analyzed:</span>
                      <span className="font-medium">{analysisResults.imageInfo?.dateAnalyzed || new Date().toLocaleDateString()}</span>
                    </div>
                  </Card>
                </Card>

                {/* Soil Properties */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-500" />
                    Soil Properties
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(analysisResults.soilProperties).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <Badge variant="secondary">{value}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* AI Insights */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-blue-500" />
                  AI Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResults.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Other tabs remain the same */}
            <TabsContent value="nutrients" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysisResults.nutrients).map(([nutrient, data]) => (
                  <Card key={nutrient} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold capitalize">{nutrient}</h4>
                      <Badge className={getStatusColor(data.status)}>
                        {getStatusIcon(data.status)}
                        {data.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-center">{data.value}</div>
                      <div className="text-sm text-muted-foreground text-center">
                        {data.recommendation}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-green-500" />
                  Actionable Recommendations
                </h4>
                <div className="space-y-3">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="crops" className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Crop Suitability Analysis</h4>
                <div className="space-y-4">
                  {analysisResults.cropSuitability.map((crop, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Sprout className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">{crop.crop}</div>
                          <div className="text-sm text-muted-foreground">
                            Suitability: {crop.suitability}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{crop.score}%</div>
                        <div className="text-sm text-muted-foreground">Match Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1" variant="outline" onClick={() => setShowAnalysis(false)}>
              Close
            </Button>
            <Button className="flex-1">
              Download Full Report
            </Button>
            <Button className="flex-1" variant="secondary">
              Schedule Follow-up Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AnalysisUpload;