import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RegionalMap from "@/components/maps/RegionalMap";
import { useGetCommodities, useGetRegionalPrices } from "@/hooks/useQueries";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

// Define types for regional price data
interface RegionalPriceItem {
  regionId: string | number;
  regionName?: string;
  price: number;
  trend?: number | null;
  lat?: number;
  lng?: number;
}

interface RegionalPricesResponse {
  prices: RegionalPriceItem[];
}

// Time window options
const TIME_OPTIONS = [
  { value: "7", label: "7 Days" },
  { value: "30", label: "30 Days" },
  { value: "90", label: "90 Days" },
];

export default function MapPage() {
  // State for UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeWindow, setSelectedTimeWindow] = useState("30");
  const [selectedCommodityId, setSelectedCommodityId] = useState("");
  const [selectedCommodityName, setSelectedCommodityName] = useState("");

  // Fetch commodities data
  const { data: commodities = [], isLoading: commoditiesLoading } = useGetCommodities();

  // Fetch regional prices based on selected commodity and time window
  const { data: regionalPricesData, isLoading: pricesLoading } = useGetRegionalPrices(
    selectedCommodityId,
    parseInt(selectedTimeWindow)
  );

  // Set default selected commodity on initial load
  useEffect(() => {
    if (commodities.length > 0 && !selectedCommodityId) {
      setSelectedCommodityId(commodities[0].id);
      setSelectedCommodityName(commodities[0].name);
    }
  }, [commodities, selectedCommodityId]);

  // Filter commodities based on search query
  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format regional prices data for the map component
  const mapPriceData = ((regionalPricesData as RegionalPricesResponse)?.prices || []).map(
    (item: RegionalPriceItem) => ({
      regionId: item.regionId,
      regionName: item.regionName,
      price: item.price,
      change: item.trend === null ? undefined : item.trend,
      latitude: item.lat,
      longitude: item.lng,
    })
  );


  return (
    <Section>
      <Container>
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Regional Price Map</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View and compare commodity prices across different regions of Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Commodity selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Commodity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search input */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search commodities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Commodity list */}
                <div className="space-y-1 max-h-95 overflow-y-auto">
                  {commoditiesLoading ? (
                    <div className="py-2 text-center text-muted-foreground">
                      Loading commodities...
                    </div>
                  ) : filteredCommodities.length === 0 ? (
                    <div className="py-2 text-center text-muted-foreground">
                      No commodities found
                    </div>
                  ) : (
                    filteredCommodities.map((commodity) => (
                      <button
                        key={commodity.id}
                        onClick={() => {
                          setSelectedCommodityId(commodity.id);
                          setSelectedCommodityName(commodity.name);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedCommodityId === commodity.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{commodity.name}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map options */}
            <Card>
              <CardHeader>
                <CardTitle>Time Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedTimeWindow === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeWindow(option.value)}
                      className="w-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map and data display */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map */}
            <Card className="gap-0">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedCommodityName || "Select a commodity"}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {selectedTimeWindow} Day Price Analysis
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <RegionalMap
                    selectedCommodity={selectedCommodityName}
                    priceData={mapPriceData}
                    isLoading={pricesLoading || commoditiesLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price comparison table */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                {pricesLoading ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Loading price data...
                  </div>
                ) : !selectedCommodityId ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Select a commodity to view price comparison
                  </div>
                ) : !regionalPricesData?.prices?.length ? (
                  <div className="py-4 text-center text-muted-foreground">
                    No price data available for this commodity
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Region</th>
                          <th className="py-2 px-4 text-right">Price (৳)</th>
                          <th className="py-2 px-4 text-right">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(regionalPricesData as RegionalPricesResponse).prices.map(
                          (item: RegionalPriceItem) => {
                            // Calculate average price for comparison
                            const avgPrice =
                              (regionalPricesData as RegionalPricesResponse).prices.reduce(
                                (sum: number, curr: RegionalPriceItem) => sum + curr.price,
                                0
                              ) / (regionalPricesData as RegionalPricesResponse).prices.length;

                            // Get region name from API response or fallback to formatted ID
                            const regionName =
                              item.regionName ||
                              String(item.regionId).charAt(0).toUpperCase() +
                                String(item.regionId).slice(1);

                            return (
                              <tr key={item.regionId} className="border-b border-border">
                                <td className="py-2 px-4 font-medium">{regionName}</td>
                                <td className="py-2 px-4 text-right font-mono">৳{item.price}</td>
                                <td className="py-2 px-4 text-right">
                                  <span
                                    className={
                                      item.price > avgPrice
                                        ? "text-red-500 font-medium"
                                        : item.price < avgPrice
                                          ? "text-green-500 font-medium"
                                          : ""
                                    }
                                  >
                                    {item.price > avgPrice ? "+" : ""}
                                    {(((item.price - avgPrice) / avgPrice) * 100).toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                    <div className="text-xs text-muted-foreground mt-4">
                      <p>* Prices shown in Bangladeshi Taka (৳) per kg/unit</p>
                      <p>* Percentages indicate price difference from the national average</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
