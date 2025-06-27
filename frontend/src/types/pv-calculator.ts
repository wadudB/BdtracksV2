// Photovoltaic Calculator Type Definitions

export interface LocationData {
  coordinates: { lat: number; lng: number };
  address: string;
  district: string;
  division: string;
  solarIrradiance: number; // kWh/m²/day
  peakSunHours: number;
  seasonalVariation: number;
}

export interface EnergyConsumption {
  monthlyBill: number; // BDT
  monthlyUnits: number; // kWh
  appliances: ApplianceLoad[];
  usagePattern: 'residential' | 'commercial' | 'industrial';
  consumerCategory: 'residential' | 'commercial' | 'industrial';
}

export interface ApplianceLoad {
  id: string;
  name: string;
  category: string;
  power: number; // Watts
  quantity: number;
  dailyHours: number;
  monthlyConsumption: number; // kWh
}

export interface PanelSpecification {
  id: string;
  manufacturer: string;
  model: string;
  type: 'monocrystalline' | 'polycrystalline' | 'thin-film';
  power: number; // Watts
  efficiency: number; // Percentage
  voltage: number; // Volts
  current: number; // Amperes
  dimensions: {
    length: number; // mm
    width: number; // mm
    thickness: number; // mm
  };
  warranty: number; // Years
  price: number; // BDT
  availability: 'in-stock' | 'pre-order' | 'discontinued';
}

export interface InverterSpecification {
  id: string;
  manufacturer: string;
  model: string;
  type: 'string' | 'micro' | 'power-optimizer';
  power: number; // Watts
  efficiency: number; // Percentage
  mpptChannels: number;
  maxDcVoltage: number; // Volts
  warranty: number; // Years
  price: number; // BDT
}

export interface SystemConfiguration {
  panelType: PanelSpecification;
  inverterType: InverterSpecification;
  systemSizeKW: number;
  panelCount: number;
  stringConfiguration: string;
  installationType: 'rooftop' | 'ground' | 'carport';
  tiltAngle: number; // Degrees
  azimuthAngle: number; // Degrees (180° = South)
}

export interface FinancialData {
  equipmentCost: number; // BDT
  installationCost: number; // BDT
  totalInvestment: number; // BDT
  monthlySavings: number; // BDT
  yearlySavings: number; // BDT
  paybackPeriod: number; // Years
  roi: number; // Percentage over 25 years
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return
}

export interface PerformanceData {
  monthlyGeneration: MonthlyData[];
  yearlyGeneration: number; // kWh
  performanceRatio: number; // Percentage
  co2Reduction: number; // kg per year
  equivalentTrees: number; // Trees planted equivalent
}

export interface MonthlyData {
  month: string;
  generation: number; // kWh
  consumption: number; // kWh
  savings: number; // BDT
  irradiance: number; // kWh/m²/day
}

export interface CalculationResults {
  location: LocationData;
  consumption: EnergyConsumption;
  systemConfig: SystemConfiguration;
  financial: FinancialData;
  performance: PerformanceData;
  recommendations: string[];
  warnings: string[];
}

export interface PVCalculatorState {
  currentStep: number;
  location: LocationData | null;
  consumption: EnergyConsumption | null;
  systemConfig: SystemConfiguration | null;
  results: CalculationResults | null;
  isCalculating: boolean;
  errors: string[];
}

export interface PVCalculatorContextType {
  state: PVCalculatorState;
  updateLocation: (location: LocationData) => void;
  updateConsumption: (consumption: EnergyConsumption) => void;
  updateSystemConfig: (config: SystemConfiguration) => void;
  calculateSystem: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetCalculator: () => void;
}

// Weather and environmental data
export interface WeatherData {
  seasonalVariation: number;
  monsoonImpact: number; // June-September reduction
  dustingFactor: number; // Performance reduction due to dust
  temperatureFactor: number; // Temperature derating
}

// Installation and mounting options
export interface InstallationOptions {
  rooftopArea: number; // m²
  rooftopOrientation: number; // Degrees from South
  shadingObjects: ShadingObject[];
  structuralCapacity: number; // kg/m²
  accessibility: 'easy' | 'moderate' | 'difficult';
}

export interface ShadingObject {
  type: 'building' | 'tree' | 'tower' | 'other';
  height: number; // meters
  distance: number; // meters
  azimuth: number; // degrees
}

// Financial options and incentives
export interface FinancingOptions {
  cashPayment: boolean;
  loanAvailable: boolean;
  loanTerms?: {
    duration: number; // years
    interestRate: number; // percentage
    downPayment: number; // percentage
  };
  governmentIncentives: {
    rebateAmount: number; // BDT
    taxCredit: number; // percentage
    netMeteringAvailable: boolean;
  };
}

// Utility and grid connection
export interface GridConnection {
  utilityCompany: string;
  connectionType: 'single-phase' | 'three-phase';
  voltageLevel: number; // Volts
  netMeteringRate: number; // BDT per kWh
  gridStabilityFactor: number; // Load shedding impact
} 