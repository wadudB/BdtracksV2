/**
 * @deprecated This file is being replaced with API calls to the backend.
 * Use the API service in src/services/api.ts instead.
 * This file is kept temporarily for reference until the API integration is completed.
 */
// Commodity data based on TCB (Trading Corporation of Bangladesh) price reports
// English translations of commodity names from the CSV
// Updated with data from 2025-04-09-08-31.csv

export interface Commodity {
  id: string;
  name: string;
  bengaliName: string;
  category: "agriculture" | "industrial" | "consumer" | "energy";
  unit: string;
  currentPrice: number;
  previousPrice: number;
  minPrice?: number;
  maxPrice?: number;
  weeklyChange: number;
  monthlyChange: number;
  yearlyChange: number;
  description?: string;
  image?: string;
  priceHistory: PricePoint[];
  regionalPrices: RegionalPrice[];
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface RegionalPrice {
  region: string;
  price: number;
  change: number;
}

// Update the generatePriceHistory function to use min and max prices
const generatePriceHistory = (
  currentPrice: number,
  volatility: number,
  minPrice?: number,
  maxPrice?: number
): PricePoint[] => {
  const result: PricePoint[] = [];
  let price = currentPrice;

  // Go back 30 days
  for (let i = 30; i >= 0; i--) {
    // Create a date for this point (30 days ago up to today)
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    // Slightly randomize price within volatility percent, but respect min/max bounds
    // Higher volatility = more price movement
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    price = price * (1 + randomFactor);

    // If min and max are provided, keep price within those bounds
    if (minPrice !== undefined && price < minPrice) {
      price = minPrice;
    }
    if (maxPrice !== undefined && price > maxPrice) {
      price = maxPrice;
    }

    result.push({
      date: dateString,
      price: Math.round(price), // Round to integer
    });
  }

  return result;
};

// Generate more diverse regional prices based on base price
const generateRegionalPrices = (
  basePrice: number,
  minPrice?: number,
  maxPrice?: number
): RegionalPrice[] => {
  // Define regions of Bangladesh
  const regions = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  // Generate regional prices with more diversity
  return regions.map((region) => {
    // Create different variance factors per region
    let varianceFactor;

    switch (region) {
      case "Dhaka":
        // Dhaka tends to be more expensive
        varianceFactor = 1 + Math.random() * 0.1;
        break;
      case "Chittagong":
        // Chittagong is second largest city, also more expensive
        varianceFactor = 1 + Math.random() * 0.08;
        break;
      case "Sylhet":
        // Sylhet can be more expensive due to tourism
        varianceFactor = 1 + Math.random() * 0.07;
        break;
      case "Rangpur":
        // Northern regions often have lower prices
        varianceFactor = 1 - Math.random() * 0.08;
        break;
      case "Rajshahi":
        // Agricultural region might have lower prices on food
        varianceFactor = 1 - Math.random() * 0.06;
        break;
      default:
        // Other regions with medium variance
        varianceFactor = 1 + (Math.random() * 0.06 - 0.03);
    }

    // Calculate regional price and round to integer
    let price = Math.round(basePrice * varianceFactor);

    // Respect min and max limits if provided
    if (minPrice !== undefined && price < minPrice) {
      price = minPrice;
    }
    if (maxPrice !== undefined && price > maxPrice) {
      price = maxPrice;
    }

    return {
      region: region,
      price: price,
      change: Math.round(
        varianceFactor > 1 ? (varianceFactor - 1) * 100 : (varianceFactor - 1) * 100
      ),
    };
  });
};

// Helper function to calculate average price from regional prices
const calculateAveragePrice = (regionalPrices: RegionalPrice[]): number => {
  const sum = regionalPrices.reduce((total, region) => total + region.price, 0);
  return Math.round(sum / regionalPrices.length); // Round to integer
};

// Generate supply chain data
const generateSupplyChainData = (basePrice: number): SupplyChainData => {
  const stages = [
    {
      id: "production",
      name: "Production",
      location: "Rural Districts",
      stakeholders: Math.floor(Math.random() * 20) + 5,
      averagePrice: Math.round(basePrice * 0.6),
    },
    {
      id: "processing",
      name: "Processing",
      location: "Industrial Zones",
      stakeholders: Math.floor(Math.random() * 10) + 3,
      averagePrice: Math.round(basePrice * 0.75),
    },
    {
      id: "distribution",
      name: "Distribution",
      location: "Transportation Hubs",
      stakeholders: Math.floor(Math.random() * 30) + 10,
      averagePrice: Math.round(basePrice * 0.85),
    },
    {
      id: "retail",
      name: "Retail",
      location: "Urban Markets",
      stakeholders: Math.floor(Math.random() * 150) + 50,
      averagePrice: basePrice,
    },
  ];

  const risks = [
    {
      id: "1",
      name: "Weather Disruptions",
      severity: "High" as const,
      impact: "Production delays and crop damage",
      probability: `${Math.floor(Math.random() * 30) + 30}%`,
    },
    {
      id: "2",
      name: "Transportation Issues",
      severity: "Medium" as const,
      impact: "Delivery delays and increased costs",
      probability: `${Math.floor(Math.random() * 20) + 20}%`,
    },
    {
      id: "3",
      name: "Market Volatility",
      severity: "Medium" as const,
      impact: "Price fluctuations",
      probability: `${Math.floor(Math.random() * 40) + 30}%`,
    },
    {
      id: "4",
      name: "Storage Limitations",
      severity: "Low" as const,
      impact: "Product spoilage and quality degradation",
      probability: `${Math.floor(Math.random() * 20) + 10}%`,
    },
  ];

  return { stages, risks };
};

// Commodities data based on the CSV (updated 2025-04-09)
export const commodities: Commodity[] = [
  {
    id: "1",
    name: "Rice (Fine)",
    bengaliName: "চাল মিনিকেট/নাজিরশাইল",
    category: "agriculture",
    unit: "kg",
    minPrice: 75,
    maxPrice: 80,
    get regionalPrices() {
      return generateRegionalPrices(77, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 0.97);
    }, // Approximate previous price
    weeklyChange: 2.6,
    monthlyChange: 4.0,
    yearlyChange: 15.4,
    description: "Premium quality rice varieties including Miniket and Najirshail",
    image: "/images/commodities/rice-fine.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.04, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "2",
    name: "Rice (Medium)",
    bengaliName: "চাল পাইজাম/লটা",
    category: "agriculture",
    unit: "kg",
    minPrice: 60,
    maxPrice: 68,
    get regionalPrices() {
      return generateRegionalPrices(64, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 0.96);
    },
    weeklyChange: 3.2,
    monthlyChange: 4.9,
    yearlyChange: 12.8,
    description: "Medium quality rice varieties including Paijam",
    image: "/images/commodities/rice-medium.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.03, this.minPrice, this.maxPrice);
    },
  },
  {
    id: "3",
    name: "Rice (Coarse)",
    bengaliName: "চাল মোটা",
    category: "agriculture",
    unit: "kg",
    minPrice: 55,
    maxPrice: 62,
    get regionalPrices() {
      return generateRegionalPrices(58, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 0.96);
    },
    weeklyChange: 3.6,
    monthlyChange: 5.5,
    yearlyChange: 10.0,
    description: "Coarse rice varieties commonly used in everyday meals",
    image: "/images/commodities/rice-coarse.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.025, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "4",
    name: "Wheat Flour (Fine)",
    bengaliName: "আটা ময়দা",
    category: "agriculture",
    unit: "kg",
    minPrice: 48,
    maxPrice: 54,
    get regionalPrices() {
      return generateRegionalPrices(51, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 1.04);
    }, // Price was higher before
    weeklyChange: -3.8,
    monthlyChange: -5.0,
    yearlyChange: 7.5,
    description: "Fine wheat flour used for making breads and pastries",
    image: "/images/commodities/wheat-flour.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.05, this.minPrice, this.maxPrice);
    },
  },
  {
    id: "5",
    name: "Wheat Flour (Medium)",
    bengaliName: "আটা সুজি",
    category: "agriculture",
    unit: "kg",
    minPrice: 53,
    maxPrice: 60,
    get regionalPrices() {
      return generateRegionalPrices(56, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 1.05);
    },
    weeklyChange: -5.2,
    monthlyChange: -6.2,
    yearlyChange: 8.2,
    description: "Medium wheat flour used for various food preparations",
    image: "/images/commodities/wheat-medium.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.04, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "6",
    name: "Lentils (Masoor)",
    bengaliName: "মসুর ডাল",
    category: "agriculture",
    unit: "kg",
    currentPrice: 110,
    previousPrice: 116,
    weeklyChange: -5.2,
    monthlyChange: -4.5,
    yearlyChange: 5.5,
    description: "Red lentils commonly used in Bengali cuisine",
    image: "/images/commodities/lentils-masoor.jpg",
    priceHistory: generatePriceHistory(110, 0.06),
    regionalPrices: generateRegionalPrices(110),
    supplyChainData: generateSupplyChainData(110),
  },
  {
    id: "7",
    name: "Lentils (Mung)",
    bengaliName: "মুগ ডাল",
    category: "agriculture",
    unit: "kg",
    currentPrice: 145,
    previousPrice: 140,
    weeklyChange: 3.6,
    monthlyChange: 5.0,
    yearlyChange: 8.9,
    description: "Green lentils used in various Bengali dishes",
    image: "/images/commodities/lentils-mung.jpg",
    priceHistory: generatePriceHistory(145, 0.04),
    regionalPrices: generateRegionalPrices(145),
    supplyChainData: generateSupplyChainData(145),
  },
  {
    id: "8",
    name: "Lentils (Black)",
    bengaliName: "ছোলা ডাল",
    category: "agriculture",
    unit: "kg",
    currentPrice: 125,
    previousPrice: 125,
    weeklyChange: 0,
    monthlyChange: 2.5,
    yearlyChange: 4.2,
    description: "Black chickpeas used in traditional dishes",
    image: "/images/commodities/lentils-black.jpg",
    priceHistory: generatePriceHistory(125, 0.03),
    regionalPrices: generateRegionalPrices(125),
    supplyChainData: generateSupplyChainData(125),
  },
  {
    id: "9",
    name: "Soybean Oil",
    bengaliName: "সয়াবিন তেল",
    category: "consumer",
    unit: "liter",
    currentPrice: 175,
    previousPrice: 185,
    weeklyChange: -5.4,
    monthlyChange: -6.8,
    yearlyChange: 12.1,
    description: "Refined soybean oil used for cooking",
    image: "/images/commodities/soybean-oil.jpg",
    priceHistory: generatePriceHistory(175, 0.07),
    regionalPrices: generateRegionalPrices(175),
    supplyChainData: generateSupplyChainData(175),
  },
  {
    id: "10",
    name: "Palm Oil",
    bengaliName: "পাম অয়েল",
    category: "consumer",
    unit: "liter",
    currentPrice: 152,
    previousPrice: 160,
    weeklyChange: -5.0,
    monthlyChange: -5.6,
    yearlyChange: 8.5,
    description: "Palm oil imported for cooking and food processing",
    image: "/images/commodities/palm-oil.jpg",
    priceHistory: generatePriceHistory(152, 0.08),
    regionalPrices: generateRegionalPrices(152),
    supplyChainData: generateSupplyChainData(152),
  },
  {
    id: "11",
    name: "Sugar",
    bengaliName: "চিনি",
    category: "consumer",
    unit: "kg",
    currentPrice: 140,
    previousPrice: 130,
    weeklyChange: 7.7,
    monthlyChange: 12.5,
    yearlyChange: 23.8,
    description: "Refined white sugar used as sweetener",
    image: "/images/commodities/sugar.jpg",
    priceHistory: generatePriceHistory(140, 0.09),
    regionalPrices: generateRegionalPrices(140),
    supplyChainData: generateSupplyChainData(140),
  },
  {
    id: "12",
    name: "Onion (Local)",
    bengaliName: "পেঁয়াজ দেশি",
    category: "agriculture",
    unit: "kg",
    minPrice: 75,
    maxPrice: 95,
    get regionalPrices() {
      return generateRegionalPrices(85, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 0.92);
    },
    weeklyChange: 9.0,
    monthlyChange: 15.2,
    yearlyChange: -12.5,
    description: "Locally grown onions from Bangladesh",
    image: "/images/commodities/onion-local.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.15, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "13",
    name: "Onion (Imported)",
    bengaliName: "পেঁয়াজ আমদানি",
    category: "agriculture",
    unit: "kg",
    minPrice: 65,
    maxPrice: 85,
    get regionalPrices() {
      return generateRegionalPrices(73, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 1.07);
    },
    weeklyChange: -6.7,
    monthlyChange: -8.5,
    yearlyChange: -15.5,
    description: "Imported onions primarily from India",
    image: "/images/commodities/onion-imported.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.18, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "14",
    name: "Potato",
    bengaliName: "আলু",
    category: "agriculture",
    unit: "kg",
    minPrice: 28,
    maxPrice: 38,
    get regionalPrices() {
      return generateRegionalPrices(33, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 1.09);
    },
    weeklyChange: -8.6,
    monthlyChange: -9.1,
    yearlyChange: 5.2,
    description: "Fresh potatoes from northern regions of Bangladesh",
    image: "/images/commodities/potato.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.12, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "15",
    name: "Garlic (Local)",
    bengaliName: "রসুন দেশি",
    category: "agriculture",
    unit: "kg",
    currentPrice: 130,
    previousPrice: 120,
    weeklyChange: 8.3,
    monthlyChange: 12.5,
    yearlyChange: 18.2,
    description: "Locally produced garlic from Bangladesh",
    image: "/images/commodities/garlic-local.jpg",
    priceHistory: generatePriceHistory(130, 0.08),
    regionalPrices: generateRegionalPrices(130),
    supplyChainData: generateSupplyChainData(130),
  },
  {
    id: "16",
    name: "Garlic (Imported)",
    bengaliName: "রসুন আমদানি",
    category: "agriculture",
    unit: "kg",
    currentPrice: 160,
    previousPrice: 155,
    weeklyChange: 3.2,
    monthlyChange: 7.2,
    yearlyChange: 11.5,
    description: "Imported garlic primarily from China",
    image: "/images/commodities/garlic-imported.jpg",
    priceHistory: generatePriceHistory(160, 0.06),
    regionalPrices: generateRegionalPrices(160),
    supplyChainData: generateSupplyChainData(160),
  },
  {
    id: "17",
    name: "Green Chili",
    bengaliName: "কাঁচা মরিচ",
    category: "agriculture",
    unit: "kg",
    minPrice: 120,
    maxPrice: 180,
    get regionalPrices() {
      return generateRegionalPrices(150, this.minPrice, this.maxPrice);
    },
    get currentPrice() {
      return calculateAveragePrice(this.regionalPrices);
    },
    get previousPrice() {
      return Math.round(this.currentPrice * 0.84);
    },
    weeklyChange: 19.2,
    monthlyChange: 27.3,
    yearlyChange: -5.4,
    description: "Fresh green chilies grown locally",
    image: "/images/commodities/green-chili.jpg",
    get priceHistory() {
      return generatePriceHistory(this.currentPrice, 0.25, this.minPrice, this.maxPrice);
    },
    get supplyChainData() {
      return generateSupplyChainData(this.currentPrice);
    },
  },
  {
    id: "18",
    name: "Ginger (Local)",
    bengaliName: "আদা দেশি",
    category: "agriculture",
    unit: "kg",
    currentPrice: 170,
    previousPrice: 160,
    weeklyChange: 6.3,
    monthlyChange: 8.1,
    yearlyChange: 14.3,
    description: "Locally grown ginger from hilly regions",
    image: "/images/commodities/ginger-local.jpg",
    priceHistory: generatePriceHistory(170, 0.07),
    regionalPrices: generateRegionalPrices(170),
    supplyChainData: generateSupplyChainData(170),
  },
  {
    id: "19",
    name: "Chicken (Broiler)",
    bengaliName: "মুরগি ব্রয়লার",
    category: "agriculture",
    unit: "kg",
    currentPrice: 175,
    previousPrice: 170,
    weeklyChange: 2.9,
    monthlyChange: 6.3,
    yearlyChange: 13.3,
    description: "Farm-raised broiler chicken",
    image: "/images/commodities/chicken-broiler.jpg",
    priceHistory: generatePriceHistory(175, 0.06),
    regionalPrices: generateRegionalPrices(175),
    supplyChainData: generateSupplyChainData(175),
  },
  {
    id: "20",
    name: "Chicken (Native)",
    bengaliName: "মুরগি দেশি",
    category: "agriculture",
    unit: "kg",
    currentPrice: 580,
    previousPrice: 560,
    weeklyChange: 3.6,
    monthlyChange: 7.8,
    yearlyChange: 15.8,
    description: "Free-range native chicken",
    image: "/images/commodities/chicken-native.jpg",
    priceHistory: generatePriceHistory(580, 0.04),
    regionalPrices: generateRegionalPrices(580),
    supplyChainData: generateSupplyChainData(580),
  },
  {
    id: "21",
    name: "Beef",
    bengaliName: "গরুর মাংস",
    category: "agriculture",
    unit: "kg",
    currentPrice: 720,
    previousPrice: 700,
    weeklyChange: 2.9,
    monthlyChange: 5.3,
    yearlyChange: 12.9,
    description: "Fresh beef from local sources",
    image: "/images/commodities/beef.jpg",
    priceHistory: generatePriceHistory(720, 0.03),
    regionalPrices: generateRegionalPrices(720),
    supplyChainData: generateSupplyChainData(720),
  },
  {
    id: "22",
    name: "Mutton",
    bengaliName: "খাসির মাংস",
    category: "agriculture",
    unit: "kg",
    currentPrice: 980,
    previousPrice: 950,
    weeklyChange: 3.2,
    monthlyChange: 6.7,
    yearlyChange: 13.8,
    description: "Fresh mutton from local sources",
    image: "/images/commodities/mutton.jpg",
    priceHistory: generatePriceHistory(980, 0.035),
    regionalPrices: generateRegionalPrices(980),
    supplyChainData: generateSupplyChainData(980),
  },
  {
    id: "23",
    name: "Eggs",
    bengaliName: "ডিম",
    category: "agriculture",
    unit: "dozen",
    currentPrice: 135,
    previousPrice: 130,
    weeklyChange: 3.8,
    monthlyChange: 8.3,
    yearlyChange: 16.1,
    description: "Farm eggs, medium size",
    image: "/images/commodities/eggs.jpg",
    priceHistory: generatePriceHistory(135, 0.05),
    regionalPrices: generateRegionalPrices(135),
    supplyChainData: generateSupplyChainData(135),
  },
  {
    id: "24",
    name: "Milk (Pasteurized)",
    bengaliName: "দুধ পাস্তুরাইজড",
    category: "consumer",
    unit: "liter",
    currentPrice: 88,
    previousPrice: 85,
    weeklyChange: 3.5,
    monthlyChange: 6.3,
    yearlyChange: 13.3,
    description: "Pasteurized cow milk from dairy farms",
    image: "/images/commodities/milk.jpg",
    priceHistory: generatePriceHistory(88, 0.04),
    regionalPrices: generateRegionalPrices(88),
    supplyChainData: generateSupplyChainData(88),
  },
  {
    id: "25",
    name: "LPG Cylinder",
    bengaliName: "এলপিজি সিলিন্ডার",
    category: "energy",
    unit: "12kg cylinder",
    currentPrice: 1200,
    previousPrice: 1250,
    weeklyChange: -4.0,
    monthlyChange: -5.5,
    yearlyChange: 8.7,
    description: "Liquefied Petroleum Gas for household cooking",
    image: "/images/commodities/lpg.jpg",
    priceHistory: generatePriceHistory(1200, 0.06),
    regionalPrices: generateRegionalPrices(1200),
    supplyChainData: generateSupplyChainData(1200),
  },
  {
    id: "26",
    name: "Cement",
    bengaliName: "সিমেন্ট",
    category: "industrial",
    unit: "50kg bag",
    currentPrice: 530,
    previousPrice: 520,
    weeklyChange: 1.9,
    monthlyChange: 3.6,
    yearlyChange: 8.3,
    description: "Portland cement for construction",
    image: "/images/commodities/cement.jpg",
    priceHistory: generatePriceHistory(530, 0.03),
    regionalPrices: generateRegionalPrices(530),
    supplyChainData: generateSupplyChainData(530),
  },
  {
    id: "27",
    name: "Steel Rod",
    bengaliName: "রড",
    category: "industrial",
    unit: "ton",
    currentPrice: 79500,
    previousPrice: 78000,
    weeklyChange: 1.9,
    monthlyChange: 5.2,
    yearlyChange: 12.1,
    description: "Steel reinforcement rods for construction (60 grade)",
    image: "/images/commodities/steel.jpg",
    priceHistory: generatePriceHistory(79500, 0.04),
    regionalPrices: generateRegionalPrices(79500),
    supplyChainData: generateSupplyChainData(79500),
  },
  {
    id: "28",
    name: "Diesel",
    bengaliName: "ডিজেল",
    category: "energy",
    unit: "liter",
    currentPrice: 89,
    previousPrice: 89,
    weeklyChange: 0,
    monthlyChange: 0,
    yearlyChange: 5.9,
    description: "Diesel fuel for vehicles and machinery",
    image: "/images/commodities/diesel.jpg",
    priceHistory: generatePriceHistory(89, 0.02),
    regionalPrices: generateRegionalPrices(89),
    supplyChainData: generateSupplyChainData(89),
  },
  {
    id: "29",
    name: "Octane",
    bengaliName: "অকটেন",
    category: "energy",
    unit: "liter",
    currentPrice: 98,
    previousPrice: 98,
    weeklyChange: 0,
    monthlyChange: 0,
    yearlyChange: 4.3,
    description: "Octane fuel for vehicles",
    image: "/images/commodities/octane.jpg",
    priceHistory: generatePriceHistory(98, 0.02),
    regionalPrices: generateRegionalPrices(98),
    supplyChainData: generateSupplyChainData(98),
  },
  {
    id: "30",
    name: "Tea",
    bengaliName: "চা পাতা",
    category: "agriculture",
    unit: "kg",
    currentPrice: 460,
    previousPrice: 450,
    weeklyChange: 2.2,
    monthlyChange: 7.1,
    yearlyChange: 15.4,
    description: "Loose tea leaves from Sylhet region",
    image: "/images/commodities/tea.jpg",
    priceHistory: generatePriceHistory(460, 0.05),
    regionalPrices: generateRegionalPrices(460),
    supplyChainData: generateSupplyChainData(460),
  },
  {
    id: "31",
    name: "Fish (Rui)",
    bengaliName: "রুই মাছ",
    category: "agriculture",
    unit: "kg",
    currentPrice: 320,
    previousPrice: 310,
    weeklyChange: 3.2,
    monthlyChange: 6.7,
    yearlyChange: 10.3,
    description: "Fresh Rui fish from local farms and rivers",
    image: "/images/commodities/fish-rui.jpg",
    priceHistory: generatePriceHistory(320, 0.08),
    regionalPrices: generateRegionalPrices(320),
    supplyChainData: generateSupplyChainData(320),
  },
  {
    id: "32",
    name: "Fish (Ilish)",
    bengaliName: "ইলিশ মাছ",
    category: "agriculture",
    unit: "kg",
    currentPrice: 1200,
    previousPrice: 1150,
    weeklyChange: 4.3,
    monthlyChange: 8.1,
    yearlyChange: 15.4,
    description: "National fish of Bangladesh, primarily from rivers and sea",
    image: "/images/commodities/fish-ilish.jpg",
    priceHistory: generatePriceHistory(1200, 0.1),
    regionalPrices: generateRegionalPrices(1200),
    supplyChainData: generateSupplyChainData(1200),
  },
  {
    id: "33",
    name: "Fish (Tilapia)",
    bengaliName: "তেলাপিয়া মাছ",
    category: "agriculture",
    unit: "kg",
    currentPrice: 180,
    previousPrice: 175,
    weeklyChange: 2.9,
    monthlyChange: 5.9,
    yearlyChange: 9.1,
    description: "Farm-raised tilapia fish",
    image: "/images/commodities/fish-tilapia.jpg",
    priceHistory: generatePriceHistory(180, 0.06),
    regionalPrices: generateRegionalPrices(180),
    supplyChainData: generateSupplyChainData(180),
  },
  {
    id: "34",
    name: "Fish (Pabda)",
    bengaliName: "পাবদা মাছ",
    category: "agriculture",
    unit: "kg",
    currentPrice: 550,
    previousPrice: 530,
    weeklyChange: 3.8,
    monthlyChange: 7.8,
    yearlyChange: 12.2,
    description: "Small freshwater fish popular in Bengali cuisine",
    image: "/images/commodities/fish-pabda.jpg",
    priceHistory: generatePriceHistory(550, 0.07),
    regionalPrices: generateRegionalPrices(550),
    supplyChainData: generateSupplyChainData(550),
  },
  {
    id: "35",
    name: "Green Papaya",
    bengaliName: "পেঁপে কাঁচা",
    category: "agriculture",
    unit: "kg",
    currentPrice: 40,
    previousPrice: 38,
    weeklyChange: 5.3,
    monthlyChange: 8.1,
    yearlyChange: 11.1,
    description: "Unripe papaya used in various Bengali dishes",
    image: "/images/commodities/green-papaya.jpg",
    priceHistory: generatePriceHistory(40, 0.05),
    regionalPrices: generateRegionalPrices(40),
    supplyChainData: generateSupplyChainData(40),
  },
  {
    id: "36",
    name: "Banana (Green)",
    bengaliName: "কাঁচা কলা",
    category: "agriculture",
    unit: "dozen",
    currentPrice: 60,
    previousPrice: 58,
    weeklyChange: 3.4,
    monthlyChange: 7.1,
    yearlyChange: 9.1,
    description: "Green bananas used for cooking",
    image: "/images/commodities/banana-green.jpg",
    priceHistory: generatePriceHistory(60, 0.04),
    regionalPrices: generateRegionalPrices(60),
    supplyChainData: generateSupplyChainData(60),
  },
  {
    id: "37",
    name: "Eggplant",
    bengaliName: "বেগুন",
    category: "agriculture",
    unit: "kg",
    currentPrice: 65,
    previousPrice: 60,
    weeklyChange: 8.3,
    monthlyChange: 12.1,
    yearlyChange: 18.2,
    description: "Fresh eggplants from local farms",
    image: "/images/commodities/eggplant.jpg",
    priceHistory: generatePriceHistory(65, 0.09),
    regionalPrices: generateRegionalPrices(65),
    supplyChainData: generateSupplyChainData(65),
  },
  {
    id: "38",
    name: "Cucumber",
    bengaliName: "শসা",
    category: "agriculture",
    unit: "kg",
    currentPrice: 45,
    previousPrice: 48,
    weeklyChange: -6.3,
    monthlyChange: -4.3,
    yearlyChange: 7.1,
    description: "Fresh cucumbers from local farms",
    image: "/images/commodities/cucumber.jpg",
    priceHistory: generatePriceHistory(45, 0.06),
    regionalPrices: generateRegionalPrices(45),
    supplyChainData: generateSupplyChainData(45),
  },
  {
    id: "39",
    name: "Bitter Gourd",
    bengaliName: "করলা",
    category: "agriculture",
    unit: "kg",
    currentPrice: 70,
    previousPrice: 65,
    weeklyChange: 7.7,
    monthlyChange: 12.9,
    yearlyChange: 16.7,
    description: "Bitter gourd used in traditional dishes",
    image: "/images/commodities/bitter-gourd.jpg",
    priceHistory: generatePriceHistory(70, 0.08),
    regionalPrices: generateRegionalPrices(70),
    supplyChainData: generateSupplyChainData(70),
  },
  {
    id: "40",
    name: "Tomato",
    bengaliName: "টমেটো",
    category: "agriculture",
    unit: "kg",
    currentPrice: 60,
    previousPrice: 65,
    weeklyChange: -7.7,
    monthlyChange: -10.4,
    yearlyChange: 15.4,
    description: "Fresh tomatoes from local farms",
    image: "/images/commodities/tomato.jpg",
    priceHistory: generatePriceHistory(60, 0.12),
    regionalPrices: generateRegionalPrices(60),
    supplyChainData: generateSupplyChainData(60),
  },
];

