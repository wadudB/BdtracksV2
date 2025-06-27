// Bangladesh Solar Resource and Component Database

import { LocationData, PanelSpecification, InverterSpecification } from '@/types/pv-calculator';

// Bangladesh Districts Solar Resource Data (Major cities)
export const BANGLADESH_DISTRICTS: LocationData[] = [
  {
    coordinates: { lat: 23.8103, lng: 90.4125 },
    address: "Dhaka, Bangladesh",
    district: "Dhaka",
    division: "Dhaka",
    solarIrradiance: 4.8,
    peakSunHours: 5.2,
    seasonalVariation: 0.25
  },
  {
    coordinates: { lat: 22.3569, lng: 91.7832 },
    address: "Chittagong, Bangladesh",
    district: "Chittagong",
    division: "Chittagong",
    solarIrradiance: 5.1,
    peakSunHours: 5.5,
    seasonalVariation: 0.28
  },
  {
    coordinates: { lat: 24.3745, lng: 88.6042 },
    address: "Rajshahi, Bangladesh",
    district: "Rajshahi",
    division: "Rajshahi",
    solarIrradiance: 5.2,
    peakSunHours: 5.6,
    seasonalVariation: 0.30
  },
  {
    coordinates: { lat: 22.8456, lng: 89.5403 },
    address: "Khulna, Bangladesh",
    district: "Khulna",
    division: "Khulna",
    solarIrradiance: 4.9,
    peakSunHours: 5.3,
    seasonalVariation: 0.27
  },
  {
    coordinates: { lat: 24.8949, lng: 91.8687 },
    address: "Sylhet, Bangladesh",
    district: "Sylhet",
    division: "Sylhet",
    solarIrradiance: 4.6,
    peakSunHours: 5.0,
    seasonalVariation: 0.35
  }
];

// Solar Panel Database
export const SOLAR_PANELS: PanelSpecification[] = [
  {
    id: "jinko_330m",
    manufacturer: "Jinko Solar",
    model: "JKM330M-60",
    type: "monocrystalline",
    power: 330,
    efficiency: 20.1,
    voltage: 37.8,
    current: 8.73,
    dimensions: { length: 1650, width: 992, thickness: 35 },
    warranty: 25,
    price: 18000,
    availability: "in-stock"
  },
  {
    id: "canadian_320p",
    manufacturer: "Canadian Solar",
    model: "CS6K-320P",
    type: "polycrystalline",
    power: 320,
    efficiency: 16.5,
    voltage: 37.2,
    current: 8.61,
    dimensions: { length: 1650, width: 992, thickness: 40 },
    warranty: 25,
    price: 16500,
    availability: "in-stock"
  },
  {
    id: "trina_405m",
    manufacturer: "Trina Solar",
    model: "TSM-405DE09",
    type: "monocrystalline",
    power: 405,
    efficiency: 20.8,
    voltage: 41.8,
    current: 9.69,
    dimensions: { length: 1776, width: 1052, thickness: 35 },
    warranty: 25,
    price: 21500,
    availability: "in-stock"
  }
];

// Inverter Database
export const INVERTERS: InverterSpecification[] = [
  {
    id: "growatt_3000",
    manufacturer: "Growatt",
    model: "MIN 3000TL-X",
    type: "string",
    power: 3000,
    efficiency: 97.6,
    mpptChannels: 2,
    maxDcVoltage: 500,
    warranty: 10,
    price: 35000
  },
  {
    id: "growatt_5000",
    manufacturer: "Growatt",
    model: "MIN 5000TL-X",
    type: "string",
    power: 5000,
    efficiency: 97.8,
    mpptChannels: 2,
    maxDcVoltage: 500,
    warranty: 10,
    price: 45000
  },
  {
    id: "sma_5000",
    manufacturer: "SMA",
    model: "Sunny Boy 5.0",
    type: "string",
    power: 5000,
    efficiency: 97.7,
    mpptChannels: 2,
    maxDcVoltage: 600,
    warranty: 12,
    price: 55000
  }
];

// Bangladesh Electricity Rates
export const ELECTRICITY_RATES = {
  residential: [
    { min: 0, max: 75, rate: 5.26 },
    { min: 76, max: 200, rate: 7.20 },
    { min: 201, max: 300, rate: 7.59 },
    { min: 301, max: 400, rate: 8.02 },
    { min: 401, max: 600, rate: 12.67 },
    { min: 601, max: Infinity, rate: 14.61 }
  ],
  commercial: [
    { min: 0, max: 600, rate: 9.94 },
    { min: 601, max: Infinity, rate: 11.46 }
  ]
};

// System efficiency factors
export const SYSTEM_EFFICIENCY = {
  overall: 0.85 // Combined system efficiency
};

// Helper functions
export const findLocationByCoordinates = (lat: number, lng: number): LocationData | null => {
  const tolerance = 0.1;
  return BANGLADESH_DISTRICTS.find(location => 
    Math.abs(location.coordinates.lat - lat) < tolerance &&
    Math.abs(location.coordinates.lng - lng) < tolerance
  ) || null;
};

export const getAverageElectricityRate = (monthlyUnits: number, category: 'residential' | 'commercial' = 'residential'): number => {
  const rates = ELECTRICITY_RATES[category];
  let totalCost = 0;
  let remainingUnits = monthlyUnits;
  
  for (const tier of rates) {
    if (remainingUnits <= 0) break;
    
    const tierMax = tier.max === Infinity ? Number.MAX_SAFE_INTEGER : tier.max;
    const unitsInThisTier = Math.min(remainingUnits, tierMax - tier.min + 1);
    
    totalCost += unitsInThisTier * tier.rate;
    remainingUnits -= unitsInThisTier;
  }
  
  return totalCost / monthlyUnits;
}; 