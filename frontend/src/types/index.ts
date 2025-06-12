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

export type Location = {
  id?: number;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  poi_id?: string;
};

export type LocationWithPrices = {
  id: number;
  name: string;
  address: string;
  category: "all" | "gas" | "grocery" | "restaurant";
  price: number;
  originalPrice: number;
  discount: string;
  lat: number;
  lng: number;
  commodities: Array<{
    name: string;
    price: number;
    unit: string;
    recorded_at: string;
    category: string;
  }>;
  region_name: string;
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
  location_id?: number;
  location?: Location;
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

// Accident Data Types
export interface AccidentData {
  id: number;
  year: number;
  total_accidents: number;
  total_killed: number;
  total_injured: number;
  accident_hotspot: string;
  daily_deaths: string;
  daily_injured: string;
  monthly_deaths: string;
  monthly_injured: string;
  vehicles_involved: string;
  accidents_by_district: string;
  date: string | null;
  created_at: string;
  last_updated: string | null;
}

export interface LatestAccidentData {
  accident_datetime_from_url: string;
  accident_type: string;
  district_of_accident: string;
  exact_location_of_accident: string;
  headline: string;
  summary: string;
  total_number_of_people_injured: string;
  total_number_of_people_killed: string;
}

export interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat: string;
  lon: string;
  url: string;
}
