import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, DollarSign, FileText, Zap, Leaf, Sprout, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";

const CarbonCredits = () => {
  const [reportStatus, setReportStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const carbonData = [
    {
      icon: <Coins className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Current Carbon Stock",
      value: "42.5",
      unit: "tons CO₂/ha",
      gradient: "from-green-500 to-emerald-600",
      trend: "+2.3%",
      description: "Based on soil organic carbon analysis"
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Annual Sequestration",
      value: "2.8",
      unit: "tons CO₂/ha/year",
      gradient: "from-blue-500 to-cyan-600",
      trend: "+0.4 t",
      description: "Current sequestration rate"
    },
    {
      icon: <DollarSign className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Estimated Credit Value",
      value: "$156",
      unit: "annual potential",
      gradient: "from-amber-500 to-orange-600",
      trend: "$42/credit",
      description: "Based on current market rates"
    },
  ];

  const practices = [
    {
      id: 1,
      name: "Cover Cropping",
      impact: "+0.8 tCO₂/ha/yr",
      cost: "$120",
      roi: "1.8 years",
      status: "active",
      progress: 75,
      icon: <Sprout className="w-4 h-4 md:w-5 md:h-5" />,
      description: "Winter rye and clover mix"
    },
    {
      id: 2,
      name: "Reduced Tillage",
      impact: "+0.6 tCO₂/ha/yr",
      cost: "$80",
      roi: "1.5 years",
      status: "completed",
      progress: 100,
      icon: <Zap className="w-4 h-4 md:w-5 md:h-5" />,
      description: "No-till implementation"
    },
    {
      id: 3,
      name: "Compost Application",
      impact: "+1.2 tCO₂/ha/yr",
      cost: "$200",
      roi: "2.8 years",
      status: "planned",
      progress: 0,
      icon: <Leaf className="w-4 h-4 md:w-5 md:h-5" />,
      description: "Organic compost 5t/ha"
    },
    {
      id: 4,
      name: "Agroforestry",
      impact: "+2.1 tCO₂/ha/yr",
      cost: "$350",
      roi: "4.2 years",
      status: "recommended",
      progress: 0,
      icon: <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />,
      description: "Alley cropping system"
    },
  ];

  const generatePDFReport = () => {
    if (!generatedReport) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Add TerraGuard AI Header
    pdf.setFillColor(34, 139, 34);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TerraGuard AI', pageWidth / 2, 12, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.text('Carbon Credit Verification Report', pageWidth / 2, 18, { align: 'center' });

    yPosition = 35;

    // Farm Information
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FARM INFORMATION', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Farm Name: ${generatedReport.farmDetails.name}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Location: ${generatedReport.farmDetails.location}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Area: ${generatedReport.farmDetails.area}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Soil Type: ${generatedReport.farmDetails.soilType}`, margin, yPosition);
    yPosition += 10;

    // Carbon Metrics
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARBON SEQUESTRATION METRICS', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    const metrics = [
      `Baseline Carbon: 40.2 tCO₂/ha`,
      `Current Carbon: 42.5 tCO₂/ha (+5.7%)`,
      `Sequestration Rate: 2.8 tCO₂/ha/yr`,
      `Total Sequestration: 15.6 tCO₂`,
      `Verified Credits: 35 credits`
    ];

    metrics.forEach(metric => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(metric, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 5;

    // Financial Summary
    pdf.setFont('helvetica', 'bold');
    pdf.text('FINANCIAL POTENTIAL', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    const financials = [
      `Carbon Credit Price: $${marketData.currentPrice}/credit`,
      `Potential Annual Revenue: ${generatedReport.financials.potentialRevenue}`,
      `Certification Costs: ${generatedReport.financials.certificationCost}`,
      `Net Annual Potential: ${generatedReport.financials.netPotential}`,
      `3-Year Revenue Potential: $3,570`,
      `ROI Timeline: 2.3 years`
    ];

    financials.forEach(item => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(item, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 5;

    // Carbon Farming Practices
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARBON FARMING IMPLEMENTATION PLAN', margin, yPosition);
    yPosition += 8;

    practices.forEach(practice => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(practice.name, margin, yPosition);
      yPosition += 4;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`Impact: ${practice.impact} | Cost: ${practice.cost} | ROI: ${practice.roi}`, margin, yPosition);
      yPosition += 4;
      pdf.text(`Status: ${practice.status.charAt(0).toUpperCase() + practice.status.slice(1)} | Progress: ${practice.progress}%`, margin, yPosition);
      yPosition += 6;
    });

    // Environmental Impact
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('ENVIRONMENTAL BENEFITS', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const benefits = [
      '• 15.6 tons CO₂ sequestered annually',
      '• Equivalent to 3.4 cars off the road',
      '• 12,500 kWh energy offset',
      '• Improved soil health & water retention',
      '• Enhanced biodiversity'
    ];

    benefits.forEach(benefit => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(benefit, margin, yPosition);
      yPosition += 5;
    });

    // Footer
    const finalY = pageHeight - 15;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, finalY - 20, pageWidth - margin, finalY - 20);
    
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by TerraGuard AI - Sustainable Agriculture Intelligence', pageWidth / 2, finalY - 15, { align: 'center' });
    pdf.text(`Report ID: ${generatedReport.id} | ${new Date().toLocaleDateString()}`, pageWidth / 2, finalY - 10, { align: 'center' });
    pdf.text('Contact: soil@terraguard.ai | +254 703 343 652', pageWidth / 2, finalY - 5, { align: 'center' });

    // Save the PDF
    pdf.save(`terra-guard-carbon-report-${generatedReport.id}.pdf`);
  };

  const marketData = {
    currentPrice: 42.50,
    priceChange: +2.3,
    volume: "15.2M",
    certification: "Verra VCS Standard"
  };

  const generateVerificationReport = async () => {
    setReportStatus('generating');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report = {
        id: `TG-CR-${Date.now().toString().slice(-6)}`,
        generatedAt: new Date().toISOString(),
        farmDetails: {
          name: "Green Valley Farm",
          location: "Nairobi, Kenya",
          area: "12.5 hectares",
          soilType: "Volcanic loam"
        },
        carbonMetrics: {
          baselineCarbon: "40.2 tCO₂/ha",
          currentCarbon: "42.5 tCO₂/ha",
          sequestrationRate: "2.8 tCO₂/ha/yr",
          verifiedCredits: "35 credits",
          totalSequestration: "15.6 tCO₂"
        },
        verification: {
          status: "Pending Review",
          verifier: "Soil Carbon Trust",
          nextAudit: "2025-06-15",
          methodology: "VM0042"
        },
        financials: {
          potentialRevenue: "$1,470",
          certificationCost: "$280",
          netPotential: "$1,190",
          carbonPrice: "$42.50/credit",
          threeYearPotential: "$3,570"
        }
      };
      
      setGeneratedReport(report);
      setReportStatus('ready');
      
    } catch (error) {
      setReportStatus('error');
      setTimeout(() => setReportStatus('idle'), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      completed: "success",
      planned: "secondary",
      recommended: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getReportStatusIcon = () => {
    switch (reportStatus) {
      case 'generating':
        return <Clock className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />;
      case 'ready':
        return <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  const getReportStatusText = () => {
    switch (reportStatus) {
      case 'generating':
        return "Generating...";
      case 'ready':
        return "Report Ready";
      case 'error':
        return "Failed";
      default:
        return "Generate Report";
    }
  };

  return (
    <section id="carbon" className="py-8 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-3 md:px-4">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 md:space-y-4">
            <Badge variant="outline" className="px-3 py-1 text-xs md:text-sm">
              💰 Monetization Opportunity
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Carbon Credit Portfolio
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform sustainable practices into verified carbon credits
            </p>
          </div>

          {/* Market Overview - Mobile Optimized */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-center">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground">Price</p>
                  <p className="text-lg md:text-2xl font-bold">${marketData.currentPrice}</p>
                  <p className={`text-xs ${marketData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {marketData.priceChange > 0 ? '↑' : '↓'} {Math.abs(marketData.priceChange)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground">Volume</p>
                  <p className="text-base md:text-xl font-semibold">{marketData.volume}</p>
                </div>
                <div className="col-span-2">
                  <a 
                    href="https://climateimpactx.com/?utm_source=chatgpt.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-xs md:text-sm h-10">
                      <Coins className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                      View Marketplace
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbon Stats - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {carbonData.map((item, index) => (
              <Card
                key={item.title}
                className={`border-0 text-white shadow-lg bg-gradient-to-br ${item.gradient}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        {item.icon}
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                    <h3 className="text-sm md:text-lg font-semibold">{item.title}</h3>
                    <div className="text-2xl md:text-3xl font-bold">{item.value}</div>
                    <p className="text-xs md:text-sm opacity-90">{item.unit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Carbon Farming Implementation Plan - Mobile Optimized */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                Implementation Plan
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Maximize your carbon credit potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="grid gap-3 md:gap-4">
                  {practices.map((practice) => (
                    <Card key={practice.id} className="p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10 mt-1">
                            {practice.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm md:text-base truncate">{practice.name}</h4>
                              {getStatusBadge(practice.status)}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{practice.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center text-xs md:text-sm">
                          <div>
                            <p className="text-muted-foreground">Impact</p>
                            <p className="font-semibold text-green-600">{practice.impact}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cost</p>
                            <p className="font-semibold">{practice.cost}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p className="font-semibold">{practice.roi}</p>
                          </div>
                        </div>
                      </div>
                      
                      {practice.progress > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{practice.progress}%</span>
                          </div>
                          <Progress value={practice.progress} className="h-1.5" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 md:pt-6">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-sm md:text-base"
                    onClick={generateVerificationReport}
                    disabled={reportStatus === 'generating'}
                  >
                    {getReportStatusIcon()}
                    <span className="ml-2">{getReportStatusText()}</span>
                  </Button>
                </div>

                {/* Report Generated Card - Now appears below the Generate Report button */}
                {reportStatus === 'ready' && generatedReport && (
                  <Card className="shadow-lg border-2 border-green-200 bg-green-50 mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-green-800 text-lg md:text-xl">
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                        Report Generated
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        ID: {generatedReport.id} • {new Date(generatedReport.generatedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={generatePDFReport} className="bg-green-600 hover:bg-green-700 text-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" onClick={() => setReportStatus('idle')} className="text-sm">
                          Generate New Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Info - Mobile Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 md:pt-6 border-t">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg md:text-2xl font-bold text-green-600">$1,470</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Annual Potential</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg md:text-2xl font-bold text-blue-600">15.6 t</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Sequestration</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg md:text-2xl font-bold text-amber-600">2.3 yr</p>
                    <p className="text-xs md:text-sm text-muted-foreground">ROI Timeline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CarbonCredits;