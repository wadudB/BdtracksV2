import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commodityService, priceService, regionService } from "@/services/api";
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

      // Show success toast
      toast.success("Price record added successfully");
    },
    onError: (error) => {
      console.error("Error creating price record:", error);
      toast.error("Failed to add price record. Please try again.");
    },
  });
};
