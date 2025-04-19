import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddDataModal from "@/components/modals/AddDataModal";
import { formatCurrencyPrice, formatPriceChange } from "@/utils/price-utils";
import { ArrowRight, BarChart2, Calendar, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useGetCommodity } from "@/hooks/useQueries";
import PriceAnalysisChart from "@/components/charts/PriceAnalysisChart";
import PriceHistoryChart from "@/components/charts/PriceHistoryChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommodityDetails() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [historyTimeRange, setHistoryTimeRange] = useState<"3m" | "6m" | "1y" | "3y">("3m");
  const { id } = useParams<{ id: string }>();

  // Use React Query hook to fetch commodity data
  const {
    data: commodity,
    isLoading,
    error: queryError,
    refetch: refreshData,
  } = useGetCommodity(id);

  // Function to handle successful data update - defined before any conditional returns
  const handleDataUpdated = useCallback(() => {
    refreshData();
    toast.info("Commodity data refreshed");
  }, [refreshData]);

  // Function to handle time range change
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHistoryTimeRange(e.target.value as "3m" | "6m" | "1y" | "3y");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4">Loading commodity data...</p>
      </div>
    );
  }

  // Error state
  if (queryError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 inline-block">
          <p className="text-red-700">Failed to load commodity details. Please try again later.</p>
          <Button variant="outline" className="mt-2" onClick={() => refreshData()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Not found
  if (!commodity) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Commodity not found</p>
      </div>
    );
  }

  // Function to determine trend icon
  const getTrendIcon = (value: number | null) => {
    if (!value) return <Minus className="h-4 w-4" />;
    if (value > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ArrowRight className="inline-block h-3 w-3 mx-1" />
        <Link to="/commodities" className="hover:text-primary transition-colors">
          Commodities
        </Link>
        <ArrowRight className="inline-block h-3 w-3 mx-1" />
        <span className="text-foreground">{commodity.name}</span>
      </div>

      {/* Enhanced Header section */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium capitalize">
                {commodity.category}
              </span>
              <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-md text-xs font-medium">
                Per {commodity.unit}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              {commodity.name}
              <span className="text-xl text-muted-foreground font-normal">
                ({commodity.bengaliName})
              </span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Current Price:</span>
                <span className="text-xl font-bold">
                  {formatCurrencyPrice(commodity.currentPrice, "৳", commodity.unit)}
                </span>
                <div
                  className={cn(
                    "ml-1 flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5",
                    commodity.weeklyChange > 0
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      : commodity.weeklyChange < 0
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                  )}
                >
                  {formatPriceChange(commodity.weeklyChange)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Price Range:</span>
                <span className="font-medium">
                  {formatCurrencyPrice(commodity.minPrice, "৳")} -{" "}
                  {formatCurrencyPrice(commodity.maxPrice, "৳")}
                </span>
              </div>
            </div>
          </div>
          <AddDataModal
            trigger={<Button>Add Price Data</Button>}
            commodity={commodity}
            onSuccess={handleDataUpdated}
          />
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "overview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart2 className="h-4 w-4" />
            Overview
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "history"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
            onClick={() => setActiveTab("history")}
          >
            <Calendar className="h-4 w-4" />
            Price History
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-full md:col-span-2 space-y-6 w-full">
            {/* Price Analysis Chart */}
            <Card className="p-6">
              <PriceAnalysisChart
                commodity={{
                  ...commodity,
                  // Ensure consistent value for monthlyChange between the chart and sidebar
                  priceHistory: commodity.priceHistory.map((point) => ({
                    ...point,
                    // If price chart is calculating monthChange differently, it will now use the same value
                    monthChange: commodity.monthlyChange,
                  })),
                }}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-full md:col-span-1 space-y-6">
            {/* Price Metrics Card */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Price Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(commodity.weeklyChange)}
                      <span className="text-sm font-medium">Weekly Change</span>
                    </div>
                    <span
                      className={cn(
                        "font-bold",
                        commodity.weeklyChange > 0
                          ? "text-red-500"
                          : commodity.weeklyChange < 0
                            ? "text-green-500"
                            : "text-yellow-500"
                      )}
                    >
                      {commodity.weeklyChange > 0 && "+"}
                      {commodity.weeklyChange != null ? Math.round(commodity.weeklyChange) : "-"}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(commodity.monthlyChange)}
                      <span className="text-sm font-medium">Monthly Change</span>
                    </div>
                    <span
                      className={cn(
                        "font-bold",
                        commodity.monthlyChange > 0
                          ? "text-red-500"
                          : commodity.monthlyChange < 0
                            ? "text-green-500"
                            : "text-yellow-500"
                      )}
                    >
                      {commodity.monthlyChange > 0 && "+"}
                      {commodity.monthlyChange != null ? Math.round(commodity.monthlyChange) : "-"}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(commodity.yearlyChange)}
                      <span className="text-sm font-medium">Yearly Change</span>
                    </div>
                    <span
                      className={cn(
                        "font-bold",
                        commodity.yearlyChange > 0
                          ? "text-red-500"
                          : commodity.yearlyChange < 0
                            ? "text-green-500"
                            : "text-yellow-500"
                      )}
                    >
                      {commodity.yearlyChange > 0 && "+"}
                      {commodity.yearlyChange != null ? Math.round(commodity.yearlyChange) : "-"}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Price Summary */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Regional Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {(() => {
                    const prices = commodity.regionalPrices.map((r) => r.price);
                    const highest = Math.max(...prices);
                    const lowest = Math.min(...prices);
                    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

                    const highestRegion =
                      commodity.regionalPrices.find((r) => r.price === highest)?.region || "";
                    const lowestRegion =
                      commodity.regionalPrices.find((r) => r.price === lowest)?.region || "";

                    return (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-red-500"></div>
                              <span className="text-sm font-medium capitalize">
                                {highestRegion}
                              </span>
                            </div>
                            <span className="text-sm font-bold">
                              ৳{highest}/{commodity.unit}
                            </span>
                          </div>
                          <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (highest / (highest * 1.2)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            Highest price region
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                              <span className="text-sm font-medium">National Avg</span>
                            </div>
                            <span className="text-sm font-bold">
                              ৳{Math.round(avgPrice)}/{commodity.unit}
                            </span>
                          </div>
                          <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (avgPrice / (highest * 1.2)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            National average price
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium capitalize">{lowestRegion}</span>
                            </div>
                            <span className="text-sm font-bold">
                              ৳{lowest}/{commodity.unit}
                            </span>
                          </div>
                          <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (lowest / (highest * 1.2)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            Lowest price region
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Price History Tab */}
      {activeTab === "history" && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Price History</CardTitle>
              <CardDescription>Historical price trends over time</CardDescription>
            </div>
            <div className="flex space-x-2">
              <select
                className="bg-background border border-border rounded-md p-2 text-sm"
                value={historyTimeRange}
                onChange={handleTimeRangeChange}
              >
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last 1 year</option>
                <option value="3y">Last 3 years</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {commodity.priceHistory && commodity.priceHistory.length > 0 ? (
              <PriceHistoryChart commodity={commodity} timeRange={historyTimeRange} />
            ) : (
              <div className="h-80 w-full bg-muted/30 flex items-center justify-center rounded-md mb-6">
                <p className="text-muted-foreground">No price history data available</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Historical Data</h3>
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-right py-3 px-4 font-medium">Price</th>
                      <th className="text-right py-3 px-4 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show only the last 10 data points for readability */}
                    {commodity.priceHistory.slice(-10).map((point, index, arr) => {
                      const prevPrice = index > 0 ? arr[index - 1].price : point.price;
                      const change = point.price - prevPrice;
                      const changePercent = (change / prevPrice) * 100;

                      return (
                        <tr key={point.date} className="border-b border-border hover:bg-muted/30">
                          <td className="py-3 px-4">{point.date}</td>
                          <td className="text-right py-3 px-4">
                            {formatCurrencyPrice(point.price, "৳", commodity.unit)}
                          </td>
                          <td className="text-right py-3 px-4">
                            <div
                              className={cn(
                                "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold",
                                change > 0
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : change < 0
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              )}
                            >
                              {formatPriceChange(change, false)} (
                              {formatPriceChange(changePercent, true, false)})
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
