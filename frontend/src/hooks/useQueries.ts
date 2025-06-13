import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commodityService,
  priceService,
  regionService,
  locationService,
  accidentService,
  allAccidentsDataService,
} from "@/services/api";
import { toast } from "sonner";
import { PriceRecord } from "@/types";

// Query keys
export const QUERY_KEYS = {
  COMMODITIES: "commodities",
  COMMODITY: "commodity",
  COMMODITY_DROPDOWN: "commodity-dropdown",
  REGIONS: "regions",
  PRICE_RECORDS: "price-records",
  REGIONAL_PRICES: "regional-prices",
  LOCATIONS_WITH_PRICES: "locations-with-prices",
  ACCIDENT_DATA: "accident-data",
  ACCIDENT_DATA_BY_YEAR: "accident-data-by-year",
  LATEST_ACCIDENT_REPORTS: "latest-accident-reports",
  ALL_ACCIDENTS_DATA: "all-accidents-data",
  ALL_ACCIDENTS_COUNT: "all-accidents-count",
};

// ====== Commodity Queries ======

/**
 * Hook to fetch all commodities with optional category filter
 */
export const useGetCommodities = (params?: { category?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMODITIES, params],
    queryFn: () => commodityService.getAll(params),
  });
};

/**
 * Hook to fetch a single commodity by ID
 */
export const useGetCommodity = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMODITY, id],
    queryFn: () => commodityService.getById(id!),
    enabled: !!id, // Only run the query if ID is provided
  });
};

/**
 * Hook to fetch commodities dropdown data
 */
export const useGetCommodityDropdown = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMODITY_DROPDOWN],
    queryFn: () => commodityService.getDropdown(),
  });
};

/**
 * Hook to fetch regional prices for a commodity
 */
export const useGetRegionalPrices = (commodityId?: string | number, timeWindow?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REGIONAL_PRICES, commodityId, timeWindow],
    queryFn: () => priceService.getRegionalPrices(commodityId!, timeWindow),
    enabled: !!commodityId, // Only run the query if commodityId is provided
  });
};

// ====== Region Queries ======

/**
 * Hook to fetch all regions
 */
export const useGetRegions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REGIONS],
    queryFn: () => regionService.getAll(),
  });
};

// ====== Location Queries ======

/**
 * Hook to fetch locations with price data within a geographic range
 */
export const useGetLocationsWithPrices = (params: {
  lat: number;
  lng: number;
  radius_km?: number;
  days?: number;
  category?: string;
  commodity_id?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOCATIONS_WITH_PRICES, params],
    queryFn: () => locationService.getWithPrices(params),
  });
};

// ====== Price Mutations ======

/**
 * Hook to create a new price record
 */
export const useCreatePriceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<PriceRecord, "id" | "created_at">) => priceService.create(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to force refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMODITIES] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMODITY, variables.commodity_id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REGIONAL_PRICES, variables.commodity_id.toString()],
      });
      // Invalidate locations with prices to update the map
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOCATIONS_WITH_PRICES],
      });

      // Show success toast
      toast.success("Price record added successfully");
    },
    onError: (error) => {
      console.error("Error creating price record:", error);
      toast.error("Failed to add price record. Please try again.");
    },
  });
};

// ====== Accident Data Queries ======

/**
 * Hook to fetch all accident data with optional pagination
 */
export const useGetAccidentData = (params?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCIDENT_DATA, params],
    queryFn: () => accidentService.getAll(params),
  });
};

/**
 * Hook to fetch accident data by specific year
 */
export const useGetAccidentDataByYear = (year?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCIDENT_DATA_BY_YEAR, year],
    queryFn: () => accidentService.getByYear(year!),
    enabled: !!year, // Only run the query if year is provided
  });
};

/**
 * Hook to fetch latest accident reports
 */
export const useGetLatestAccidentReports = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LATEST_ACCIDENT_REPORTS],
    queryFn: () => accidentService.getLatestReports(),
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes (more frequent for latest reports)
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};

// ====== All Accidents Data Queries ======

/**
 * Hook to fetch all accidents data with pagination and optional filters
 */
export const useGetAllAccidentsData = (params?: {
  skip?: number;
  limit?: number;
  district?: string;
  accidentType?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_ACCIDENTS_DATA, params],
    queryFn: () => allAccidentsDataService.getAll(params),
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

/**
 * Hook to fetch total count of all accidents data with optional filters
 */
export const useGetAllAccidentsCount = (params?: { district?: string; accidentType?: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_ACCIDENTS_COUNT, params],
    queryFn: () => allAccidentsDataService.getCount(params),
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

/**
 * Hook to fetch a specific accident record by ID
 */
export const useGetAllAccidentsDataById = (uId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_ACCIDENTS_DATA, uId],
    queryFn: () => allAccidentsDataService.getById(uId!),
    enabled: !!uId, // Only run the query if uId is provided
  });
};
