import { FC, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SupplyChainPage: FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Rice');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'network' | 'flow' | 'timeline'>('network');
  const [contentSection, setContentSection] = useState<'stages' | 'stakeholders' | 'pricing'>('stages');

  // Mock data - would come from API in real app
  const supplyChainStages = [
    { id: 'production', name: 'Production', location: 'Various districts', stakeholders: 12, averagePrice: 45 },
    { id: 'processing', name: 'Processing', location: 'Industrial zones', stakeholders: 8, averagePrice: 58 },
    { id: 'distribution', name: 'Distribution', location: 'Major cities', stakeholders: 24, averagePrice: 67 },
    { id: 'retail', name: 'Retail', location: 'Nationwide', stakeholders: 150, averagePrice: 80 }
  ];

  const commodities = [
    { id: '1', name: 'Rice', category: 'agriculture' },
    { id: '2', name: 'Wheat', category: 'agriculture' },
    { id: '3', name: 'Tea', category: 'agriculture' },
    { id: '4', name: 'Jute', category: 'agriculture' },
    { id: '5', name: 'Garments', category: 'industrial' },
    { id: '6', name: 'Pharmaceuticals', category: 'industrial' }
  ];

  const supplyChainRisks = [
    { id: '1', name: 'Weather disruptions', severity: 'High', impact: 'Production delays', probability: '40%' },
    { id: '2', name: 'Transportation bottlenecks', severity: 'Medium', impact: 'Increased costs', probability: '35%' },
    { id: '3', name: 'Price volatility', severity: 'High', impact: 'Market instability', probability: '55%' },
    { id: '4', name: 'Storage limitations', severity: 'Medium', impact: 'Quality degradation', probability: '30%' }
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

  // Placeholder for the actual visualization component
  const SupplyChainVisualization = () => (
    <div className="bg-muted h-[400px] rounded-md flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Supply Chain Visualization for {selectedCommodity}</p>
        <p className="text-sm text-muted-foreground">
          (Placeholder for actual visualization component)
        </p>
        <div className="mt-6 flex justify-center space-x-6">
          {supplyChainStages.map((stage, index) => (
            <div key={stage.id} className="relative flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">{index + 1}</span>
              </div>
              <div className="mt-2 text-sm font-medium">{stage.name}</div>
              {index < supplyChainStages.length - 1 && (
                <div className="absolute top-8 left-full w-12 h-0.5 bg-border" style={{ transform: 'translateX(-50%)' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Supply Chain Analysis</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Track and analyze the complete supply chain of commodities from production to retail across Bangladesh.
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
              <CardTitle>Supply Chain Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplyChainRisks.map(risk => (
                  <div key={risk.id} className="border border-border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{risk.name}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        risk.severity === 'High' ? 'bg-red-100 text-red-800' : 
                        risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {risk.severity}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Impact: {risk.impact}</div>
                    <div className="text-sm text-muted-foreground">Probability: {risk.probability}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Supply Chain: {selectedCommodity}</CardTitle>
              <Select defaultValue={viewMode} onValueChange={(val: 'network' | 'flow' | 'timeline') => setViewMode(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="network">Network View</SelectItem>
                  <SelectItem value="flow">Flow View</SelectItem>
                  <SelectItem value="timeline">Timeline View</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <SupplyChainVisualization />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Details</CardTitle>
              <Select 
                defaultValue={contentSection} 
                onValueChange={(val: 'stages' | 'stakeholders' | 'pricing') => setContentSection(val)}
              >
                <SelectTrigger className="w-[180px] mt-2">
                  <SelectValue placeholder="View Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stages">Stages</SelectItem>
                  <SelectItem value="stakeholders">Stakeholders</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {contentSection === 'stages' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Stage</th>
                        <th className="text-left py-3 px-4">Primary Location</th>
                        <th className="text-right py-3 px-4">Stakeholders</th>
                        <th className="text-right py-3 px-4">Avg. Price (৳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyChainStages.map(stage => (
                        <tr key={stage.id} className="border-b border-border hover:bg-muted/30">
                          <td className="py-3 px-4">{stage.name}</td>
                          <td className="py-3 px-4">{stage.location}</td>
                          <td className="text-right py-3 px-4">{stage.stakeholders}</td>
                          <td className="text-right py-3 px-4">{stage.averagePrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainPage; 