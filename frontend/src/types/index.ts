export type CommodityCategory = "agriculture" | "industrial" | "consumer" | "energy";

export type Region = {
  id: string | number;
  name: string;
  bengaliName?: string;
  latitude?: number;
  longitude?: number;
  isDivision?: boolean;
};

export type PricePoint = {
  date: string;
  price: number;
};

export type RegionalPrice = {
  region: string;
  price: number;
};

export type PriceRecord = {
  id: number;
  commodity_id: number;
  region_id: number;
  price: number;
  recorded_at: string;
  created_at: string;
  source?: string;
  notes?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  name?: string;
};

export type Commodity = {
  id: string;
  name: string;
  bengaliName: string;
  category: CommodityCategory;
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
};

export type CommodityListResponse = {
  commodities: Commodity[];
  total: number;
};

export type RegionListResponse = {
  regions: Region[];
  total: number;
};
