"use client";

import React, { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Commodity } from "@/types";

interface PriceHistoryChartProps {
  commodity: Commodity;
  timeRange?: "3m" | "6m" | "1y" | "3y";
}

// Custom tooltip type definition
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      price: number;
      date: string;
      change: number;
      changePercent: number;
    };
  }>;
  label?: string;
}

export default function PriceHistoryChart({ commodity, timeRange = "3m" }: PriceHistoryChartProps) {
  // Calculate date ranges based on timeRange
  const dateRanges = useMemo(() => {
    const now = new Date();
    const ranges = {
      "3m": new Date(now.setMonth(now.getMonth() - 3)),
      "6m": new Date(now.setMonth(now.getMonth() - 6)),
      "1y": new Date(now.setFullYear(now.getFullYear() - 1)),
      "3y": new Date(now.setFullYear(now.getFullYear() - 3)),
    };
    return ranges;
  }, []);

  // Format and filter price history data
  const chartData = useMemo(() => {
    if (!commodity.priceHistory || commodity.priceHistory.length === 0) {
      return [];
    }

    // Sort by date ascending
    const sortedHistory = [...commodity.priceHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filter by selected time range
    const startDate = dateRanges[timeRange];
    const filteredData = sortedHistory.filter((point) => new Date(point.date) >= startDate);

    // Calculate price changes
    return filteredData.map((point, index, arr) => {
      const prevPrice = index > 0 ? arr[index - 1].price : point.price;
      const change = point.price - prevPrice;
      const changePercent = (change / prevPrice) * 100;

      return {
        ...point,
        date: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        change,
        changePercent: Math.round(changePercent * 100) / 100,
      };
    });
  }, [commodity.priceHistory, timeRange, dateRanges]);

  // Calculate statistics for the current time range
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);

    // Calculate net change over the period
    const startPrice = chartData[0].price;
    const endPrice = chartData[chartData.length - 1].price;
    const netChange = endPrice - startPrice;
    const netChangePercent = Math.round((netChange / startPrice) * 100);

    return {
      minPrice,
      maxPrice,
      avgPrice,
      startPrice,
      endPrice,
      netChange,
      netChangePercent,
    };
  }, [chartData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Price: ৳{dataPoint.price}/{commodity.unit}
          </p>
          <p
            className={`text-xs ${
              dataPoint.change > 0
                ? "text-red-500"
                : dataPoint.change < 0
                  ? "text-green-500"
                  : "text-foreground"
            }`}
          >
            Change: {dataPoint.change > 0 ? "+" : ""}
            {dataPoint.change} ({dataPoint.changePercent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const chartConfig = {
    price: {
      label: "Price",
      color: "var(--primary)",
    },
    average: {
      label: "Average",
      color: "var(--secondary)",
    },
    min: {
      label: "Min",
      color: "var(--muted-foreground)",
    },
    max: {
      label: "Max",
      color: "var(--muted-foreground)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col">
      {/* Price range summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4 flex flex-col">
            <span className="text-muted-foreground text-sm">Period Range</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium">
                ৳{stats.startPrice} → ৳{stats.endPrice}
              </span>
            </div>
            <span
              className={`text-sm ${
                stats.netChange > 0 ? "text-red-500" : stats.netChange < 0 ? "text-green-500" : ""
              }`}
            >
              {stats.netChange > 0 ? "+" : ""}
              {stats.netChange} ({stats.netChangePercent}%)
            </span>
          </div>

          <div className="bg-background border border-border rounded-lg p-4 flex flex-col">
            <span className="text-muted-foreground text-sm">Highest Price</span>
            <span className="text-xl font-medium">৳{stats.maxPrice}</span>
            <span className="text-sm text-muted-foreground">per {commodity.unit}</span>
          </div>

          <div className="bg-background border border-border rounded-lg p-4 flex flex-col">
            <span className="text-muted-foreground text-sm">Lowest Price</span>
            <span className="text-xl font-medium">৳{stats.minPrice}</span>
            <span className="text-sm text-muted-foreground">per {commodity.unit}</span>
          </div>

          <div className="bg-background border border-border rounded-lg p-4 flex flex-col">
            <span className="text-muted-foreground text-sm">Average Price</span>
            <span className="text-xl font-medium">৳{stats.avgPrice}</span>
            <span className="text-sm text-muted-foreground">per {commodity.unit}</span>
          </div>
        </div>
      )}

      {/* Price history chart */}
      <div className="h-[400px] w-full">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {stats && (
                <>
                  <ReferenceLine
                    y={stats.avgPrice}
                    stroke="var(--secondary)"
                    strokeDasharray="3 3"
                    label={{
                      value: `Avg: ৳${stats.avgPrice}`,
                      position: "right",
                      fill: "var(--secondary)",
                      fontSize: 12,
                    }}
                  />
                  {commodity.minPrice && (
                    <ReferenceLine
                      y={commodity.minPrice}
                      stroke="var(--muted-foreground)"
                      strokeDasharray="3 3"
                      label={{
                        value: `Min: ৳${commodity.minPrice}`,
                        position: "insideBottomLeft",
                        fill: "var(--muted-foreground)",
                        fontSize: 12,
                      }}
                    />
                  )}
                  {commodity.maxPrice && (
                    <ReferenceLine
                      y={commodity.maxPrice}
                      stroke="var(--muted-foreground)"
                      strokeDasharray="3 3"
                      label={{
                        value: `Max: ৳${commodity.maxPrice}`,
                        position: "insideTopLeft",
                        fill: "var(--muted-foreground)",
                        fontSize: 12,
                      }}
                    />
                  )}
                </>
              )}
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "var(--primary)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: "var(--primary)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
