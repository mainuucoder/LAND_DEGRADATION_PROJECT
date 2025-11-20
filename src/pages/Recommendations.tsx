import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Droplets, Sun, Shield, Calendar, CheckCircle, Clock, AlertTriangle, ArrowLeft, X, CloudRain, Thermometer, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  // Sample recommendation data
  const recommendations = {
    irrigation: {
      title: "Smart Irrigation",
      description: "Optimize water usage based on real-time soil moisture data",
      status: "optimal",
      schedule: [
        { day: "Monday", time: "06:00 AM", duration: "45 min", zone: "North Field", soilMoisture: "45%", waterSaved: "1200L" },
        { day: "Wednesday", time: "06:00 AM", duration: "30 min", zone: "South Field", soilMoisture: "38%", waterSaved: "800L" },
        { day: "Friday", time: "06:00 AM", duration: "45 min", zone: "North Field", soilMoisture: "42%", waterSaved: "1200L" },
        { day: "Sunday", time: "06:00 AM", duration: "25 min", zone: "East Field", soilMoisture: "35%", waterSaved: "600L" }
      ],
      tips: [
        "Water early morning to reduce evaporation",
        "Check soil moisture before irrigation",
        "Adjust based on rainfall forecast",
        "Use drip irrigation for water-intensive crops",
        "Monitor weather forecasts for rain probability"
      ],
      statistics: {
        totalWaterSaved: "3800L",
        efficiency: "92%",
        costSavings: "$45"
      }
    },
    fertilization: {
      title: "Precision Fertilization",
      description: "Balanced nutrient application based on soil analysis",
      status: "needs_attention",
      plan: {
        nitrogen: "50 kg/ha",
        phosphorus: "30 kg/ha",
        potassium: "40 kg/ha",
        timing: "Apply within next 7 days",
        method: "Broadcast application followed by light irrigation"
      },
      products: [
        { name: "NPK 15-15-15", quantity: "200 kg", purpose: "Base application" },
        { name: "Urea", quantity: "100 kg", purpose: "Top dressing" },
        { name: "Organic compost", quantity: "500 kg", purpose: "Soil amendment" },
        { name: "Micronutrient mix", quantity: "25 kg", purpose: "Foliar spray" }
      ],
      schedule: [
        { date: "Today", task: "Soil testing", priority: "high" },
        { date: "Tomorrow", task: "Purchase fertilizers", priority: "medium" },
        { date: "Day 3", task: "Apply base fertilizer", priority: "high" },
        { date: "Day 7", task: "Top dressing application", priority: "medium" }
      ]
    },
    protection: {
      title: "Crop Protection",
      description: "Integrated pest and disease management",
      status: "good",
      measures: [
        { action: "Apply neem oil spray", frequency: "Every 14 days", target: "Aphid control" },
        { action: "Monitor fungal infections", frequency: "After rainfall", target: "Powdery mildew" },
        { action: "Install pheromone traps", frequency: "Monthly", target: "Moth prevention" },
        { action: "Weed management", frequency: "Weekly", target: "Broadleaf weeds" }
      ],
      schedule: {
        spraying: "Every 14 days",
        monitoring: "Daily visual checks",
        preventive: "Apply before heavy rain",
        nextSpraying: "2024-01-20"
      },
      products: [
        { name: "Neem Oil", dosage: "2ml/L", safety: "Organic" },
        { name: "Copper Fungicide", dosage: "3g/L", safety: "Wait 7 days" },
        { name: "Biological Control", dosage: "As directed", safety: "Safe" }
      ]
    },
    planting: {
      title: "Planting Schedule",
      description: "Optimal timing for next crop rotation",
      status: "upcoming",
      crops: [
        { name: "Wheat", optimalDate: "Oct 15 - Nov 15", status: "recommended", yield: "4.2 tons/ha", requirements: "Well-drained soil" },
        { name: "Legumes", optimalDate: "Nov 1 - Nov 30", status: "alternative", yield: "2.8 tons/ha", requirements: "Nitrogen-fixing" },
        { name: "Cover Crop", optimalDate: "Immediate", status: "urgent", yield: "N/A", requirements: "Soil improvement" }
      ],
      calendar: [
        { week: "Current", tasks: ["Soil preparation", "Finalize seed selection"] },
        { week: "Next Week", tasks: ["Planting begins", "Initial irrigation"] },
        { week: "Week 3", tasks: ["First weeding", "Pest monitoring"] },
        { week: "Month 2", tasks: ["Fertilizer application", "Growth assessment"] }
      ]
    }
  };

  const weeklyPlan = [
    { id: "1", task: "Water northern section", priority: "high", duration: "45 min", category: "irrigation" },
    { id: "2", task: "Apply nitrogen fertilizer", priority: "medium", duration: "2 hours", category: "fertilization" },
    { id: "3", task: "Soil sample collection", priority: "medium", duration: "1 hour", category: "monitoring" },
    { id: "4", task: "Pest monitoring check", priority: "low", duration: "30 min", category: "protection" },
    { id: "5", task: "Weed control in east field", priority: "high", duration: "3 hours", category: "maintenance" },
    { id: "6", task: "Equipment maintenance", priority: "medium", duration: "1 hour", category: "maintenance" }
  ];

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs_attention':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const progress = (completedTasks.length / weeklyPlan.length) * 100;

  // Dialog content functions
  const renderIrrigationDialog = () => (
    <Dialog open={activeDialog === 'irrigation'} onOpenChange={() => setActiveDialog(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-500" />
            Smart Irrigation Schedule & Details
          </DialogTitle>
          <DialogDescription>
            Complete irrigation management plan with real-time recommendations
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Irrigation Schedule</TabsTrigger>
            <TabsTrigger value="statistics">Water Statistics</TabsTrigger>
            <TabsTrigger value="tips">Best Practices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="grid gap-4">
              {recommendations.irrigation.schedule.map((slot, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{slot.day}</div>
                        <div className="text-muted-foreground">{slot.time}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-muted-foreground">{slot.duration}</div>
                      </div>
                      <div>
                        <div className="font-medium">Zone</div>
                        <div className="text-muted-foreground">{slot.zone}</div>
                      </div>
                      <div>
                        <div className="font-medium">Soil Moisture</div>
                        <div className="text-muted-foreground">{slot.soilMoisture}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      💧 Water saved: {slot.waterSaved}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CloudRain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{recommendations.irrigation.statistics.totalWaterSaved}</div>
                  <div className="text-sm text-muted-foreground">Total Water Saved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Thermometer className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{recommendations.irrigation.statistics.efficiency}</div>
                  <div className="text-sm text-muted-foreground">Irrigation Efficiency</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Wind className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{recommendations.irrigation.statistics.costSavings}</div>
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tips">
            <div className="space-y-3">
              {recommendations.irrigation.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  const renderFertilizationDialog = () => (
    <Dialog open={activeDialog === 'fertilization'} onOpenChange={() => setActiveDialog(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-500" />
            Complete Fertilization Plan
          </DialogTitle>
          <DialogDescription>
            Detailed nutrient management strategy for optimal crop growth
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Nutrient Plan</TabsTrigger>
            <TabsTrigger value="products">Products & Dosage</TabsTrigger>
            <TabsTrigger value="schedule">Application Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutrient Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">N</div>
                    <div className="text-lg">{recommendations.fertilization.plan.nitrogen}</div>
                    <div className="text-sm text-muted-foreground">Nitrogen</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">P</div>
                    <div className="text-lg">{recommendations.fertilization.plan.phosphorus}</div>
                    <div className="text-sm text-muted-foreground">Phosphorus</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">K</div>
                    <div className="text-lg">{recommendations.fertilization.plan.potassium}</div>
                    <div className="text-sm text-muted-foreground">Potassium</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="font-medium">Application Method:</div>
                  <div className="text-sm text-muted-foreground">{recommendations.fertilization.plan.method}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            {recommendations.fertilization.products.map((product, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.purpose}</div>
                    </div>
                    <Badge variant="secondary">{product.quantity}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            {recommendations.fertilization.schedule.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.task}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority} priority
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  const renderProtectionDialog = () => (
    <Dialog open={activeDialog === 'protection'} onOpenChange={() => setActiveDialog(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" />
            Crop Protection Plan
          </DialogTitle>
          <DialogDescription>
            Comprehensive pest and disease management strategy
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="measures" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="measures">Protection Measures</TabsTrigger>
            <TabsTrigger value="products">Recommended Products</TabsTrigger>
            <TabsTrigger value="schedule">Monitoring Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="measures" className="space-y-4">
            {recommendations.protection.measures.map((measure, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{measure.action}</div>
                    <Badge variant="outline">{measure.frequency}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Target: {measure.target}</div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            {recommendations.protection.products.map((product, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{product.name}</div>
                    <Badge variant={product.safety === 'Organic' ? 'default' : 'secondary'}>
                      {product.safety}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Dosage: {product.dosage}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Spraying Interval:</span>
                  <span className="font-medium">{recommendations.protection.schedule.spraying}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual Monitoring:</span>
                  <span className="font-medium">{recommendations.protection.schedule.monitoring}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preventive Actions:</span>
                  <span className="font-medium">{recommendations.protection.schedule.preventive}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Spraying Date:</span>
                  <span className="font-medium text-green-600">{recommendations.protection.schedule.nextSpraying}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  const renderPlantingDialog = () => (
    <Dialog open={activeDialog === 'planting'} onOpenChange={() => setActiveDialog(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            Planting Calendar & Schedule
          </DialogTitle>
          <DialogDescription>
            Complete crop rotation and planting timeline
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="crops" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crops">Crop Selection</TabsTrigger>
            <TabsTrigger value="calendar">Planting Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crops" className="space-y-4">
            {recommendations.planting.crops.map((crop, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-lg">{crop.name}</div>
                      <div className="text-sm text-muted-foreground">{crop.optimalDate}</div>
                    </div>
                    <Badge variant={
                      crop.status === 'urgent' ? 'destructive' :
                      crop.status === 'recommended' ? 'default' : 'secondary'
                    }>
                      {crop.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Expected Yield</div>
                      <div>{crop.yield}</div>
                    </div>
                    <div>
                      <div className="font-medium">Requirements</div>
                      <div>{crop.requirements}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            {recommendations.planting.calendar.map((week, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="font-medium text-lg mb-2">{week.week}</div>
                  <div className="space-y-2">
                    {week.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {task}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <div>
            <h1 className="text-3xl font-bold">Smart Recommendations</h1>
            <p className="text-muted-foreground">Personalized farming advice based on your farm data</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
          <div className="text-sm text-muted-foreground">Weekly Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Tasks Completion</span>
              <span>{completedTasks.length} of {weeklyPlan.length} tasks</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Irrigation Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                {recommendations.irrigation.title}
              </CardTitle>
              <Badge className={getStatusColor(recommendations.irrigation.status)}>
                {getStatusIcon(recommendations.irrigation.status)}
                {recommendations.irrigation.status.replace('_', ' ')}
              </Badge>
            </div>
            <CardDescription>{recommendations.irrigation.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">This Week's Schedule</h4>
              <div className="space-y-2">
                {recommendations.irrigation.schedule.slice(0, 2).map((slot, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                    <span>{slot.day}</span>
                    <span>{slot.time}</span>
                    <span>{slot.duration}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setActiveDialog('irrigation')}
            >
              View Detailed Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Fertilization Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-500" />
                {recommendations.fertilization.title}
              </CardTitle>
              <Badge className={getStatusColor(recommendations.fertilization.status)}>
                {getStatusIcon(recommendations.fertilization.status)}
                {recommendations.fertilization.status.replace('_', ' ')}
              </Badge>
            </div>
            <CardDescription>{recommendations.fertilization.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Quick Overview</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-700 text-sm">N</div>
                  <div className="text-xs">{recommendations.fertilization.plan.nitrogen}</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="font-bold text-purple-700 text-sm">P</div>
                  <div className="text-xs">{recommendations.fertilization.plan.phosphorus}</div>
                </div>
                <div className="p-2 bg-orange-50 rounded">
                  <div className="font-bold text-orange-700 text-sm">K</div>
                  <div className="text-xs">{recommendations.fertilization.plan.potassium}</div>
                </div>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => setActiveDialog('fertilization')}
            >
              Get Fertilization Plan
            </Button>
          </CardContent>
        </Card>

        {/* Crop Protection Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                {recommendations.protection.title}
              </CardTitle>
              <Badge className={getStatusColor(recommendations.protection.status)}>
                {getStatusIcon(recommendations.protection.status)}
                {recommendations.protection.status}
              </Badge>
            </div>
            <CardDescription>{recommendations.protection.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Active Measures</h4>
              <ul className="text-sm space-y-1">
                {recommendations.protection.measures.slice(0, 2).map((measure, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{measure.action}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              className="w-full"
              onClick={() => setActiveDialog('protection')}
            >
              See Protection Plan
            </Button>
          </CardContent>
        </Card>

        {/* Planting Schedule Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                {recommendations.planting.title}
              </CardTitle>
              <Badge className={getStatusColor(recommendations.planting.status)}>
                {getStatusIcon(recommendations.planting.status)}
                {recommendations.planting.status}
              </Badge>
            </div>
            <CardDescription>{recommendations.planting.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Recommended Crops</h4>
              <div className="space-y-2">
                {recommendations.planting.crops.slice(0, 2).map((crop, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div className="font-medium">{crop.name}</div>
                    <Badge variant={
                      crop.status === 'urgent' ? 'destructive' :
                      crop.status === 'recommended' ? 'default' : 'secondary'
                    }>
                      {crop.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => setActiveDialog('planting')}
            >
              View Planting Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Action Plan</CardTitle>
          <CardDescription>Your tasks for this week - {Math.round(progress)}% completed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyPlan.map((task) => (
              <div 
                key={task.id} 
                className={`flex justify-between items-center p-4 rounded-lg border ${
                  completedTasks.includes(task.id) 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {task.task}
                      {completedTasks.includes(task.id) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-4">
                      <span>{task.duration}</span>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <span className="capitalize">{task.category}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant={completedTasks.includes(task.id) ? "outline" : "default"}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {completedTasks.includes(task.id) ? 'Completed' : 'Mark Complete'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {renderIrrigationDialog()}
      {renderFertilizationDialog()}
      {renderProtectionDialog()}
      {renderPlantingDialog()}
    </div>
  );
};

export default Recommendations;