// Get commodity by id
export const getCommodityById = (id: string): Commodity | undefined => {
  return commodities.find((commodity) => commodity.id === id);
};

// Get commodities by category
export const getCommoditiesByCategory = (category: string): Commodity[] => {
  return commodities.filter((commodity) => commodity.category === category);
};

// Group commodities by category
export const commoditiesByCategory = {
  agriculture: commodities.filter((c) => c.category === "agriculture"),
  consumer: commodities.filter((c) => c.category === "consumer"),
  industrial: commodities.filter((c) => c.category === "industrial"),
  energy: commodities.filter((c) => c.category === "energy"),
};

// Get top changed commodities (both increase and decrease)
export const getTopChangedCommodities = (limit: number = 5): Commodity[] => {
  return [...commodities]
    .sort((a, b) => Math.abs(b.weeklyChange) - Math.abs(a.weeklyChange))
    .slice(0, limit);
};

// Get commodities with price increases
export const getPriceIncreasedCommodities = (limit: number = 5): Commodity[] => {
  return [...commodities]
    .filter((c) => c.weeklyChange > 0)
    .sort((a, b) => b.weeklyChange - a.weeklyChange)
    .slice(0, limit);
};

// Get commodities with price decreases
export const getPriceDecreasedCommodities = (limit: number = 5): Commodity[] => {
  return [...commodities]
    .filter((c) => c.weeklyChange < 0)
    .sort((a, b) => a.weeklyChange - b.weeklyChange)
    .slice(0, limit);
};

export default commodities;
