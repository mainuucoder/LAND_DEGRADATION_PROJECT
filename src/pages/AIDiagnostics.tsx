import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, AlertTriangle, CheckCircle, Clock, RefreshCw, Leaf, Droplets, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Mock AI analysis service with learning capabilities
const AISoilAnalysisService = {
  async analyzeSoil(userInput: any) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI learns from user input and provides personalized recommendations
    const { cropType, soilType, lastFertilizer, issues, region } = userInput;
    
    // AI logic based on user inputs
    let pHRecommendation = '';
    let nutrientRecommendation = '';
    let moistureRecommendation = '';
    let generalRecommendations = [];

    // AI learning from crop type - expanded with more crops
    const cropPreferences: any = {
      // Cereals
      wheat: { optimalPH: [6.0, 7.0], nitrogen: 'high' },
      corn: { optimalPH: [5.8, 6.8], nitrogen: 'very high' },
      rice: { optimalPH: [5.0, 6.5], nitrogen: 'medium' },
      barley: { optimalPH: [6.0, 7.0], nitrogen: 'medium' },
      oats: { optimalPH: [5.5, 7.0], nitrogen: 'medium' },
      rye: { optimalPH: [5.0, 6.5], nitrogen: 'low' },
      millet: { optimalPH: [5.5, 7.0], nitrogen: 'low' },
      sorghum: { optimalPH: [5.5, 7.5], nitrogen: 'medium' },
      
      // Legumes
      soybean: { optimalPH: [6.0, 6.8], nitrogen: 'low' },
      peanuts: { optimalPH: [5.5, 6.5], nitrogen: 'low' },
      lentils: { optimalPH: [5.5, 7.0], nitrogen: 'low' },
      chickpeas: { optimalPH: [5.5, 7.0], nitrogen: 'low' },
      beans: { optimalPH: [6.0, 7.0], nitrogen: 'low' },
      peas: { optimalPH: [6.0, 7.5], nitrogen: 'low' },
      
      // Vegetables
      tomato: { optimalPH: [5.5, 6.8], nitrogen: 'medium' },
      potato: { optimalPH: [4.8, 5.5], nitrogen: 'medium' },
      carrot: { optimalPH: [5.5, 7.0], nitrogen: 'medium' },
      onion: { optimalPH: [6.0, 7.0], nitrogen: 'medium' },
      cabbage: { optimalPH: [6.0, 7.5], nitrogen: 'high' },
      broccoli: { optimalPH: [6.0, 7.0], nitrogen: 'high' },
      cauliflower: { optimalPH: [6.0, 7.0], nitrogen: 'high' },
      spinach: { optimalPH: [6.0, 7.5], nitrogen: 'high' },
      lettuce: { optimalPH: [6.0, 7.0], nitrogen: 'medium' },
      cucumber: { optimalPH: [5.5, 7.0], nitrogen: 'medium' },
      pepper: { optimalPH: [5.5, 6.8], nitrogen: 'medium' },
      eggplant: { optimalPH: [5.5, 6.5], nitrogen: 'medium' },
      
      // Fruits
      strawberries: { optimalPH: [5.5, 6.5], nitrogen: 'medium' },
      blueberries: { optimalPH: [4.5, 5.5], nitrogen: 'low' },
      grapes: { optimalPH: [5.5, 6.5], nitrogen: 'low' },
      apples: { optimalPH: [5.5, 6.5], nitrogen: 'medium' },
      citrus: { optimalPH: [6.0, 7.0], nitrogen: 'medium' },
      
      // Cash crops
      cotton: { optimalPH: [5.5, 7.0], nitrogen: 'high' },
      sugarcane: { optimalPH: [6.0, 7.5], nitrogen: 'very high' },
      tobacco: { optimalPH: [5.5, 6.5], nitrogen: 'medium' },
      coffee: { optimalPH: [5.0, 6.0], nitrogen: 'medium' },
      tea: { optimalPH: [4.5, 5.5], nitrogen: 'medium' },
      
      // Root crops
      sweet_potato: { optimalPH: [5.5, 6.5], nitrogen: 'medium' },
      cassava: { optimalPH: [5.5, 6.5], nitrogen: 'low' },
      turnip: { optimalPH: [6.0, 7.5], nitrogen: 'medium' },
      radish: { optimalPH: [6.0, 7.0], nitrogen: 'medium' },
      
      // Other
      sunflower: { optimalPH: [6.0, 7.5], nitrogen: 'medium' },
      alfalfa: { optimalPH: [6.5, 7.5], nitrogen: 'low' }
    };

    const cropInfo = cropPreferences[cropType] || { optimalPH: [6.0, 7.0], nitrogen: 'medium' };

    // Generate AI recommendations based on inputs
    if (soilType === 'clay') {
      moistureRecommendation = 'Clay soil retains water well. Reduce irrigation frequency to prevent waterlogging.';
      generalRecommendations.push('Add organic matter to improve drainage');
    } else if (soilType === 'sandy') {
      moistureRecommendation = 'Sandy soil drains quickly. Increase irrigation frequency and consider water-retaining amendments.';
      generalRecommendations.push('Add compost to improve water retention');
    }

    if (lastFertilizer?.includes('nitrogen')) {
      nutrientRecommendation = 'Recent nitrogen application detected. Monitor plant growth and adjust future applications accordingly.';
    }

    if (issues?.includes('yellow')) {
      nutrientRecommendation += ' Yellowing leaves may indicate nitrogen deficiency. Consider soil testing.';
      generalRecommendations.push('Test for specific nutrient deficiencies');
    }

    if (issues?.includes('drought')) {
      moistureRecommendation += ' Implement water conservation techniques and consider drought-resistant crop varieties.';
    }

    // Mock AI analysis results based on user input
    return {
      pH: {
        value: (cropInfo.optimalPH[0] + Math.random() * (cropInfo.optimalPH[1] - cropInfo.optimalPH[0])).toFixed(1),
        status: Math.random() > 0.3 ? 'optimal' : 'needs_attention',
        recommendation: pHRecommendation || `Maintain pH between ${cropInfo.optimalPH[0]} and ${cropInfo.optimalPH[1]} for ${cropType.replace('_', ' ')}`
      },
      nutrients: {
        nitrogen: cropInfo.nitrogen === 'very high' ? 'sufficient' : Math.random() > 0.4 ? 'sufficient' : 'deficient',
        phosphorus: Math.random() > 0.4 ? 'sufficient' : 'deficient',
        potassium: Math.random() > 0.4 ? 'sufficient' : 'deficient',
        recommendation: nutrientRecommendation || `Based on your ${cropType.replace('_', ' ')} crop, focus on ${cropInfo.nitrogen} nitrogen management`
      },
      moisture: {
        level: Math.random() > 0.5 ? 'optimal' : 'low',
        recommendation: moistureRecommendation || 'Monitor soil moisture regularly and adjust irrigation based on weather conditions'
      },
      aiInsights: {
        cropSuitability: Math.random() > 0.2 ? 'high' : 'moderate',
        predictedYield: (70 + Math.random() * 25).toFixed(0),
        riskFactors: issues ? `Addressing: ${issues}` : 'Low risk profile'
      },
      recommendations: generalRecommendations.length > 0 ? generalRecommendations : [
        'Apply balanced fertilizer before planting',
        'Monitor soil moisture weekly',
        'Test soil every 2-3 years'
      ],
      timestamp: new Date().toISOString(),
      confidence: (80 + Math.random() * 15).toFixed(1)
    };
  }
};

