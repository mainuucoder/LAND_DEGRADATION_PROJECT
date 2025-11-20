import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
 import { pdfExportService } from '@/utils/pdf-export';
import { 
  Satellite, 
  Map, 
  Download, 
  RefreshCw, 
  Plus,
  Database,
  AlertTriangle,
  CheckCircle,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { satelliteDataClient, MonitoringPoint, SoilMetrics } from "@/integrations/supabase/satellite-client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// Fix for default markers
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SatelliteAnalysis = () => {
  const navigate = useNavigate();
  const [monitoringPoints, setMonitoringPoints] = useState<(MonitoringPoint & { latest_metrics: SoilMetrics | null })[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(null);
  const [soilMetrics, setSoilMetrics] = useState<SoilMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const { toast } = useToast();

  // Initialize and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await satelliteDataClient.initializeSampleData();
        await loadData();
        setUsingMockData(satelliteDataClient.isUsingMockData());
      } catch (error) {
        console.error('Initialization error:', error);
        setUsingMockData(true);
        await loadData(); // Try to load with mock data
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load monitoring points and data
  const loadData = async () => {
    try {
      const pointsWithMetrics = await satelliteDataClient.getMonitoringPointsWithLatestMetrics();
      setMonitoringPoints(pointsWithMetrics);
      
      if (pointsWithMetrics.length > 0 && !selectedPoint) {
        setSelectedPoint(pointsWithMetrics[0]);
        await loadSoilMetrics(pointsWithMetrics[0].id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: "Unable to load monitoring points.",
      });
    }
  };

  const loadSoilMetrics = async (pointId: string) => {
    try {
      const metrics = await satelliteDataClient.getSoilMetrics(pointId, 10);
      setSoilMetrics(metrics);
    } catch (error) {
      console.error('Failed to load soil metrics:', error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    
    toast({
      title: "Data Refreshed",
      description: "Latest data has been loaded.",
    });
  };

  const handlePointSelect = async (point: MonitoringPoint) => {
    setSelectedPoint(point);
    await loadSoilMetrics(point.id);
  };

  const addMonitoringPoint = async () => {
    try {
      const mockPoints = [
        { name: "West Vineyard", coordinates: [-122.4194, 37.7749] as [number, number], description: "Wine grape cultivation", elevation: 85 },
        { name: "Central Farm", coordinates: [-95.7129, 37.0902] as [number, number], description: "Mixed crop farm", elevation: 320 },
        { name: "Lake Side", coordinates: [-84.3880, 33.7490] as [number, number], description: "Near water source", elevation: 225 },
      ];

      const randomPoint = mockPoints[Math.floor(Math.random() * mockPoints.length)];
      await satelliteDataClient.createMonitoringPoint(randomPoint);
      
      toast({
        title: "Monitoring Point Added",
        description: `Added ${randomPoint.name} to your monitoring locations.`,
      });
      
      await loadData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add point",
        description: "Unable to create monitoring point.",
      });
    }
  };

  const addSoilData = async (pointId: string) => {
    try {
      const mockMetrics = {
        monitoring_point_id: pointId,
        moisture_level: Math.floor(Math.random() * 100),
        vegetation_index: 0.3 + Math.random() * 0.5,
        soil_temperature: 15 + Math.floor(Math.random() * 20),
        nitrogen_level: Math.floor(Math.random() * 100),
        phosphorus_level: Math.floor(Math.random() * 100),
        potassium_level: Math.floor(Math.random() * 100),
        ph_level: 5.5 + Math.random() * 3,
        organic_matter: Math.floor(Math.random() * 10),
        measurement_date: new Date().toISOString(),
        data_source: usingMockData ? "Demo Data" : "Satellite Analysis"
      };

      await satelliteDataClient.addSoilMetrics(mockMetrics);
      
      toast({
        title: "Soil Data Added",
        description: "New soil metrics have been recorded.",
      });
      
      if (selectedPoint?.id === pointId) {
        await loadSoilMetrics(pointId);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add soil data",
        description: "Unable to record soil metrics.",
      });
    }
  };

 

// Replace the exportData function with this:
const exportData = async () => {
  try {
    if (!selectedPoint) return;

    toast({
      title: "Generating Report...",
      description: "Creating comprehensive PDF analysis.",
    });

    const reportData = {
      monitoringPoint: selectedPoint,
      soilMetrics: soilMetrics,
      analysisDate: new Date().toISOString()
    };

    const pdfBlob = await pdfExportService.generateSoilAnalysisReport(reportData);
    
    saveAs(pdfBlob, `soil-analysis-${selectedPoint.name}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Report Generated",
      description: "Comprehensive soil analysis PDF has been downloaded.",
    });
  } catch (error) {
    console.error('Export error:', error);
    toast({
      variant: "destructive",
      title: "Export Failed",
      description: "Unable to generate PDF report. Please try again.",
    });
  }
};

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'moisture':
        return value < 30 ? 'bg-red-500' : value < 60 ? 'bg-yellow-500' : 'bg-green-500';
      case 'vegetation':
        return value < 0.3 ? 'bg-red-500' : value < 0.6 ? 'bg-yellow-500' : 'bg-green-500';
      case 'nutrient':
        return value < 30 ? 'bg-red-500' : value < 60 ? 'bg-yellow-500' : 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusText = (value: number, type: string) => {
    switch (type) {
      case 'moisture':
        return value < 30 ? 'Low' : value < 60 ? 'Moderate' : 'Optimal';
      case 'vegetation':
        return value < 0.3 ? 'Poor' : value < 0.6 ? 'Moderate' : 'Healthy';
      case 'nutrient':
        return value < 30 ? 'Deficient' : value < 60 ? 'Adequate' : 'Optimal';
      default:
        return 'Normal';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p>Loading satellite data...</p>
        </div>
      </div>
    );
  }
// const navigate = useNavigate();
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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
          <Satellite className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Satellite Analysis</h1>
            <p className="text-muted-foreground">
              Real-time soil health monitoring with satellite data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addMonitoringPoint} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Point
          </Button>
          <Button onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Data Status Alert */}
      {usingMockData && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Demo Mode:</strong> Using sample data. Run the SQL setup in Supabase to enable database features.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monitoring Points Map</CardTitle>
            <CardDescription>
              {monitoringPoints.length} monitoring points configured • {usingMockData ? 'Demo Data' : 'Live Data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden border">
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {monitoringPoints.map((point) => (
                  <Marker
                    key={point.id}
                    position={[point.coordinates[1], point.coordinates[0]]}
                    eventHandlers={{
                      click: () => handlePointSelect(point),
                    }}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[200px]">
                        <h3 className="font-semibold">{point.name}</h3>
                        <p className="text-sm text-muted-foreground">{point.description}</p>
                        {point.elevation && (
                          <p className="text-sm">Elevation: {point.elevation}m</p>
                        )}
                        {point.latest_metrics && (
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Moisture:</span>
                              <span className="font-medium">{point.latest_metrics.moisture_level}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vegetation:</span>
                              <span className="font-medium">{point.latest_metrics.vegetation_index.toFixed(3)}</span>
                            </div>
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => addSoilData(point.id)}
                        >
                          Add Soil Data
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedPoint ? selectedPoint.name : 'Select a Point'}
            </CardTitle>
            <CardDescription>
              {selectedPoint ? selectedPoint.description : 'Click on a monitoring point to view data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedPoint && soilMetrics.length > 0 ? (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Latest Measurements</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Moisture Level', value: soilMetrics[0].moisture_level, type: 'moisture' },
                      { label: 'Vegetation Index', value: soilMetrics[0].vegetation_index, type: 'vegetation' },
                      { label: 'Soil Temperature', value: soilMetrics[0].soil_temperature, type: 'temperature' },
                      { label: 'Nitrogen', value: soilMetrics[0].nitrogen_level, type: 'nutrient' },
                      { label: 'Phosphorus', value: soilMetrics[0].phosphorus_level, type: 'nutrient' },
                      { label: 'Potassium', value: soilMetrics[0].potassium_level, type: 'nutrient' },
                    ].map((metric, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span>{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {metric.type === 'vegetation' 
                              ? metric.value.toFixed(3)
                              : metric.value % 1 === 0 
                                ? metric.value 
                                : metric.value.toFixed(1)
                            }
                            {metric.label.includes('Temperature') ? '°C' : 
                             metric.type === 'vegetation' ? '' : '%'}
                          </span>
                          {metric.type !== 'temperature' && (
                            <Badge variant="outline" className="text-xs">
                              {getStatusText(metric.value, metric.type)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Recent History</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {soilMetrics.slice(0, 5).map((metric, index) => (
                      <div key={index} className="flex justify-between items-center text-xs p-2 bg-muted/30 rounded">
                        <span>{new Date(metric.measurement_date).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          <span>M: {metric.moisture_level}%</span>
                          <span>V: {metric.vegetation_index.toFixed(2)}</span>
                          <span>T: {metric.soil_temperature}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={exportData}>
  <FileText className="w-4 h-4 mr-2" />
  Export PDF Report
</Button>
                  <Button variant="outline" className="flex-1" onClick={() => addSoilData(selectedPoint.id)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Data
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a monitoring point to view soil analysis data</p>
                {selectedPoint && soilMetrics.length === 0 && (
                  <Button 
                    className="mt-4"
                    onClick={() => addSoilData(selectedPoint.id)}
                  >
                    Add Sample Data
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle>Data Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span>Data Mode</span>
              <Badge variant={usingMockData ? "secondary" : "default"}>
                {usingMockData ? "Demo" : "Live"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span>Monitoring Points</span>
              <Badge>{monitoringPoints.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span>Soil Measurements</span>
              <Badge>{soilMetrics.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span>Last Updated</span>
              <Badge variant="outline">
                {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatelliteAnalysis;