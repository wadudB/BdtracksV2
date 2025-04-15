import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import RegionalPriceMap from '../components/maps/RegionalPriceMap';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import AddDataModal from '@/components/modals/AddDataModal';
import { formatCurrencyPrice, formatPriceChange } from '@/utils/price-utils';
import { MapPin } from 'lucide-react';
import { useGetCommodity } from '@/hooks/useQueries';

export default function CommodityDetails() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'regional'>('overview');
  const { id } = useParams<{ id: string }>();
  
  // Use React Query hook to fetch commodity data
  const { 
    data: commodity,
    isLoading,
    error: queryError,
    refetch: refreshData
  } = useGetCommodity(id);
  
  // Function to handle successful data update - defined before any conditional returns
  const handleDataUpdated = useCallback(() => {
    refreshData();
    toast.info("Commodity data refreshed");
  }, [refreshData]);
  
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
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => refreshData()}
          >
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

  // Prepare regional data for the map component
  const regionData = commodity.regionalPrices.map(region => ({
    regionId: region.region.toLowerCase(),
    price: region.price
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">{commodity.name}</h1>
          <p className="text-xl text-muted-foreground">{commodity.bengaliName}</p>
        </div>
        <AddDataModal 
          trigger={
            <Button>
              Add Price Data
            </Button>
          } 
          commodity={commodity}
          onSuccess={handleDataUpdated}
        />
      </div>

      {/* Price card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Commodity Header */}
        <div className="col-span-2 space-y-6">
          <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold mb-4">About {commodity.name}</h2>
            <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
              <img src={commodity.image || 'https://via.placeholder.com/300x200'} alt={commodity.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-muted-foreground">{commodity.description || `${commodity.name} (${commodity.bengaliName}) is a commonly traded commodity in Bangladesh.`}</p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Price Analysis</h2>
            <div className="h-60 w-full bg-muted/30 flex items-center justify-center">
              <p className="text-muted-foreground">Price analysis chart will be displayed here</p>
            </div>
          </div>
        </div>
        
        {/* Price Details */}
        <div className="space-y-6">
          <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Price Details</h2>
            <div className="mt-1 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="uppercase px-2 py-1 bg-secondary/50 rounded-full text-xs">
                  {commodity.category}
                </div>
                <div>Per {commodity.unit}</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-lg font-medium">
                  {formatCurrencyPrice(commodity.currentPrice, '৳', commodity.unit)}
                </div>
                <div
                  className={cn(
                    'ml-2 flex items-center gap-0.5 text-xs font-medium',
                    commodity.weeklyChange > 0
                      ? 'text-red-500 dark:text-red-400'
                      : commodity.weeklyChange < 0
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-yellow-500 dark:text-yellow-400'
                  )}
                >
                  {formatPriceChange(commodity.weeklyChange)}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Current Price (avg) - compared to last week
              </div>
            </div>
            <div className="mt-1 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="text-sm font-medium">
                  Min: {formatCurrencyPrice(commodity.minPrice, '৳')}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm font-medium">
                  Max: {formatCurrencyPrice(commodity.maxPrice, '৳')}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weekly Change</span>
              <span 
                className={
                  commodity.weeklyChange > 0 ? 'text-red-500 font-medium' : 
                  commodity.weeklyChange < 0 ? 'text-green-500 font-medium' : 
                  'text-yellow-500 font-medium'
                }
              >
                {commodity.weeklyChange > 0 && '+'}{commodity.weeklyChange != null ? Math.round(commodity.weeklyChange) : '-'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Change</span>
              <span 
                className={
                  commodity.monthlyChange > 0 ? 'text-red-500 font-medium' : 
                  commodity.monthlyChange < 0 ? 'text-green-500 font-medium' : 
                  'text-yellow-500 font-medium'
                }
              >
                {commodity.monthlyChange > 0 && '+'}{commodity.monthlyChange != null ? Math.round(commodity.monthlyChange) : '-'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Yearly Change</span>
              <span 
                className={
                  commodity.yearlyChange > 0 ? 'text-red-500 font-medium' : 
                  commodity.yearlyChange < 0 ? 'text-green-500 font-medium' : 
                  'text-yellow-500 font-medium'
                }
              >
                {commodity.yearlyChange > 0 && '+'}{commodity.yearlyChange != null ? Math.round(commodity.yearlyChange) : '-'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">April 9, 2025</span>
            </div>
          </div>
          
          <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Regional Price Range</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Current price is calculated as the average of prices across all regions shown below.
              </p>
              {(() => {
                const prices = commodity.regionalPrices.map(r => r.price);
                const highest = Math.max(...prices);
                const lowest = Math.min(...prices);
                const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                
                const highestRegion = commodity.regionalPrices.find(r => r.price === highest)?.region || '';
                const lowestRegion = commodity.regionalPrices.find(r => r.price === lowest)?.region || '';
                
                return (
                  <>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-1/3">Highest</span>
                      <div className="w-2/3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{highestRegion}</span>
                          <span className="text-sm font-medium">৳{highest}/{commodity.unit}</span>
                        </div>
                        <div className="h-2 bg-red-500 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-1/3">Average</span>
                      <div className="w-2/3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">National</span>
                          <span className="text-sm font-medium">৳{Math.round(avgPrice)}/{commodity.unit}</span>
                        </div>
                        <div className="h-2 bg-yellow-500 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-1/3">Lowest</span>
                      <div className="w-2/3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{lowestRegion}</span>
                          <span className="text-sm font-medium">৳{lowest}/{commodity.unit}</span>
                        </div>
                        <div className="h-2 bg-green-500 rounded"></div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-2">
          <button 
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Price History
          </button>
          <button 
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'regional' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('regional')}
          >
            Regional Prices
          </button>
        </div>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Commodity Info */}
          <div className="col-span-2 space-y-6">
            <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-4">About {commodity.name}</h2>
              <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                <img src={commodity.image || 'https://via.placeholder.com/300x200'} alt={commodity.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-muted-foreground">{commodity.description || `${commodity.name} (${commodity.bengaliName}) is a commonly traded commodity in Bangladesh.`}</p>
            </div>
            
            <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Price Analysis</h2>
              <div className="h-60 w-full bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Price analysis chart will be displayed here</p>
              </div>
            </div>
          </div>
          
          {/* Price Details */}
          <div className="space-y-6">
            <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Price Details</h2>
              <div className="mt-1 flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="uppercase px-2 py-1 bg-secondary/50 rounded-full text-xs">
                    {commodity.category}
                  </div>
                  <div>Per {commodity.unit}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-lg font-medium">
                    {formatCurrencyPrice(commodity.currentPrice, '৳', commodity.unit)}
                  </div>
                  <div
                    className={cn(
                      'ml-2 flex items-center gap-0.5 text-xs font-medium',
                      commodity.weeklyChange > 0
                        ? 'text-red-500 dark:text-red-400'
                        : commodity.weeklyChange < 0
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-yellow-500 dark:text-yellow-400'
                    )}
                  >
                    {formatPriceChange(commodity.weeklyChange)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Price (avg) - compared to last week
                </div>
              </div>
              <div className="mt-1 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    Min: {formatCurrencyPrice(commodity.minPrice, '৳')}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium">
                    Max: {formatCurrencyPrice(commodity.maxPrice, '৳')}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekly Change</span>
                <span 
                  className={
                    commodity.weeklyChange > 0 ? 'text-red-500 font-medium' : 
                    commodity.weeklyChange < 0 ? 'text-green-500 font-medium' : 
                    'text-yellow-500 font-medium'
                  }
                >
                  {commodity.weeklyChange > 0 && '+'}{commodity.weeklyChange != null ? Math.round(commodity.weeklyChange) : '-'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Change</span>
                <span 
                  className={
                    commodity.monthlyChange > 0 ? 'text-red-500 font-medium' : 
                    commodity.monthlyChange < 0 ? 'text-green-500 font-medium' : 
                    'text-yellow-500 font-medium'
                  }
                >
                  {commodity.monthlyChange > 0 && '+'}{commodity.monthlyChange != null ? Math.round(commodity.monthlyChange) : '-'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yearly Change</span>
                <span 
                  className={
                    commodity.yearlyChange > 0 ? 'text-red-500 font-medium' : 
                    commodity.yearlyChange < 0 ? 'text-green-500 font-medium' : 
                    'text-yellow-500 font-medium'
                  }
                >
                  {commodity.yearlyChange > 0 && '+'}{commodity.yearlyChange != null ? Math.round(commodity.yearlyChange) : '-'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">April 9, 2025</span>
              </div>
            </div>
            
            <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Regional Price Range</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Current price is calculated as the average of prices across all regions shown below.
                </p>
                {(() => {
                  const prices = commodity.regionalPrices.map(r => r.price);
                  const highest = Math.max(...prices);
                  const lowest = Math.min(...prices);
                  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                  
                  const highestRegion = commodity.regionalPrices.find(r => r.price === highest)?.region || '';
                  const lowestRegion = commodity.regionalPrices.find(r => r.price === lowest)?.region || '';
                  
                  return (
                    <>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-1/3">Highest</span>
                        <div className="w-2/3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{highestRegion}</span>
                            <span className="text-sm font-medium">৳{highest}/{commodity.unit}</span>
                          </div>
                          <div className="h-2 bg-red-500 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-1/3">Average</span>
                        <div className="w-2/3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">National</span>
                            <span className="text-sm font-medium">৳{Math.round(avgPrice)}/{commodity.unit}</span>
                          </div>
                          <div className="h-2 bg-yellow-500 rounded"></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground w-1/3">Lowest</span>
                        <div className="w-2/3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{lowestRegion}</span>
                            <span className="text-sm font-medium">৳{lowest}/{commodity.unit}</span>
                          </div>
                          <div className="h-2 bg-green-500 rounded"></div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Price History Tab */}
      {activeTab === 'history' && (
        <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Price History</h2>
            <div className="flex space-x-2">
              <select className="bg-background border border-border rounded-md p-2 text-sm">
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last 1 year</option>
                <option>Last 3 years</option>
              </select>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm">
                Apply
              </button>
            </div>
          </div>
          <div className="h-80 w-full bg-muted/30 flex items-center justify-center">
            <p className="text-muted-foreground">Price history chart will be displayed here</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Historical Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Change</th>
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
                        <td className="py-3 px-4">
                          {point.date}
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrencyPrice(point.price, '৳', commodity.unit)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div
                            className={cn(
                              'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold',
                              change > 0
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : change < 0
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            )}
                          >
                            {formatPriceChange(change, false)} ({formatPriceChange(changePercent, true, false)})
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Regional Prices Tab */}
      {activeTab === 'regional' && (
        <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Regional Price Comparison</h2>
            <div className="flex space-x-2">
              <select className="bg-background border border-border rounded-md p-2 text-sm">
                <option>Divisional</option>
                <option>District</option>
              </select>
            </div>
          </div>
          <div className="h-80 mb-6">
            <RegionalPriceMap 
              selectedCommodity={commodity.name}
              priceData={regionData}
            />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Regional Price Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Region</th>
                    <th className="text-right py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Difference from Avg.</th>
                  </tr>
                </thead>
                <tbody>
                  {commodity.regionalPrices.map((region) => {
                    const avgPrice = commodity.regionalPrices.reduce((sum, r) => sum + r.price, 0) / commodity.regionalPrices.length;
                    const difference = region.price - avgPrice;
                    
                    // Get region name
                    const regionName = region.region.charAt(0).toUpperCase() + region.region.slice(1);
                    
                    return (
                      <tr key={region.region} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{regionName}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrencyPrice(region.price, '৳', commodity.unit)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div
                            className={cn(
                              'flex items-center gap-0.5 text-xs font-medium',
                              difference > 0
                                ? 'text-red-500 dark:text-red-400'
                                : difference < 0
                                ? 'text-green-500 dark:text-green-400'
                                : 'text-yellow-500 dark:text-yellow-400'
                            )}
                          >
                            {formatPriceChange(difference)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 