const AIDiagnostics = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // User input state
  const [userInput, setUserInput] = useState({
    cropType: '',
    soilType: '',
    lastFertilizer: '',
    issues: '',
    region: '',
    farmSize: '',
    irrigationType: '',
    previousYield: ''
  });

  const runAnalysis = async () => {
    if (!userInput.cropType) {
      alert('Please select a crop type to get personalized recommendations');
      return;
    }

    setIsLoading(true);
    try {
      const results = await AISoilAnalysisService.analyzeSoil(userInput);
      setAnalysis(results);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'sufficient':
      case 'high':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'needs_attention':
      case 'deficient':
      case 'low':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'sufficient':
      case 'high':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'needs_attention':
      case 'deficient':
      case 'low':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
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
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Soil Diagnostics</h1>
        </div>
        {analysis && (
          <div className="text-sm text-muted-foreground">
            AI Confidence: {analysis.confidence}%
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Soil Health Report</CardTitle>
            <CardDescription>
              {analysis ? 'Personalized AI analysis results' : 'Provide farm details for analysis'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3">AI is analyzing your farm data...</span>
              </div>
            ) : analysis ? (
              <>
                {/* Crop-specific insights */}
                {userInput.cropType && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Leaf className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Crop Analysis: {userInput.cropType.replace('_', ' ')}</p>
                      <p className="text-sm">Suitability: <span className="capitalize">{analysis.aiInsights.cropSuitability}</span></p>
                      <p className="text-xs opacity-75 mt-1">Predicted Yield: {analysis.aiInsights.predictedYield}% of optimal</p>
                    </div>
                  </div>
                )}

                <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(analysis.pH.status)}`}>
                  {getStatusIcon(analysis.pH.status)}
                  <div>
                    <p className="font-medium">pH Level</p>
                    <p className="text-sm">
                      {analysis.pH.value} - {analysis.pH.status.replace('_', ' ')}
                    </p>
                    <p className="text-xs opacity-75 mt-1">{analysis.pH.recommendation}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(analysis.nutrients.nitrogen)}`}>
                  {getStatusIcon(analysis.nutrients.nitrogen)}
                  <div>
                    <p className="font-medium">Nutrient Balance</p>
                    <p className="text-sm">
                      N: {analysis.nutrients.nitrogen} | P: {analysis.nutrients.phosphorus} | K: {analysis.nutrients.potassium}
                    </p>
                    <p className="text-xs opacity-75 mt-1">{analysis.nutrients.recommendation}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(analysis.moisture.level)}`}>
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Soil Moisture</p>
                    <p className="text-sm capitalize">{analysis.moisture.level}</p>
                    <p className="text-xs opacity-75 mt-1">{analysis.moisture.recommendation}</p>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Recommendations
                  </h4>
                  <ul className="text-sm space-y-1">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {lastUpdated && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Last Analysis</p>
                      <p className="text-sm text-gray-600">{lastUpdated}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Provide farm details and run analysis to get AI recommendations
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Information</CardTitle>
            <CardDescription>Help AI learn about your farm for better recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Primary Crop *</Label>
                <Select onValueChange={(value) => handleInputChange('cropType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {/* Cereals */}
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="barley">Barley</SelectItem>
                    <SelectItem value="oats">Oats</SelectItem>
                    <SelectItem value="rye">Rye</SelectItem>
                    <SelectItem value="millet">Millet</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                    
                    {/* Legumes */}
                    <SelectItem value="soybean">Soybean</SelectItem>
                    <SelectItem value="peanuts">Peanuts</SelectItem>
                    <SelectItem value="lentils">Lentils</SelectItem>
                    <SelectItem value="chickpeas">Chickpeas</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                    <SelectItem value="peas">Peas</SelectItem>
                    
                    {/* Vegetables */}
                    <SelectItem value="tomato">Tomato</SelectItem>
                    <SelectItem value="potato">Potato</SelectItem>
                    <SelectItem value="carrot">Carrot</SelectItem>
                    <SelectItem value="onion">Onion</SelectItem>
                    <SelectItem value="cabbage">Cabbage</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="cauliflower">Cauliflower</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                    <SelectItem value="lettuce">Lettuce</SelectItem>
                    <SelectItem value="cucumber">Cucumber</SelectItem>
                    <SelectItem value="pepper">Pepper</SelectItem>
                    <SelectItem value="eggplant">Eggplant</SelectItem>
                    
                    {/* Fruits */}
                    <SelectItem value="strawberries">Strawberries</SelectItem>
                    <SelectItem value="blueberries">Blueberries</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="apples">Apples</SelectItem>
                    <SelectItem value="citrus">Citrus</SelectItem>
                    
                    {/* Cash crops */}
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="tobacco">Tobacco</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    
                    {/* Root crops */}
                    <SelectItem value="sweet_potato">Sweet Potato</SelectItem>
                    <SelectItem value="cassava">Cassava</SelectItem>
                    <SelectItem value="turnip">Turnip</SelectItem>
                    <SelectItem value="radish">Radish</SelectItem>
                    
                    {/* Other */}
                    <SelectItem value="sunflower">Sunflower</SelectItem>
                    <SelectItem value="alfalfa">Alfalfa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select onValueChange={(value) => handleInputChange('soilType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastFertilizer">Recent Fertilizer Used</Label>
              <Input
                id="lastFertilizer"
                placeholder="e.g., NPK 10-10-10, Urea, etc."
                value={userInput.lastFertilizer}
                onChange={(e) => handleInputChange('lastFertilizer', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issues">Current Issues or Concerns</Label>
              <Textarea
                id="issues"
                placeholder="e.g., yellow leaves, poor growth, drought, pests..."
                value={userInput.issues}
                onChange={(e) => handleInputChange('issues', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region/Climate</Label>
                <Input
                  id="region"
                  placeholder="e.g., Tropical, Arid, Temperate"
                  value={userInput.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size (acres)</Label>
                <Input
                  id="farmSize"
                  placeholder="e.g., 50"
                  value={userInput.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={runAnalysis}
              disabled={isLoading || !userInput.cropType}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  AI Analyzing...
                </>
              ) : (
                'Get AI Recommendations'
              )}
            </Button>
            
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Brain className="w-4 h-4" />
                How AI Uses Your Data:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Personalizes recommendations for your specific crop</li>
                <li>• Adjusts for local climate and soil conditions</li>
                <li>• Learns from your current issues to provide targeted solutions</li>
                <li>• Considers your farming practices for sustainable advice</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIDiagnostics;