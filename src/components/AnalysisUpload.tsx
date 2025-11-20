import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudUpload, Radar, MapPin, Play, X, CheckCircle, AlertTriangle, Info, Droplets, Sprout, Thermometer, Leaf, Wifi, WifiOff, Search, Navigation, ZoomIn, ZoomOut, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced region data with soil characteristics
const REGION_DATA = {
  laikipia: {
    name: "Laikipia County, Kenya",
    coordinates: { lat: 0.3333, lng: 36.8333, zoom: 10 },
    soilType: "Volcanic Loam",
    climate: "Semi-arid",
    altitude: "1800-2300m",
    rainfall: "600-800mm",
    commonCrops: ["Wheat", "Barley", "Potatoes", "Coffee"],
    soilChallenges: ["Soil erosion", "Low organic matter"]
  },
  punjab: {
    name: "Punjab, India",
    coordinates: { lat: 31.1471, lng: 75.3412, zoom: 8 },
    soilType: "Alluvial Soil",
    climate: "Subtropical",
    altitude: "200-300m",
    rainfall: "400-1000mm",
    commonCrops: ["Wheat", "Rice", "Cotton", "Sugarcane"],
    soilChallenges: ["Waterlogging", "Salinity"]
  },
  iowa: {
    name: "Iowa, USA",
    coordinates: { lat: 41.8780, lng: -93.0977, zoom: 7 },
    soilType: "Prairie Loam",
    climate: "Continental",
    altitude: "300-500m",
    rainfall: "800-900mm",
    commonCrops: ["Corn", "Soybeans", "Oats", "Hay"],
    soilChallenges: ["Nutrient runoff", "Soil compaction"]
  },
  custom: {
    name: "Custom Location",
    coordinates: { lat: 0, lng: 0, zoom: 2 },
    soilType: "Unknown",
    climate: "Unknown",
    altitude: "Unknown",
    rainfall: "Unknown",
    commonCrops: [],
    soilChallenges: []
  }
};

const AnalysisUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [region, setRegion] = useState("laikipia");
  const [sensorId, setSensorId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sensorConnected, setSensorConnected] = useState(false);
  const [sensorData, setSensorData] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState(REGION_DATA.laikipia.coordinates);
  const [zoomLevel, setZoomLevel] = useState(REGION_DATA.laikipia.coordinates.zoom);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationAnalysis, setLocationAnalysis] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get current region data
  const currentRegion = REGION_DATA[region as keyof typeof REGION_DATA];

  // Initialize map and geolocation
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return;

      // Simulate map loading
      setTimeout(() => {
        setMapLoaded(true);
        toast({
          title: "Map Loaded",
          description: "Interactive map is ready for location analysis",
        });
      }, 1000);
    };

    initializeMap();
  }, [toast]);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Getting your location...",
      description: "Please allow location access",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 12
        };
        
        setUserLocation(userCoords);
        setCurrentCoordinates(userCoords);
        setRegion("custom");
        setCustomLocation("Your Current Location");
        
        toast({
          title: "Location Found",
          description: "Using your current location for analysis",
        });

        // Analyze location
        analyzeLocation(userCoords);
      },
      (error) => {
        toast({
          title: "Location access denied",
          description: "Please enable location services or select a region manually",
          variant: "destructive",
        });
      }
    );
  };

  // Analyze location based on coordinates
  const analyzeLocation = (coords: {lat: number, lng: number}) => {
    // Simulate location-based soil analysis
    const analysis = {
      coordinates: coords,
      soilType: predictSoilType(coords),
      climateZone: predictClimateZone(coords),
      elevation: predictElevation(coords),
      waterAvailability: predictWaterAvailability(coords),
      recommendations: generateLocationRecommendations(coords),
      risks: identifyRisks(coords)
    };

    setLocationAnalysis(analysis);
  };

  // Mock prediction functions
  const predictSoilType = (coords: {lat: number, lng: number}) => {
    const soilTypes = ["Clay Loam", "Sandy Loam", "Silt Loam", "Peaty Soil", "Chalky Soil"];
    return soilTypes[Math.floor(Math.random() * soilTypes.length)];
  };

  const predictClimateZone = (coords: {lat: number, lng: number}) => {
    if (coords.lat > 35) return "Temperate";
    if (coords.lat < -35) return "Temperate";
    if (Math.abs(coords.lat) < 23.5) return "Tropical";
    return "Arid";
  };

  const predictElevation = (coords: {lat: number, lng: number}) => {
    return `${Math.round(100 + Math.random() * 2000)}m`;
  };

  const predictWaterAvailability = (coords: {lat: number, lng: number}) => {
    const availability = ["Low", "Moderate", "High"];
    return availability[Math.floor(Math.random() * availability.length)];
  };

  const generateLocationRecommendations = (coords: {lat: number, lng: number}) => {
    const recommendations = [
      "Consider soil testing for precise nutrient analysis",
      "Implement water conservation practices",
      "Use cover crops to improve soil health",
      "Rotate crops to maintain soil fertility"
    ];
    return recommendations.slice(0, 2 + Math.floor(Math.random() * 2));
  };

  const identifyRisks = (coords: {lat: number, lng: number}) => {
    const risks = [
      "Potential soil erosion in hilly areas",
      "Seasonal water scarcity",
      "Nutrient leaching in sandy soils",
      "Soil compaction risk"
    ];
    return risks.slice(0, 1 + Math.floor(Math.random() * 2));
  };

  // Update map when region changes
  useEffect(() => {
    if (region !== "custom") {
      setCurrentCoordinates(currentRegion.coordinates);
      setZoomLevel(currentRegion.coordinates.zoom);
      analyzeLocation(currentRegion.coordinates);
    }
  }, [region, currentRegion]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleCustomLocation = () => {
    if (!customLocation.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Searching Location",
      description: `Analyzing soil conditions for ${customLocation}`,
    });

    // Simulate geocoding and analysis
    setTimeout(() => {
      const newCoords = {
        lat: (Math.random() * 180 - 90),
        lng: (Math.random() * 360 - 180),
        zoom: 12
      };
      
      setCurrentCoordinates(newCoords);
      setZoomLevel(12);
      analyzeLocation(newCoords);
      
      toast({
        title: "Location Analyzed",
        description: `Soil analysis complete for ${customLocation}`,
      });
    }, 1500);
  };

  // Soil image validation (same as before)
  const validateSoilImage = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/tif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, or TIFF images only",
        variant: "destructive",
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload images smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

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

  // Mock IoT sensor connection (same as before)
  const connectSensors = () => {
    if (!sensorId.trim()) {
      toast({
        title: "Sensor ID required",
        description: "Please enter a valid sensor ID",
        variant: "destructive",
      });
      return;
    }

    setSensorConnected(true);
    
    const mockSensorData = {
      sensorId: sensorId,
      status: "connected",
      lastUpdate: new Date().toLocaleTimeString(),
      location: currentCoordinates,
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
      description: `Sensor ${sensorId} providing data from ${currentRegion.name}`,
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
            description: "Your comprehensive soil analysis results are ready.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Generate analysis results with location data
  const generateAnalysisResults = () => {
    const regionInfo = REGION_DATA[region as keyof typeof REGION_DATA];
    
    return {
      locationInfo: {
        region: regionInfo.name,
        coordinates: currentCoordinates,
        soilType: locationAnalysis?.soilType || regionInfo.soilType,
        climate: locationAnalysis?.climateZone || regionInfo.climate,
        altitude: locationAnalysis?.elevation || regionInfo.altitude,
        waterAvailability: locationAnalysis?.waterAvailability,
      },
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
        ...(locationAnalysis?.recommendations || []),
        "Apply 50kg/ha of DAP fertilizer for phosphorus deficiency",
        "Maintain current irrigation schedule",
        "Consider adding organic compost to improve soil structure",
        "Test soil again in 4-6 weeks",
      ],

      cropSuitability: regionInfo.commonCrops.map(crop => ({
        crop,
        suitability: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
        score: 60 + Math.floor(Math.random() * 35)
      })),

      aiInsights: [
        ...(locationAnalysis?.risks || []).map(risk => `⚠️ ${risk}`),
        "Soil shows good water retention capacity",
        "Moderate organic matter content detected",
        "Slight phosphorus deficiency identified",
        "Ideal pH level for most common crops",
      ],
    };
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
              Advanced soil analysis with location-based insights and IoT integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section - Same as before */}
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

            {/* Enhanced Location Analysis Section */}
            <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <MapPin className="w-6 h-6 text-accent" />
                Location Analysis
              </h3>

              {/* Interactive Map */}
              <div className="h-64 bg-muted rounded-lg overflow-hidden shadow-inner relative">
                {!mapLoaded ? (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Loading interactive map...</p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative">
                    {/* Map Background with Grid */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMEg0MFY0MEgwVjBaIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0wIDBINDBNNDAgMEw0MCA0ME0wIDBMNDAgNDBNMCA0MEw0MCAwTTAgMEw0MCA0ME0wIDQwTDQwIDAiIHN0cm9rZT0iI0RERERERCIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4K')]"></div>
                    
                    {/* Map Center Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {currentRegion.name.split(',')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Coordinates Display */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {currentCoordinates.lat.toFixed(4)}°, {currentCoordinates.lng.toFixed(4)}°
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Location Button */}
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-2 left-2"
                      onClick={getUserLocation}
                    >
                      <Compass className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Location Analysis Results */}
              {locationAnalysis && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                    <MapPin className="w-5 h-5" />
                    Location Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-blue-600 font-medium">Soil Type</div>
                      <div>{locationAnalysis.soilType}</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-medium">Climate Zone</div>
                      <div>{locationAnalysis.climateZone}</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-medium">Elevation</div>
                      <div>{locationAnalysis.elevation}</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-medium">Water Availability</div>
                      <div>{locationAnalysis.waterAvailability}</div>
                    </div>
                  </div>
                </Card>
              )}

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

                {/* Custom Location Search */}
                {region === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customLocation">Search Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="customLocation"
                        placeholder="Enter address or coordinates..."
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                      />
                      <Button onClick={handleCustomLocation} size="sm">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Current Location Info */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm font-medium">Analysis Location:</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {currentRegion.name}
                    {region === "custom" && customLocation && ` - ${customLocation}`}
                  </div>
                  <div className="text-xs text-green-500 mt-1">
                    Zoom: {zoomLevel}x • {currentCoordinates.lat.toFixed(4)}°, {currentCoordinates.lng.toFixed(4)}°
                  </div>
                </div>

                {/* Data Source Status */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Data Sources:</div>
                  <div className="space-y-1 text-xs">
                    {file && <div className="text-green-600">✓ Soil image uploaded</div>}
                    {sensorConnected && <div className="text-green-600">✓ IoT sensors connected</div>}
                    {locationAnalysis && <div className="text-blue-600">✓ Location analyzed</div>}
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
                  {analyzing ? "Analyzing..." : "Run Comprehensive Analysis"}
                </Button>

                {/* Progress Bar */}
                {analyzing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground">
                      Analyzing soil and location data... {progress}%
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Analysis Results Modal with Location Data */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Leaf className="w-6 h-6 text-green-500" />
              Comprehensive Soil Analysis
            </DialogTitle>
            <DialogDescription>
              {sensorConnected 
                ? `Real-time analysis from ${sensorData?.sensorId} in ${analysisResults.locationInfo.region}` 
                : `Image-based analysis for ${analysisResults.locationInfo.region}`
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
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
                            <span className="font-medium">{analysisResults.imageInfo?.fileName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium">{analysisResults.locationInfo.region}</span>
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
                            <div>Location</div>
                            <div className="font-bold">{analysisResults.locationInfo.region}</div>
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

                {/* Location Summary */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Location Summary
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(analysisResults.locationInfo).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="capitalize font-medium text-blue-700">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <Badge variant="outline" className="text-blue-600">{value}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Soil Properties */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-500" />
                  Soil Properties
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(analysisResults.soilProperties).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="font-bold text-lg">{value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Insights */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-blue-500" />
                  AI Insights & Location Analysis
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

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Detailed Location Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium text-lg">Geographic Information</h5>
                    <div className="space-y-3">
                      {Object.entries(analysisResults.locationInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-bold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-medium text-lg">Regional Characteristics</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded">
                        <div className="font-medium text-green-700">Common Crops</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentRegion.commonCrops.map((crop, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded">
                        <div className="font-medium text-yellow-700">Soil Challenges</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentRegion.soilChallenges.map((challenge, index) => (
                            <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                              {challenge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Other tabs remain similar but enhanced with location context */}
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
                <h4 className="font-semibold mb-3">Crop Suitability for {analysisResults.locationInfo.region}</h4>
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
              Download  Report
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