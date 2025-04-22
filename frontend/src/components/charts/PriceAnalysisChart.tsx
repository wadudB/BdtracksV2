"use client";

import React, { useMemo, useState } from "react";
import {
  format as _format,
  subDays as _subDays,
  subMonths as _subMonths,
  subYears as _subYears,
} from "date-fns";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine as _ReferenceLine,
  Line,
  ComposedChart,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button as _Button } from "@/components/ui/button";
import { BarChart as _BarChart, ArrowUp as _ArrowUp, ArrowDown as _ArrowDown } from "lucide-react";

// Import components from the chart abstraction
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend as _ChartLegend } from "@/components/ui/chart";
import { Commodity } from "@/types";

interface PriceAnalysisChartProps {
  commodity: Commodity;
  timeframe?: "week" | "month" | "year" | "all";
  onTimeframeChange?: (timeframe: "week" | "month" | "year" | "all") => void;
}

export default function PriceAnalysisChart({
  commodity,
  timeframe = "month",
  onTimeframeChange,
}: PriceAnalysisChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);

  // Update parent component when timeframe changes
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    if (
      onTimeframeChange &&
      (value === "week" || value === "month" || value === "year" || value === "all")
    ) {
      onTimeframeChange(value as "week" | "month" | "year" | "all");
    }
  };

  // Format the data with moving averages and trends
  const chartData = useMemo(() => {
    if (!commodity.priceHistory || commodity.priceHistory.length === 0) {
      return [];
    }

    // Sort history by date
    const sortedHistory = [...commodity.priceHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate time range based on selectedTimeframe
    const now = new Date();
    let startDate = new Date();

    switch (selectedTimeframe) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        startDate = new Date(0); // Beginning of time
    }

    // Filter data based on timeframe
    const filteredData = sortedHistory.filter((point) => new Date(point.date) >= startDate);

    // Calculate moving average (7-day)
    const movingAverageWindow = 7;
    const dataWithMovingAverage = filteredData.map((point, index) => {
      const start = Math.max(0, index - movingAverageWindow + 1);
      const windowSlice = filteredData.slice(start, index + 1);
      const sum = windowSlice.reduce((acc, curr) => acc + curr.price, 0);
      const movingAvg = windowSlice.length > 0 ? Math.round(sum / windowSlice.length) : null;

      // Calculate month-over-month change
      const monthAgo = new Date(point.date);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const monthAgoData = sortedHistory.find(
        (p) => new Date(p.date).getTime() <= monthAgo.getTime()
      );

      const monthChange = monthAgoData
        ? Math.round(((point.price - monthAgoData.price) / monthAgoData.price) * 100)
        : null;

      // Format the date for display
      const date = new Date(point.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        ...point,
        formattedDate,
        movingAvg,
        monthChange,
        // Add min and max reference lines
        minPrice: commodity.minPrice,
        maxPrice: commodity.maxPrice,
      };
    });

    return dataWithMovingAverage;
  }, [commodity.priceHistory, selectedTimeframe, commodity.minPrice, commodity.maxPrice]);

  const chartConfig: ChartConfig = {
    price: {
      label: "Price",
      color: "var(--chart-1)",
    },
    movingAvg: {
      label: "7-Day Average",
      color: "var(--chart-2)",
    },
    minPrice: {
      label: "Minimum Price",
      color: "var(--chart-3)",
    },
    maxPrice: {
      label: "Maximum Price",
      color: "var(--chart-4)",
    },
  };

  // Calculate price statistics
  const priceStats = useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map((item) => item.price);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // Calculate standard deviation
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
    const stdDev = Math.round(Math.sqrt(variance));

    // Calculate volatility (coefficient of variation)
    const volatility = Math.round((stdDev / avg) * 100);

    // Calculate trend (simple linear regression slope)
    const n = prices.length;
    const indices = [...Array(n).keys()];
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = prices.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, i) => sum + i * prices[i], 0);
    const sumXX = indices.reduce((sum, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    // Get trend direction and strength
    let trend = "stable";
    if (slope > 5) trend = "strongly rising";
    else if (slope > 1) trend = "rising";
    else if (slope < -5) trend = "strongly falling";
    else if (slope < -1) trend = "falling";

    // Get the most recent month-over-month change
    const lastMonthChange = chartData[chartData.length - 1]?.monthChange ?? 0;

    return {
      average: avg,
      minimum: min,
      maximum: max,
      standardDeviation: stdDev,
      volatility,
      trend,
      lastMonthChange,
    };
  }, [chartData]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Price Analysis for {commodity.name}</h2>
        <p className="text-sm text-muted-foreground">
          Historical price trends and price volatility analysis
        </p>
      </div>
      <Tabs
        defaultValue={selectedTimeframe}
        onValueChange={handleTimeframeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTimeframe} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="py-0 gap-0">
              <CardHeader className="p-4 ">
                <CardTitle className="text-base">Price Volatility</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold">{priceStats?.volatility || 0}%</p>
                <p className="text-xs text-muted-foreground">
                  {priceStats?.volatility && priceStats.volatility < 10
                    ? "Low price volatility"
                    : priceStats?.volatility && priceStats.volatility < 20
                      ? "Moderate price volatility"
                      : "High price volatility"}
                </p>
              </CardContent>
            </Card>

            <Card className="py-0 gap-0">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Price Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold capitalize">{priceStats?.trend || "Stable"}</p>
                <p className="text-xs text-muted-foreground">Based on price movement analysis</p>
              </CardContent>
            </Card>

            <Card className="py-0 gap-0">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Monthly Change</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p
                  className={`text-2xl font-bold ${
                    (commodity.monthlyChange || 0) > 0
                      ? "text-red-500"
                      : (commodity.monthlyChange || 0) < 0
                        ? "text-green-500"
                        : ""
                  }`}
                >
                  {commodity.monthlyChange != null
                    ? `${commodity.monthlyChange > 0 ? "+" : ""}${Math.round(
                        commodity.monthlyChange
                      )}%`
                    : "0%"}
                </p>
                <p className="text-xs text-muted-foreground">Change from previous month</p>
              </CardContent>
            </Card>
          </div>

          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="formattedDate"
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
                  tickFormatter={(value: number) => `৳${value}`}
                />
                <Tooltip
                  content={<ChartTooltipContent nameKey="name" labelKey="formattedDate" />}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="var(--chart-1)"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  name="7-Day Average"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
                {commodity.minPrice && (
                  <Line
                    type="monotone"
                    dataKey="minPrice"
                    name="Minimum Price"
                    stroke="var(--chart-3)"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                  />
                )}
                {commodity.maxPrice && (
                  <Line
                    type="monotone"
                    dataKey="maxPrice"
                    name="Maximum Price"
                    stroke="var(--chart-4)"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                  />
                )}
                <Legend />
              </ComposedChart>
            </ChartContainer>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Chart shows historical price trends with 7-day moving average.
            {commodity.minPrice &&
              commodity.maxPrice &&
              " Dotted lines represent minimum and maximum price ranges."}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
