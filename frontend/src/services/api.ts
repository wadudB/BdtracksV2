import { Commodity, PriceRecord, Region } from "../types";

const API_URL = "http://localhost:8000/api/v1";

/**
 * Base API client configuration
 */
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};

/**
 * Commodity API services
 */
export const commodityService = {
  // Get all commodities with optional filtering
  getAll: async (params?: { skip?: number; limit?: number; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);

    const queryString = queryParams.toString();
    const endpoint = `/commodities${queryString ? `?${queryString}` : ""}`;

    return (await apiClient(endpoint)) as Commodity[];
  },

  // Get commodity by ID
  getById: async (id: string) => {
    return (await apiClient(`/commodities/${id}`)) as Commodity;
  },

  // Get dropdown data for commodities (simplified data for select inputs)
  getDropdown: async () => {
    return await apiClient("/commodities/dropdown");
  },
};

/**
 * Region API services
 */
export const regionService = {
  // Get all regions
  getAll: async (params?: { skip?: number; limit?: number; is_division?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.is_division !== undefined)
      queryParams.append("is_division", params.is_division.toString());

    const queryString = queryParams.toString();
    const endpoint = `/regions${queryString ? `?${queryString}` : ""}`;

    return (await apiClient(endpoint)) as Region[];
  },

  // Get region by ID
  getById: async (id: string) => {
    return (await apiClient(`/regions/${id}`)) as Region;
  },
};

/**
 * Price records API services
 */
export const priceService = {
  // Get all price records with filtering options
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    commodity_id?: number;
    region_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.commodity_id) queryParams.append("commodity_id", params.commodity_id.toString());
    if (params?.region_id) queryParams.append("region_id", params.region_id.toString());
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    const queryString = queryParams.toString();
    const endpoint = `/prices${queryString ? `?${queryString}` : ""}`;

    return (await apiClient(endpoint)) as PriceRecord[];
  },

  // Get regional prices for a commodity
  getRegionalPrices: async (commodityId: string | number, timeWindow?: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append("commodity_id", commodityId.toString());
    if (timeWindow) queryParams.append("time_window", timeWindow.toString());

    return await apiClient(`/prices/regions?${queryParams.toString()}`);
  },

  // Get price record by ID
  getById: async (id: string) => {
    return (await apiClient(`/prices/${id}`)) as PriceRecord;
  },

  // Create a new price record
  create: async (data: {
    commodity_id: number;
    region_id: number;
    price: number;
    source?: string;
    notes?: string;
    recorded_at: string;
  }) => {
    return (await apiClient("/prices", {
      method: "POST",
      body: JSON.stringify(data),
    })) as PriceRecord;
  },
};

/**
 * Analytics API services
 */
export const analyticsService = {
  // Get price trends data
  getPriceTrends: async (params?: {
    commodity_id?: number;
    region_id?: number;
    start_date?: string;
    end_date?: string;
    period?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.commodity_id) queryParams.append("commodity_id", params.commodity_id.toString());
    if (params?.region_id) queryParams.append("region_id", params.region_id.toString());
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.period) queryParams.append("period", params.period);

    const queryString = queryParams.toString();
    const endpoint = `/analytics/trends${queryString ? `?${queryString}` : ""}`;

    return await apiClient(endpoint);
  },

  // Get regional comparison data
  getRegionalComparison: async (commodity_id: number, comparison_date?: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("commodity_id", commodity_id.toString());
    if (comparison_date) queryParams.append("comparison_date", comparison_date);

    const queryString = queryParams.toString();
    const endpoint = `/analytics/comparison?${queryString}`;

    return await apiClient(endpoint);
  },

  // Get price analysis data for a specific commodity
  getPriceAnalysis: async (commodityId: number | string, timeframe: string = "month") => {
    const queryParams = new URLSearchParams();
    queryParams.append("timeframe", timeframe);
    
    const endpoint = `/analytics/price-analysis/${commodityId}?${queryParams.toString()}`;
    
    return await apiClient(endpoint);
  },
};
