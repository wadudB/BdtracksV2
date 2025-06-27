// Solar Calculation Utilities

import { 
  LocationData, 
  EnergyConsumption, 
  SystemConfiguration, 
  FinancialData, 
  PerformanceData,
  MonthlyData
} from '@/types/pv-calculator';
import { SYSTEM_EFFICIENCY, getAverageElectricityRate, SOLAR_PANELS, INVERTERS } from '@/data/bangladesh-solar-data';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SolarCalculator {
  /**
   * Calculate optimal system size
   */
  static calculateSystemSize(
    consumption: EnergyConsumption,
    location: LocationData,
    offsetPercentage: number = 80
  ): number {
    const dailyConsumption = consumption.monthlyUnits / 30;
    const targetDailyGeneration = (dailyConsumption * offsetPercentage) / 100;
    const peakSunHours = location.peakSunHours;
    const systemEfficiency = SYSTEM_EFFICIENCY.overall;
    
    const requiredSystemSize = targetDailyGeneration / (peakSunHours * systemEfficiency);
    
    return Math.round(requiredSystemSize * 2) / 2; // Round to nearest 0.5 kW
  }

  /**
   * Optimize system configuration
   */
  static optimizeSystemConfiguration(systemSizeKW: number): SystemConfiguration {
    // Select optimal panel (for simplicity, use first available)
    const panel = SOLAR_PANELS[0];
    
    // Calculate panel count
    const panelPowerKW = panel.power / 1000;
    const panelCount = Math.ceil(systemSizeKW / panelPowerKW);
    const actualSystemSize = panelCount * panelPowerKW;

    // Select appropriate inverter
    const inverter = INVERTERS.find(inv => 
      inv.power >= actualSystemSize * 800 && inv.power <= actualSystemSize * 1200
    ) || INVERTERS[0];

    return {
      panelType: panel,
      inverterType: inverter,
      systemSizeKW: actualSystemSize,
      panelCount,
      stringConfiguration: `${Math.ceil(panelCount / 10)} strings`,
      installationType: 'rooftop',
      tiltAngle: 23, // Approximate latitude for Bangladesh
      azimuthAngle: 180 // South-facing
    };
  }

  /**
   * Calculate financial analysis
   */
  static calculateFinancials(
    systemConfig: SystemConfiguration,
    consumption: EnergyConsumption,
    location: LocationData
  ): FinancialData {
    // Equipment costs
    const panelCost = systemConfig.panelCount * systemConfig.panelType.price;
    const inverterCost = systemConfig.inverterType.price;
    const mountingCost = systemConfig.panelCount * 3000; // BDT per panel
    const equipmentCost = panelCost + inverterCost + mountingCost;

    // Installation costs
    const installationCost = systemConfig.systemSizeKW * 15000; // BDT per kW
    const totalInvestment = equipmentCost + installationCost;

    // Calculate savings
    const monthlyGeneration = this.calculateMonthlyGeneration(systemConfig, location);
    const averageElectricityRate = getAverageElectricityRate(
      consumption.monthlyUnits, 
      consumption.consumerCategory === 'industrial' ? 'commercial' : consumption.consumerCategory
    );
    
    const monthlySavings = Math.min(
      monthlyGeneration * averageElectricityRate,
      consumption.monthlyBill
    );

    const yearlySavings = monthlySavings * 12;
    const paybackPeriod = totalInvestment / yearlySavings;
    const roi = ((yearlySavings * 25 - totalInvestment) / totalInvestment) * 100;

    // Simple NPV calculation
    let npv = -totalInvestment;
    for (let year = 1; year <= 25; year++) {
      npv += yearlySavings / Math.pow(1.05, year);
    }

    return {
      equipmentCost,
      installationCost,
      totalInvestment,
      monthlySavings,
      yearlySavings,
      paybackPeriod,
      roi,
      npv,
      irr: 15 // Simplified IRR estimate
    };
  }

  /**
   * Calculate monthly generation
   */
  static calculateMonthlyGeneration(
    systemConfig: SystemConfiguration,
    location: LocationData
  ): number {
    const systemSizeKW = systemConfig.systemSizeKW;
    const peakSunHours = location.peakSunHours;
    const systemEfficiency = SYSTEM_EFFICIENCY.overall;
    
    const monthlyGeneration = systemSizeKW * peakSunHours * 30 * systemEfficiency;
    
    return Math.round(monthlyGeneration);
  }

  /**
   * Calculate performance data
   */
  static calculatePerformanceData(
    systemConfig: SystemConfiguration,
    location: LocationData,
    consumption: EnergyConsumption
  ): PerformanceData {
    const baseGeneration = this.calculateMonthlyGeneration(systemConfig, location);
    
    // Seasonal factors for Bangladesh
    const seasonalFactors = [1.15, 1.20, 1.25, 1.15, 1.05, 0.85, 0.75, 0.80, 0.90, 1.10, 1.20, 1.15];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyData: MonthlyData[] = months.map((month, index) => ({
      month,
      generation: Math.round(baseGeneration * seasonalFactors[index]),
      consumption: consumption.monthlyUnits,
      savings: 0, // Will calculate below
      irradiance: location.solarIrradiance * seasonalFactors[index]
    }));

    const averageElectricityRate = getAverageElectricityRate(
      consumption.monthlyUnits,
      consumption.consumerCategory === 'industrial' ? 'commercial' : consumption.consumerCategory
    );

    // Calculate savings for each month
    monthlyData.forEach(month => {
      month.savings = Math.min(month.generation * averageElectricityRate, consumption.monthlyBill);
    });

    const yearlyGeneration = monthlyData.reduce((sum, month) => sum + month.generation, 0);
    const performanceRatio = 85; // Simplified performance ratio
    const co2Reduction = Math.round(yearlyGeneration * 0.7); // kg CO2 per kWh
    const equivalentTrees = Math.round(co2Reduction / 22);

    return {
      monthlyGeneration: monthlyData,
      yearlyGeneration,
      performanceRatio,
      co2Reduction,
      equivalentTrees
    };
  }
} 