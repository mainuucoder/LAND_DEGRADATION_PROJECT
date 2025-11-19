import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MonitoringPoint, SoilMetrics } from '@/integrations/supabase/satellite-client';

interface PDFReportData {
  monitoringPoint: MonitoringPoint;
  soilMetrics: SoilMetrics[];
  analysisDate: string;
}

export class PDFExportService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private currentY: number = 25;
  private readonly MARGIN = 15;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  async generateSoilAnalysisReport(data: PDFReportData): Promise<Blob> {
    this.doc = new jsPDF();
    this.currentY = 25;
    
    // Add prominent watermark first (behind all content)
    this.addDiagonalWatermark();
    
    // Add header
    this.addHeader(data.monitoringPoint);
    
    // Add executive summary and health indicators in one section
    this.addSummarySection(data);
    
    // Add detailed metrics (compact version)
    this.addCompactMetrics(data.soilMetrics);
    
    // Add analysis and recommendations (compact version)
    this.addCompactRecommendations(data);
    
    // Add footer
    this.addFooter();

    return this.doc.output('blob');
  }

  private addDiagonalWatermark() {
    // Save current state
    const currentColor = this.doc.getTextColor();
    const currentFont = this.doc.getFont();
    const currentSize = this.doc.getFontSize();
    
    // Large diagonal watermark
    this.doc.setFontSize(60);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(200, 200, 200); // Light gray that shows through
    
    const watermarkText = 'TERRA_GUARD_AI';
    
    // Calculate diagonal position across the entire page
    const diagonalLength = Math.sqrt(this.pageWidth * this.pageWidth + this.pageHeight * this.pageHeight);
    const angle = Math.atan2(this.pageHeight, this.pageWidth) * (180 / Math.PI);
    
    
    
    // Additional watermarks in opposite diagonal
    this.drawDiagonalText(watermarkText, this.pageWidth / 2, this.pageHeight * 3/4, angle);
    
    // Restore state
    this.doc.setTextColor(currentColor[0], currentColor[1], currentColor[2]);
    this.doc.setFont(currentFont.fontName, currentFont.fontStyle);
    this.doc.setFontSize(currentSize);
  }

  private drawDiagonalText(text: string, x: number, y: number, angle: number) {
    // For jsPDF without rotation support, we'll use a simple approach
    // by drawing the text multiple times along the diagonal path
    
    const textWidth = this.doc.getTextWidth(text);
    const steps = 3;
    
    for (let i = -steps; i <= steps; i++) {
      const offsetX = i * (textWidth + 50);
      const offsetY = i * 30;
      
      this.doc.text(text, x + offsetX, y + offsetY, { 
        align: 'center',
        baseline: 'middle'
      });
    }
  }

  private addHeader(monitoringPoint: MonitoringPoint) {
    // Company Header
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(34, 139, 34);
    this.doc.text('TerraGuard AI', this.MARGIN, this.currentY);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text('Satellite Soil Analysis', this.MARGIN, this.currentY + 5);
    
    // Report Title (right aligned)
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 50, 70);
    this.doc.text('SOIL ANALYSIS REPORT', this.pageWidth - this.MARGIN, this.currentY, { align: 'right' });
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(new Date().toLocaleDateString(), this.pageWidth - this.MARGIN, this.currentY + 5, { align: 'right' });
    
    this.currentY += 15;
    
    // Monitoring Point Info (compact)
    this.doc.setFillColor(250, 250, 250);
    this.doc.rect(this.MARGIN, this.currentY, this.pageWidth - (2 * this.MARGIN), 20, 'F');
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 50, 70);
    this.doc.text(`Location: ${monitoringPoint.name}`, this.MARGIN + 5, this.currentY + 7);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(80, 80, 80);
    
    const coordinates = `${monitoringPoint.coordinates[1].toFixed(4)}°N, ${Math.abs(monitoringPoint.coordinates[0]).toFixed(4)}°W`;
    this.doc.text(`Coordinates: ${coordinates}`, this.MARGIN + 5, this.currentY + 13);
    
    if (monitoringPoint.description) {
      const desc = monitoringPoint.description.length > 40 
        ? monitoringPoint.description.substring(0, 40) + '...' 
        : monitoringPoint.description;
      this.doc.text(`Description: ${desc}`, this.MARGIN + 5, this.currentY + 18);
    }
    
    this.currentY += 25;
  }

  private addSummarySection(data: PDFReportData) {
    const latestMetrics = data.soilMetrics[0];
    
    // Health Score Card
    const healthScore = this.calculateHealthScore(latestMetrics);
    const healthColor = this.getHealthColor(healthScore);
    
    this.doc.setFillColor(healthColor[0], healthColor[1], healthColor[2]);
    this.doc.rect(this.pageWidth - 60, this.currentY, 45, 25, 'F');
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(`${healthScore}%`, this.pageWidth - 37, this.currentY + 12, { align: 'center' });
    
    this.doc.setFontSize(8);
    this.doc.text('HEALTH', this.pageWidth - 37, this.currentY + 18, { align: 'center' });
    this.doc.text('SCORE', this.pageWidth - 37, this.currentY + 22, { align: 'center' });
    
    // Key Metrics Table
    const metricsData = [
      ['Moisture', `${latestMetrics.moisture_level}%`, this.getStatus(latestMetrics.moisture_level, 'moisture')],
      ['Vegetation', `${(latestMetrics.vegetation_index * 100).toFixed(1)}%`, this.getStatus(latestMetrics.vegetation_index, 'vegetation')],
      ['Nitrogen', `${latestMetrics.nitrogen_level}%`, this.getStatus(latestMetrics.nitrogen_level, 'nutrient')],
      ['pH Level', latestMetrics.ph_level.toFixed(1), this.getStatus(latestMetrics.ph_level, 'ph')],
      ['Temperature', `${latestMetrics.soil_temperature}°C`, 'Normal'],
      ['Organic Matter', `${latestMetrics.organic_matter}%`, 'Good']
    ];

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Parameter', 'Value', 'Status']],
      body: metricsData,
      theme: 'grid',
      headStyles: { 
        fillColor: [25, 120, 25],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 8, 
        cellPadding: 2,
        textColor: [50, 50, 50]
      },
      styles: { 
        lineWidth: 0.2,
        lineColor: [100, 100, 100]
      },
      margin: { left: this.MARGIN, right: 70 },
      tableWidth: this.pageWidth - 85 - (2 * this.MARGIN)
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addCompactMetrics(soilMetrics: SoilMetrics[]) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 50, 70);
    this.doc.text('Recent Measurements', this.MARGIN, this.currentY);
    
    this.currentY += 7;

    const recentMetrics = soilMetrics.slice(0, 3);
    const tableData = recentMetrics.map(metric => [
      new Date(metric.measurement_date).toLocaleDateString(),
      `${metric.moisture_level}%`,
      (metric.vegetation_index * 100).toFixed(1) + '%',
      `${metric.soil_temperature}°C`
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Date', 'Moisture', 'Veg Index', 'Temp']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [50, 100, 150],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 7, 
        cellPadding: 1.5,
        textColor: [60, 60, 60]
      },
      styles: { 
        lineWidth: 0.2,
        lineColor: [120, 120, 120]
      },
      margin: { left: this.MARGIN, right: this.MARGIN }
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addCompactRecommendations(data: PDFReportData) {
    const latestMetrics = data.soilMetrics[0];
    const recommendations = this.generatePriorityRecommendations(latestMetrics);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(30, 50, 70);
    this.doc.text('Priority Recommendations', this.MARGIN, this.currentY);
    
    this.currentY += 7;

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(40, 40, 40);

    const maxHeight = this.pageHeight - this.currentY - 20;
    const lineHeight = 4.5;
    const maxLines = Math.floor(maxHeight / lineHeight);
    
    recommendations.slice(0, maxLines).forEach((rec, index) => {
      if (this.currentY < this.pageHeight - 15) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('•', this.MARGIN, this.currentY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(rec, this.MARGIN + 5, this.currentY);
        this.currentY += lineHeight;
      }
    });

    if (this.currentY < this.pageHeight - 25) {
      this.currentY += 6;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(30, 50, 70);
      this.doc.text('Quick Analysis:', this.MARGIN, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(50, 50, 50);
      const analysis = this.getQuickAnalysis(latestMetrics);
      const analysisLines = this.doc.splitTextToSize(analysis, this.pageWidth - (2 * this.MARGIN));
      
      analysisLines.forEach(line => {
        if (this.currentY < this.pageHeight - 15) {
          this.doc.text(line, this.MARGIN, this.currentY);
          this.currentY += 4.5;
        }
      });
    }
  }

  private addFooter() {
    const footerY = this.pageHeight - 10;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(100, 100, 100);
    
    this.doc.text('CONFIDENTIAL - TerraGuard AI Analysis', this.MARGIN, footerY);
    this.doc.text('SOIL HEALTH REPORT - SINGLE PAGE SUMMARY', this.pageWidth / 2, footerY, { align: 'center' });
    this.doc.text('terraguard-ai.com', this.pageWidth - this.MARGIN, footerY, { align: 'right' });
  }

  // Helper methods
  private calculateHealthScore(metrics: SoilMetrics): number {
    const scores = [
      this.getParameterScore(metrics.moisture_level, 30, 60, 80),
      this.getParameterScore(metrics.vegetation_index * 100, 30, 60, 80),
      this.getParameterScore(metrics.nitrogen_level, 30, 60, 80),
      this.getParameterScore(metrics.ph_level, 5.5, 6.5, 8, 6, 7.5)
    ];
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  private getParameterScore(value: number, min: number, goodMin: number, goodMax: number, idealMin?: number, idealMax?: number): number {
    if (idealMin && idealMax && value >= idealMin && value <= idealMax) return 100;
    if (value >= goodMin && value <= goodMax) return 80;
    if (value >= min && value < goodMin) return 60;
    if (value > goodMax && value <= goodMax + 10) return 70;
    return 40;
  }

  private getHealthColor(score: number): number[] {
    if (score >= 80) return [39, 174, 96];
    if (score >= 60) return [243, 156, 18];
    return [231, 76, 60];
  }

  private getStatus(value: number, type: string): string {
    switch (type) {
      case 'moisture':
        return value < 30 ? 'Low' : value < 60 ? 'Moderate' : 'Optimal';
      case 'vegetation':
        return value < 0.3 ? 'Poor' : value < 0.6 ? 'Moderate' : 'Healthy';
      case 'nutrient':
        return value < 30 ? 'Low' : value < 60 ? 'Moderate' : 'Optimal';
      case 'ph':
        return value < 5.5 ? 'Acidic' : value > 8 ? 'Alkaline' : 'Neutral';
      default:
        return 'Normal';
    }
  }

  private generatePriorityRecommendations(metrics: SoilMetrics): string[] {
    const recommendations = [];
    
    if (metrics.moisture_level < 25) {
      recommendations.push('URGENT: Implement irrigation - soil moisture critically low');
    } else if (metrics.moisture_level < 35) {
      recommendations.push('Increase watering frequency to maintain soil moisture');
    } else if (metrics.moisture_level > 85) {
      recommendations.push('Reduce irrigation - soil is waterlogged');
    }
    
    if (metrics.nitrogen_level < 20) {
      recommendations.push('Apply nitrogen fertilizer immediately - severe deficiency');
    } else if (metrics.nitrogen_level < 35) {
      recommendations.push('Supplement with nitrogen-rich fertilizer');
    }
    
    if (metrics.ph_level < 5.0) {
      recommendations.push('Apply agricultural lime to correct acidic soil');
    } else if (metrics.ph_level > 8.5) {
      recommendations.push('Add sulfur to lower alkaline pH levels');
    }
    
    if (metrics.vegetation_index < 0.3) {
      recommendations.push('Monitor plant health and check for pests/diseases');
    }
    
    if (metrics.phosphorus_level < 20) {
      recommendations.push('Add phosphorus fertilizer for root development');
    }
    
    if (metrics.potassium_level < 25) {
      recommendations.push('Supplement potassium for plant immunity');
    }
    
    if (metrics.organic_matter < 2) {
      recommendations.push('Add compost to improve soil organic matter');
    }
    
    recommendations.push('Monitor soil conditions weekly');
    recommendations.push('Test soil nutrients seasonally');
    recommendations.push('Adjust practices based on crop requirements');
    
    return recommendations.slice(0, 8);
  }

  private getQuickAnalysis(metrics: SoilMetrics): string {
    const analysis = [];
    
    if (metrics.moisture_level >= 40 && metrics.moisture_level <= 70) {
      analysis.push('Moisture levels are optimal');
    } else if (metrics.moisture_level < 40) {
      analysis.push('Moisture needs attention');
    } else {
      analysis.push('Moisture is excessive');
    }
    
    if (metrics.vegetation_index >= 0.5) {
      analysis.push('vegetation is healthy');
    } else {
      analysis.push('vegetation shows stress');
    }
    
    if (metrics.nitrogen_level >= 40) {
      analysis.push('nutrients are adequate');
    } else {
      analysis.push('nutrient supplementation needed');
    }
    
    if (metrics.ph_level >= 5.5 && metrics.ph_level <= 7.5) {
      analysis.push('pH is well-balanced');
    } else {
      analysis.push('pH adjustment recommended');
    }
    
    return `Overall: ${analysis.join(', ')}. ${this.getOverallOutlook(metrics)}`;
  }

  private getOverallOutlook(metrics: SoilMetrics): string {
    const score = this.calculateHealthScore(metrics);
    
    if (score >= 80) return 'Excellent soil conditions for cultivation.';
    if (score >= 60) return 'Good soil health with minor improvements needed.';
    if (score >= 40) return 'Soil requires attention and management adjustments.';
    return 'Immediate soil amendments recommended for optimal growth.';
  }
}

export const pdfExportService = new PDFExportService();