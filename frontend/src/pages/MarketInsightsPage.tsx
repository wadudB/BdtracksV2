import { FC, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketInsightsPage: FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Rice');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '6m' | '1y'>('1m');

  // Mock data - would come from API in real app
  const commodities = [
    { id: '1', name: 'Rice', category: 'agriculture' },
    { id: '2', name: 'Wheat', category: 'agriculture' },
    { id: '3', name: 'Tea', category: 'agriculture' },
    { id: '4', name: 'Jute', category: 'agriculture' },
    { id: '5', name: 'Garments', category: 'industrial' },
    { id: '6', name: 'Pharmaceuticals', category: 'industrial' }
  ];

  const marketTrends = [
    { id: '1', title: 'Rising Production Costs', impact: 'High', description: 'Increased fertilizer and fuel prices affecting agriculture' },
    { id: '2', title: 'Seasonal Demand Shift', impact: 'Medium', description: 'Post-harvest demand patterns changing compared to previous years' },
    { id: '3', title: 'Export Opportunities', impact: 'High', description: 'New trade agreements opening markets for local producers' },
    { id: '4', title: 'Weather Patterns', impact: 'Medium', description: 'Unexpected rainfall affecting crop yields in northern regions' }
  ];

  const priceForecasts = [
    { period: 'Next Week', direction: 'up', percent: 3, confidence: 'high' },
    { period: 'Next Month', direction: 'up', percent: 4, confidence: 'medium' },
    { period: 'Next Quarter', direction: 'down', percent: 1, confidence: 'low' }
  ];

  const keyMetrics = [
    { name: 'Production Volume', value: '4.5M tons', change: '+3%' },
    { name: 'Avg. Market Price', value: '৳75/kg', change: '+5%' },
    { name: 'Export Volume', value: '1.2M tons', change: '+13%' },
    { name: 'Price Volatility', value: 'Medium', change: '-2%' }
  ];

  const filteredCommodities = commodities.filter(commodity => 
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSelectCommodity = useCallback((commodityName: string): void => {
    setSelectedCommodity(commodityName);
  }, []);

  // Placeholder for the actual chart component
  const PriceTrendChart = () => (
    <div className="bg-muted h-[300px] rounded-md flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Price Trend for {selectedCommodity} ({timeRange})</p>
        <p className="text-sm text-muted-foreground">
          (Placeholder for actual chart component)
        </p>
        <div className="mt-6 flex justify-between w-full max-w-md mx-auto">
          <div className="text-center">
            <div className="text-xl font-bold">৳75</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-green-500">+5%</div>
            <div className="text-xs text-muted-foreground">Change</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">৳78</div>
            <div className="text-xs text-muted-foreground">Forecast</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Market Insights</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Analyze market trends, price forecasts, and key insights for commodities across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Commodity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <span className="material-icons text-sm">search</span>
                </div>
                <Input
                  type="text"
                  placeholder="Search commodities..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {filteredCommodities.map(commodity => (
                  <button
                    key={commodity.id}
                    onClick={() => handleSelectCommodity(commodity.name)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                      selectedCommodity === commodity.name
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{commodity.name}</span>
                      <span className="text-xs uppercase opacity-70">{commodity.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map(trend => (
                  <div key={trend.id} className="border border-border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{trend.title}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        trend.impact === 'High' ? 'bg-red-100 text-red-800' : 
                        trend.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {trend.impact} Impact
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{trend.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyMetrics.map((metric, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-2">{metric.name}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`text-sm ${
                      metric.change.startsWith('+') ? 'text-green-500' : 
                      metric.change.startsWith('-') ? 'text-red-500' : 
                      'text-yellow-500'
                    }`}>
                      {metric.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Price trend chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Price Trend: {selectedCommodity}</CardTitle>
              <Select defaultValue={timeRange} onValueChange={(val: '1w' | '1m' | '3m' | '6m' | '1y') => setTimeRange(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">1 Week</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <PriceTrendChart />
            </CardContent>
          </Card>
          
          {/* Price forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Price Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {priceForecasts.map((forecast, idx) => (
                    <div key={idx} className="border border-border rounded-md p-4">
                      <div className="text-sm text-muted-foreground mb-2">{forecast.period}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold flex items-center">
                          <span className={`material-icons mr-1 ${
                            forecast.direction === 'up' ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {forecast.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                          {forecast.percent}%
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          forecast.confidence === 'high' ? 'bg-green-100 text-green-800' : 
                          forecast.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {forecast.confidence} confidence
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {forecast.direction === 'up' 
                          ? 'Prices expected to increase due to seasonal demand.'
                          : 'Prices expected to decrease as new supply enters the market.'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on historical data and current market conditions, we project that {selectedCommodity} 
                    prices will remain volatile in the short term but stabilize by Q3 2023.
                  </p>
                  
                  <h4 className="font-medium text-sm mb-2">Factors Influencing Price</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Seasonal production cycles affecting supply volume</li>
                    <li>Import regulations and tariff changes</li>
                    <li>Increasing production costs due to input price inflation</li>
                    <li>Changes in consumer demand patterns post-pandemic</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Market comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Market Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Market</th>
                      <th className="text-right py-3 px-4">Price (৳)</th>
                      <th className="text-right py-3 px-4">Spread</th>
                      <th className="text-right py-3 px-4">Volume</th>
                      <th className="text-right py-3 px-4">Change (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">Dhaka Central Market</td>
                      <td className="text-right py-3 px-4">75</td>
                      <td className="text-right py-3 px-4">±1</td>
                      <td className="text-right py-3 px-4">145 tons</td>
                      <td className="text-right py-3 px-4 text-green-500">+1%</td>
                    </tr>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">Chittagong Port Market</td>
                      <td className="text-right py-3 px-4">76</td>
                      <td className="text-right py-3 px-4">±1</td>
                      <td className="text-right py-3 px-4">95 tons</td>
                      <td className="text-right py-3 px-4 text-green-500">+1%</td>
                    </tr>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">Rajshahi Wholesale</td>
                      <td className="text-right py-3 px-4">74</td>
                      <td className="text-right py-3 px-4">±1</td>
                      <td className="text-right py-3 px-4">110 tons</td>
                      <td className="text-right py-3 px-4 text-red-500">-1%</td>
                    </tr>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">Khulna Regional</td>
                      <td className="text-right py-3 px-4">75</td>
                      <td className="text-right py-3 px-4">±1</td>
                      <td className="text-right py-3 px-4">85 tons</td>
                      <td className="text-right py-3 px-4 text-green-500">+0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketInsightsPage; 