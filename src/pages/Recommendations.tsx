import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sprout, Droplets, Sun, Shield, Calendar, CheckCircle, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Sample recommendation data
  const recommendations = {
    irrigation: {
      title: "Smart Irrigation",
      description: "Optimize water usage based on real-time soil moisture data",
      status: "optimal",
      schedule: [
        { day: "Monday", time: "06:00 AM", duration: "45 min", zone: "North Field" },
        { day: "Wednesday", time: "06:00 AM", duration: "30 min", zone: "South Field" },
        { day: "Friday", time: "06:00 AM", duration: "45 min", zone: "North Field" }
      ],
      tips: [
        "Water early morning to reduce evaporation",
        "Check soil moisture before irrigation",
        "Adjust based on rainfall forecast"
      ]
    },
    fertilization: {
      title: "Precision Fertilization",
      description: "Balanced nutrient application based on soil analysis",
      status: "needs_attention",
      plan: {
        nitrogen: "50 kg/ha",
        phosphorus: "30 kg/ha",
        potassium: "40 kg/ha",
        timing: "Apply within next 7 days"
      },
      products: [
        "NPK 15-15-15 (Base application)",
        "Urea (Top dressing)",
        "Organic compost (Soil amendment)"
      ]
    },
    protection: {
      title: "Crop Protection",
      description: "Integrated pest and disease management",
      status: "good",
      measures: [
        "Apply neem oil spray for aphid control",
        "Monitor for fungal infections after rain",
        "Install pheromone traps for moths"
      ],
      schedule: {
        spraying: "Every 14 days",
        monitoring: "Daily visual checks",
        preventive: "Apply before heavy rain"
      }
    },
    planting: {
      title: "Planting Schedule",
      description: "Optimal timing for next crop rotation",
      status: "upcoming",
      crops: [
        { name: "Wheat", optimalDate: "Oct 15 - Nov 15", status: "recommended" },
        { name: "Legumes", optimalDate: "Nov 1 - Nov 30", status: "alternative" },
        { name: "Cover Crop", optimalDate: "Immediate", status: "urgent" }
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
              <h4 className="font-medium mb-2">Irrigation Schedule</h4>
              <div className="space-y-2">
                {recommendations.irrigation.schedule.map((slot, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                    <span>{slot.day}</span>
                    <span>{slot.time}</span>
                    <span>{slot.duration}</span>
                    <span className="text-muted-foreground">{slot.zone}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Water Saving Tips</h4>
              <ul className="text-sm space-y-1">
                {recommendations.irrigation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full">View Detailed Schedule</Button>
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
              <h4 className="font-medium mb-2">Application Plan</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-700">N</div>
                  <div className="text-sm">{recommendations.fertilization.plan.nitrogen}</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-bold text-purple-700">P</div>
                  <div className="text-sm">{recommendations.fertilization.plan.phosphorus}</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-bold text-orange-700">K</div>
                  <div className="text-sm">{recommendations.fertilization.plan.potassium}</div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {recommendations.fertilization.plan.timing}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommended Products</h4>
              <ul className="text-sm space-y-1">
                {recommendations.fertilization.products.map((product, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{product}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full">Get Fertilization Plan</Button>
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
              <h4 className="font-medium mb-2">Preventive Measures</h4>
              <ul className="text-sm space-y-2">
                {recommendations.protection.measures.map((measure, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monitoring Schedule</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Spraying:</span>
                  <span className="font-medium">{recommendations.protection.schedule.spraying}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual Checks:</span>
                  <span className="font-medium">{recommendations.protection.schedule.monitoring}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preventive Action:</span>
                  <span className="font-medium">{recommendations.protection.schedule.preventive}</span>
                </div>
              </div>
            </div>
            <Button className="w-full">See Protection Plan</Button>
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
                {recommendations.planting.crops.map((crop, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium">{crop.name}</div>
                      <div className="text-sm text-muted-foreground">{crop.optimalDate}</div>
                    </div>
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
            <Button className="w-full">View Planting Calendar</Button>
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
    </div>
  );
};

export default Recommendations;