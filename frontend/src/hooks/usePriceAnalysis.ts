import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/api";

export interface PriceAnalysisData {
  commodity_id: number;
  commodity_name: string;
  timeframe: string;
  analysis: {
    average_price: number;
    min_price: number;
    max_price: number;
    volatility: number;
    trend: string;
  };
  price_data: Array<{
    date: string;
    price: number;
    movingAvg: number | null;
    monthlyChange: number | null;
  }>;
}

interface PriceAnalysisParams {
  commodityId: number | string;
  timeframe?: "week" | "month" | "year" | "all";
}

export function usePriceAnalysis({ commodityId, timeframe = "month" }: PriceAnalysisParams) {
  return useQuery<PriceAnalysisData>({
    queryKey: ["price-analysis", commodityId, timeframe],
    queryFn: async () => {
      return analyticsService.getPriceAnalysis(commodityId, timeframe);
    },
    enabled: !!commodityId,
  });
}
