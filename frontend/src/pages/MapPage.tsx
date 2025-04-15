import { FC, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RegionalPriceMap from '../components/maps/RegionalPriceMap';

const MapPage: FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Rice (Fine)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapView, setMapView] = useState<'division' | 'district'>('division');
  
  // Mock data - would come from API in real app
  const mockRegions = [
    { regionId: 'dhaka', price: 80 },
    { regionId: 'chittagong', price: 82 },
    { regionId: 'sylhet', price: 78 },
    { regionId: 'rajshahi', price: 76 },
    { regionId: 'khulna', price: 77 },
    { regionId: 'barisal', price: 79 },
    { regionId: 'rangpur', price: 75 },
    { regionId: 'mymensingh', price: 76 }
  ];
  
  const topCommodities = [
    { id: '1', name: 'Rice (Fine)', category: 'agriculture' },
    { id: '2', name: 'Rice (Medium)', category: 'agriculture' },
    { id: '3', name: 'Wheat', category: 'agriculture' },
    { id: '4', name: 'Onion', category: 'agriculture' },
    { id: '5', name: 'Soybean Oil', category: 'agriculture' },
    { id: '6', name: 'Potato', category: 'agriculture' },
    { id: '7', name: 'Steel', category: 'industrial' },
    { id: '8', name: 'Cement', category: 'industrial' }
  ];
  
  const filteredCommodities = topCommodities.filter(commodity => 
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSelectCommodity = useCallback((commodityName: string): void => {
    setSelectedCommodity(commodityName);
  }, []);

  const toggleMapView = useCallback((): void => {
    setMapView(prev => prev === 'division' ? 'district' : 'division');
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Regional Price Map</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Visualize commodity prices across different regions of Bangladesh. Compare prices by division or district.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with commodity selection */}
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
              
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
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
              <CardTitle>Map Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Map View</span>
                <Button 
                  onClick={toggleMapView} 
                  variant="outline" 
                  className="w-full justify-between"
                >
                  {mapView === 'division' ? 'Division View' : 'District View'}
                  <span className="material-icons text-sm">swap_horiz</span>
                </Button>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Data Display</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" className="w-full">Price</Button>
                  <Button variant="outline" size="sm" className="w-full">Change %</Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full">
                  <span className="material-icons text-sm mr-2">download</span>
                  Export Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main map area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Price Map: {selectedCommodity}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {mapView === 'division' ? 'Division View' : 'District View'} • Updated Today
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                <RegionalPriceMap 
                  selectedCommodity={selectedCommodity}
                  priceData={mockRegions}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-right py-3 px-4">Price (৳)</th>
                      <th className="text-right py-3 px-4">vs. National Avg</th>
                      <th className="text-right py-3 px-4">Weekly Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRegions.map(region => {
                      const avgPrice = mockRegions.reduce((sum, r) => sum + r.price, 0) / mockRegions.length;
                      const difference = region.price - avgPrice;
                      const differencePercent = (difference / avgPrice) * 100;
                      
                      // Mock weekly change
                      const weeklyChange = Math.random() * 6 - 3;
                      
                      // Get region name
                      const regionName = region.regionId.charAt(0).toUpperCase() + region.regionId.slice(1);
                      
                      return (
                        <tr key={region.regionId} className="border-b border-border hover:bg-muted/30">
                          <td className="py-3 px-4">{regionName}</td>
                          <td className="text-right py-3 px-4">{region.price}</td>
                          <td className="text-right py-3 px-4">
                            <span 
                              className={
                                difference > 0 ? 'text-red-500' : 
                                difference < 0 ? 'text-green-500' : 
                                'text-yellow-500'
                              }
                            >
                              {difference > 0 && '+'}{Math.round(differencePercent)}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span 
                              className={
                                weeklyChange > 0 ? 'text-red-500' : 
                                weeklyChange < 0 ? 'text-green-500' : 
                                'text-yellow-500'
                              }
                            >
                              {weeklyChange > 0 && '+'}{Math.round(weeklyChange)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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

export default MapPage; 