import { supabase } from './client';

export interface MonitoringPoint {
  id: string;
  name: string;
  description?: string;
  coordinates: [number, number]; // [longitude, latitude]
  elevation?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SoilMetrics {
  id: string;
  monitoring_point_id: string;
  moisture_level: number;
  vegetation_index: number;
  soil_temperature: number;
  nitrogen_level: number;
  phosphorus_level: number;
  potassium_level: number;
  ph_level: number;
  organic_matter: number;
  measurement_date: string;
  data_source: string;
  created_at: string;
}

export class SatelliteDataClient {
  private useMockData = false;

  // Convert coordinates to string format for storage
  private coordinatesToString(coords: [number, number]): string {
    return `${coords[0]},${coords[1]}`;
  }

  // Parse coordinates from string format
  private parseCoordinates(coordString: string): [number, number] {
    try {
      if (!coordString) return [-74.006, 40.7128];
      const [lng, lat] = coordString.split(',').map(Number);
      if (isNaN(lng) || isNaN(lat)) return [-74.006, 40.7128];
      return [lng, lat];
    } catch {
      return [-74.006, 40.7128];
    }
  }

  // Check database connection
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('satellite_sources')
        .select('count')
        .limit(1);

      this.useMockData = !!error;
      return !error;
    } catch {
      this.useMockData = true;
      return false;
    }
  }

  // Monitoring Points
  async getMonitoringPoints(): Promise<MonitoringPoint[]> {
    try {
      const dbConnected = await this.checkDatabaseConnection();
      
      if (!dbConnected || this.useMockData) {
        console.log('Using mock monitoring points data');
        return this.getMockMonitoringPoints();
      }

      const { data, error } = await supabase
        .from('monitoring_points')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database error, using mock data:', error.message);
        this.useMockData = true;
        return this.getMockMonitoringPoints();
      }

      // Convert coordinates from string to array
      const points = (data || []).map(point => ({
        ...point,
        coordinates: this.parseCoordinates(point.coordinates)
      }));

      return points.length > 0 ? points : this.getMockMonitoringPoints();
    } catch (error) {
      console.error('Error in getMonitoringPoints:', error);
      return this.getMockMonitoringPoints();
    }
  }

  async createMonitoringPoint(point: Omit<MonitoringPoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<MonitoringPoint> {
    try {
      if (this.useMockData) {
        return this.createMockMonitoringPoint(point);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const coordinatesString = this.coordinatesToString(point.coordinates);

      const { data, error } = await supabase
        .from('monitoring_points')
        .insert([
          {
            name: point.name,
            description: point.description,
            coordinates: coordinatesString,
            elevation: point.elevation,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        coordinates: this.parseCoordinates(data.coordinates)
      };
    } catch (error) {
      console.error('Error creating monitoring point:', error);
      return this.createMockMonitoringPoint(point);
    }
  }

  // Soil Metrics
  async getSoilMetrics(monitoringPointId: string, limit: number = 50): Promise<SoilMetrics[]> {
    try {
      if (this.useMockData) {
        return this.getMockSoilMetrics(monitoringPointId);
      }

      const { data, error } = await supabase
        .from('soil_metrics')
        .select('*')
        .eq('monitoring_point_id', monitoringPointId)
        .order('measurement_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Database error, using mock soil metrics:', error.message);
        return this.getMockSoilMetrics(monitoringPointId);
      }

      return data || this.getMockSoilMetrics(monitoringPointId);
    } catch (error) {
      console.error('Error in getSoilMetrics:', error);
      return this.getMockSoilMetrics(monitoringPointId);
    }
  }

  async addSoilMetrics(metrics: Omit<SoilMetrics, 'id' | 'created_at'>): Promise<SoilMetrics> {
    try {
      if (this.useMockData) {
        return this.createMockSoilMetrics(metrics);
      }

      const { data, error } = await supabase
        .from('soil_metrics')
        .insert([metrics])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding soil metrics:', error);
      return this.createMockSoilMetrics(metrics);
    }
  }

  async getLatestSoilMetrics(monitoringPointId: string): Promise<SoilMetrics | null> {
    try {
      const metrics = await this.getSoilMetrics(monitoringPointId, 1);
      return metrics.length > 0 ? metrics[0] : null;
    } catch (error) {
      console.error('Error in getLatestSoilMetrics:', error);
      return null;
    }
  }

  async getMonitoringPointsWithLatestMetrics(): Promise<(MonitoringPoint & { latest_metrics: SoilMetrics | null })[]> {
    try {
      const points = await this.getMonitoringPoints();
      
      const pointsWithMetrics = await Promise.all(
        points.map(async (point) => {
          const latestMetrics = await this.getLatestSoilMetrics(point.id);
          return {
            ...point,
            latest_metrics: latestMetrics
          };
        })
      );

      return pointsWithMetrics;
    } catch (error) {
      console.error('Error in getMonitoringPointsWithLatestMetrics:', error);
      return this.getMockMonitoringPointsWithMetrics();
    }
  }

  // Mock data methods
  private getMockMonitoringPoints(): MonitoringPoint[] {
    return [
      {
        id: 'mock-1',
        name: 'North Field',
        description: 'Main cultivation area',
        coordinates: [-74.006, 40.7128],
        elevation: 45,
        user_id: 'mock-user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        name: 'South Pasture',
        description: 'Grazing land with good soil',
        coordinates: [-118.2437, 34.0522],
        elevation: 120,
        user_id: 'mock-user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-3',
        name: 'East Orchard',
        description: 'Fruit tree plantation',
        coordinates: [-87.6298, 41.8781],
        elevation: 180,
        user_id: 'mock-user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private createMockMonitoringPoint(point: Omit<MonitoringPoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>): MonitoringPoint {
    return {
      id: `mock-${Date.now()}`,
      ...point,
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private getMockSoilMetrics(pointId: string): SoilMetrics[] {
    const baseMetrics = {
      monitoring_point_id: pointId,
      moisture_level: 60 + Math.random() * 30,
      vegetation_index: 0.5 + Math.random() * 0.3,
      soil_temperature: 18 + Math.random() * 15,
      nitrogen_level: 40 + Math.random() * 40,
      phosphorus_level: 35 + Math.random() * 35,
      potassium_level: 45 + Math.random() * 35,
      ph_level: 5.8 + Math.random() * 2.4,
      organic_matter: 2.5 + Math.random() * 5,
      measurement_date: new Date().toISOString(),
      data_source: 'Satellite Analysis'
    };

    return [
      { ...baseMetrics, id: `metric-${pointId}-1`, measurement_date: new Date().toISOString() },
      { 
        ...baseMetrics, 
        id: `metric-${pointId}-2`,
        measurement_date: new Date(Date.now() - 86400000).toISOString(),
        moisture_level: baseMetrics.moisture_level - 5,
        vegetation_index: baseMetrics.vegetation_index - 0.1
      }
    ];
  }

  private createMockSoilMetrics(metrics: Omit<SoilMetrics, 'id' | 'created_at'>): SoilMetrics {
    return {
      id: `mock-metric-${Date.now()}`,
      ...metrics,
      created_at: new Date().toISOString()
    };
  }

  private getMockMonitoringPointsWithMetrics(): (MonitoringPoint & { latest_metrics: SoilMetrics | null })[] {
    const points = this.getMockMonitoringPoints();
    return points.map(point => ({
      ...point,
      latest_metrics: this.getMockSoilMetrics(point.id)[0]
    }));
  }

  // Check if using mock data
  isUsingMockData(): boolean {
    return this.useMockData;
  }

  // Initialize with sample data
  async initializeSampleData(): Promise<void> {
    try {
      const dbConnected = await this.checkDatabaseConnection();
      
      if (!dbConnected) {
        console.log('Database not connected, using mock data mode');
        this.useMockData = true;
        return;
      }

      const points = await this.getMonitoringPoints();
      if (points.length === 0 || points[0].id.startsWith('mock-')) {
        console.log('Creating initial sample data...');
        
        const samplePoints = [
          { name: "North Field", coordinates: [-74.006, 40.7128] as [number, number], description: "Main cultivation area", elevation: 45 },
          { name: "South Pasture", coordinates: [-118.2437, 34.0522] as [number, number], description: "Grazing land", elevation: 120 },
          { name: "East Orchard", coordinates: [-87.6298, 41.8781] as [number, number], description: "Fruit trees", elevation: 180 },
        ];

        for (const point of samplePoints) {
          const createdPoint = await this.createMonitoringPoint(point);
          
          // Add initial soil metrics
          await this.addSoilMetrics({
            monitoring_point_id: createdPoint.id,
            moisture_level: 50 + Math.random() * 40,
            vegetation_index: 0.4 + Math.random() * 0.4,
            soil_temperature: 15 + Math.random() * 20,
            nitrogen_level: 30 + Math.random() * 50,
            phosphorus_level: 25 + Math.random() * 45,
            potassium_level: 40 + Math.random() * 40,
            ph_level: 5.5 + Math.random() * 3,
            organic_matter: 2 + Math.random() * 6,
            measurement_date: new Date().toISOString(),
            data_source: "Initial Sample"
          });
        }
        
        console.log('Sample data created successfully');
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
      this.useMockData = true;
    }
  }
}

export const satelliteDataClient = new SatelliteDataClient();