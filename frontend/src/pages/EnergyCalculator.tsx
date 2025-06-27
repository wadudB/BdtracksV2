import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';

interface Appliance {
  id: string;
  name: string;
  category: string;
  power: number; // Watts
  typical_usage: number; // Hours per day
  efficiency_rating?: 'High' | 'Medium' | 'Low';
  icon?: string;
}

interface CalculatorAppliance extends Appliance {
  quantity: number;
  daily_hours: number;
  monthly_cost: number;
  yearly_cost: number;
}

// Bangladesh Electricity Rates (Updated March 2024)
const ELECTRICITY_RATES = [
  { min: 0, max: 75, rate: 5.26 },
  { min: 76, max: 200, rate: 7.20 },
  { min: 201, max: 300, rate: 7.59 },
  { min: 301, max: 400, rate: 8.02 },
  { min: 401, max: 600, rate: 12.67 },
  { min: 601, max: Infinity, rate: 14.61 }
];

// Life Line Rate for 0-50 units (lower income households)
const LIFE_LINE_RATE = { min: 0, max: 50, rate: 4.63 };

const ADDITIONAL_CHARGES = {
  demand_charge: 42,
  vat_rate: 0.05,
  meter_rent: 40,
  rebate_rate: 0.005
};

// Enhanced appliances database with icons
const APPLIANCES_DATABASE: Appliance[] = [
  // Cooling
  { id: 'ac_1_ton', name: '1 Ton AC (Regular)', category: 'Cooling', power: 1500, typical_usage: 8, icon: 'ac_unit' },
  { id: 'ac_1_ton_inverter', name: '1 Ton AC (Inverter)', category: 'Cooling', power: 900, typical_usage: 8, efficiency_rating: 'High', icon: 'ac_unit' },
  { id: 'ac_1_5_ton', name: '1.5 Ton AC (Regular)', category: 'Cooling', power: 2000, typical_usage: 8, icon: 'ac_unit' },
  { id: 'ac_1_5_ton_inverter', name: '1.5 Ton AC (Inverter)', category: 'Cooling', power: 1200, typical_usage: 8, efficiency_rating: 'High', icon: 'ac_unit' },
  { id: 'ceiling_fan', name: 'Ceiling Fan (Regular)', category: 'Cooling', power: 75, typical_usage: 12, icon: 'toys' },
  { id: 'ceiling_fan_bldc', name: 'Ceiling Fan (BLDC)', category: 'Cooling', power: 28, typical_usage: 12, efficiency_rating: 'High', icon: 'toys' },
  
  // Lighting
  { id: 'led_bulb_9w', name: 'LED Bulb 9W', category: 'Lighting', power: 9, typical_usage: 6, efficiency_rating: 'High', icon: 'lightbulb' },
  { id: 'cfl_20w', name: 'CFL 20W', category: 'Lighting', power: 20, typical_usage: 6, efficiency_rating: 'Medium', icon: 'lightbulb' },
  { id: 'tube_light_40w', name: 'Tube Light 40W', category: 'Lighting', power: 40, typical_usage: 6, icon: 'lightbulb' },
  
  // Kitchen
  { id: 'refrigerator_single', name: 'Refrigerator (Single Door)', category: 'Kitchen', power: 150, typical_usage: 24, icon: 'kitchen' },
  { id: 'refrigerator_double', name: 'Refrigerator (Double Door)', category: 'Kitchen', power: 250, typical_usage: 24, icon: 'kitchen' },
  { id: 'microwave', name: 'Microwave Oven', category: 'Kitchen', power: 1200, typical_usage: 1, icon: 'microwave' },
  { id: 'rice_cooker', name: 'Rice Cooker', category: 'Kitchen', power: 700, typical_usage: 2, icon: 'rice_bowl' },
  
  // Entertainment
  { id: 'tv_32_led', name: '32" LED TV', category: 'Entertainment', power: 60, typical_usage: 6, icon: 'tv' },
  { id: 'tv_43_led', name: '43" LED TV', category: 'Entertainment', power: 100, typical_usage: 6, icon: 'tv' },
  { id: 'computer_desktop', name: 'Desktop Computer', category: 'Electronics', power: 250, typical_usage: 8, icon: 'computer' },
  { id: 'laptop', name: 'Laptop', category: 'Electronics', power: 65, typical_usage: 8, efficiency_rating: 'High', icon: 'laptop' },
  
  // Others
  { id: 'washing_machine', name: 'Washing Machine', category: 'Laundry', power: 500, typical_usage: 2, icon: 'local_laundry_service' },
  { id: 'iron', name: 'Electric Iron', category: 'Laundry', power: 1000, typical_usage: 1, icon: 'iron' },
  { id: 'water_heater', name: 'Electric Water Heater', category: 'Water Heating', power: 2000, typical_usage: 2, icon: 'hot_tub' },
];

const EnergyCalculator: React.FC = () => {
  const [selectedAppliances, setSelectedAppliances] = useState<CalculatorAppliance[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    power: '',
    hours: '',
    quantity: '1'
  });
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate electricity cost based on Bangladesh's tiered system
  const calculateElectricityCost = useCallback((units: number) => {
    let totalCost = 0;
    let remainingUnits = units;

    // Check if eligible for Life Line rate (0-50 units only)
    if (units <= LIFE_LINE_RATE.max) {
      return units * LIFE_LINE_RATE.rate;
    }

    // Regular tiered calculation for usage above 50 units
    for (const tier of ELECTRICITY_RATES) {
      if (remainingUnits <= 0) break;
      
      const tierMin = tier.min;
      const tierMax = tier.max === Infinity ? tier.max : tier.max;
      const unitsInThisTier = Math.min(remainingUnits, tierMax - tierMin + 1);
      
      totalCost += unitsInThisTier * tier.rate;
      remainingUnits -= unitsInThisTier;
    }

    return totalCost;
  }, []);

  // Calculate total monthly consumption and cost
  const calculations = useMemo(() => {
    const monthlyConsumption = selectedAppliances.reduce((total, appliance) => {
      return total + (appliance.power * appliance.daily_hours * appliance.quantity * 30) / 1000;
    }, 0);

    const energyCost = calculateElectricityCost(monthlyConsumption);
    const vatAmount = energyCost * ADDITIONAL_CHARGES.vat_rate;
    const rebateAmount = energyCost * ADDITIONAL_CHARGES.rebate_rate;
    
    const totalMonthlyCost = energyCost + ADDITIONAL_CHARGES.demand_charge + ADDITIONAL_CHARGES.meter_rent + vatAmount - rebateAmount;
    const yearlyConsumption = monthlyConsumption * 12;
    const totalYearlyCost = totalMonthlyCost * 12;

    return {
      monthlyConsumption: monthlyConsumption.toFixed(2),
      yearlyConsumption: yearlyConsumption.toFixed(2),
      energyCost: energyCost.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      rebateAmount: rebateAmount.toFixed(2),
      totalMonthlyCost: totalMonthlyCost.toFixed(2),
      totalYearlyCost: totalYearlyCost.toFixed(2)
    };
  }, [selectedAppliances, calculateElectricityCost]);

  // Add appliance to calculator
  const addAppliance = useCallback((appliance: Appliance, quantity: number = 1, hours: number = appliance.typical_usage) => {
    const dailyConsumption = (appliance.power * hours * quantity) / 1000;
    const monthlyConsumption = dailyConsumption * 30;
    const monthlyCost = calculateElectricityCost(monthlyConsumption);
    
    const calculatorAppliance: CalculatorAppliance = {
      ...appliance,
      quantity,
      daily_hours: hours,
      monthly_cost: monthlyCost,
      yearly_cost: monthlyCost * 12
    };

    setSelectedAppliances(prev => [...prev, calculatorAppliance]);
  }, [calculateElectricityCost]);

  // Remove appliance from calculator
  const removeAppliance = useCallback((index: number) => {
    setSelectedAppliances(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update appliance usage
  const updateAppliance = useCallback((index: number, field: keyof CalculatorAppliance, value: number) => {
    setSelectedAppliances(prev => prev.map((appliance, i) => {
      if (i !== index) return appliance;
      
      const updated = { ...appliance, [field]: value };
      const dailyConsumption = (updated.power * updated.daily_hours * updated.quantity) / 1000;
      const monthlyConsumption = dailyConsumption * 30;
      updated.monthly_cost = calculateElectricityCost(monthlyConsumption);
      updated.yearly_cost = updated.monthly_cost * 12;
      
      return updated;
    }));
  }, [calculateElectricityCost]);

  // Add custom appliance
  const addCustomAppliance = useCallback(() => {
    if (customAppliance.name && customAppliance.power && customAppliance.hours) {
      const appliance: Appliance = {
        id: `custom_${Date.now()}`,
        name: customAppliance.name,
        category: 'Custom',
        power: parseInt(customAppliance.power),
        typical_usage: parseFloat(customAppliance.hours),
        icon: 'devices_other'
      };
      
      addAppliance(appliance, parseInt(customAppliance.quantity), parseFloat(customAppliance.hours));
      setCustomAppliance({ name: '', power: '', hours: '', quantity: '1' });
    }
  }, [customAppliance, addAppliance]);

  // Filter appliances by category
  const filteredAppliances = useMemo(() => {
    return selectedCategory === 'all' 
      ? APPLIANCES_DATABASE 
      : APPLIANCES_DATABASE.filter(app => app.category === selectedCategory);
  }, [selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(APPLIANCES_DATABASE.map(app => app.category))];
    return ['all', ...cats];
  }, []);

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="text-center mb-6">
          <Heading size="lg" className="mb-1">
            Energy Cost Calculator
          </Heading>
          <p className="text-muted-foreground max-w-full mx-auto text-sm">
            Calculate your monthly electricity consumption and costs based on Bangladesh's latest electricity rates.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Column - Add Appliances */}
          <div className="flex flex-col h-full">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Add Your Appliances</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Tabs defaultValue="predefined" className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="predefined">Choose from Database</TabsTrigger>
                    <TabsTrigger value="custom">Add Custom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="predefined" className="flex-1 flex flex-col space-y-3">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-1">
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category === 'all' ? 'All' : category}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Appliances List */}
                    <div className="flex-1 overflow-y-auto pr-1">
                      <div className="grid grid-cols-1 gap-2">
                        {filteredAppliances.map(appliance => (
                          <div 
                            key={appliance.id}
                            className="p-2 border rounded hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-icons text-muted-foreground text-base">{appliance.icon || 'devices'}</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-xs truncate">{appliance.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {appliance.power}W • {appliance.typical_usage}h
                                </p>
                              </div>
                              {appliance.efficiency_rating && (
                                <Badge 
                                  variant={appliance.efficiency_rating === 'High' ? 'default' : 'secondary'} 
                                  className="text-xs h-4 px-1"
                                >
                                  {appliance.efficiency_rating}
                                </Badge>
                              )}
                            </div>
                            <Button 
                              onClick={() => addAppliance(appliance)}
                              className="w-full h-7"
                              size="sm"
                            >
                              <span className="material-icons text-xs mr-1">add</span>
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom" className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input 
                          placeholder="Smart TV"
                          value={customAppliance.name}
                          onChange={(e) => setCustomAppliance(prev => ({ ...prev, name: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Power (W)</Label>
                        <Input 
                          type="number"
                          placeholder="150"
                          value={customAppliance.power}
                          onChange={(e) => setCustomAppliance(prev => ({ ...prev, power: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Hours/Day</Label>
                        <Input 
                          type="number"
                          step="0.5"
                          placeholder="6"
                          value={customAppliance.hours}
                          onChange={(e) => setCustomAppliance(prev => ({ ...prev, hours: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input 
                          type="number"
                          min="1"
                          value={customAppliance.quantity}
                          onChange={(e) => setCustomAppliance(prev => ({ ...prev, quantity: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={addCustomAppliance}
                      disabled={!customAppliance.name || !customAppliance.power || !customAppliance.hours}
                      className="w-full h-8"
                      size="sm"
                    >
                      Add Custom Appliance
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cost Summary & Selected Appliances */}
          <div className="flex flex-col h-full space-y-4">
            {/* Cost Summary */}
            <Card className="shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Monthly Bill</p>
                    <p className="text-2xl font-bold text-primary">৳{calculations.totalMonthlyCost}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 bg-muted/30 rounded text-xs">
                      <p className="text-muted-foreground">Monthly kWh</p>
                      <p className="font-semibold">{calculations.monthlyConsumption}</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded text-xs">
                      <p className="text-muted-foreground">Yearly Cost</p>
                      <p className="font-semibold">৳{calculations.totalYearlyCost}</p>
                    </div>
                  </div>
                  
                  {selectedAppliances.length > 0 && (
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="w-full h-7 text-xs"
                      >
                        {showBreakdown ? 'Hide' : 'Show'} Breakdown
                      </Button>
                      
                      {showBreakdown && (
                        <div className="mt-3 p-2 bg-muted rounded text-left">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Energy Cost:</span>
                              <span>৳{calculations.energyCost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Demand:</span>
                              <span>৳{ADDITIONAL_CHARGES.demand_charge}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Meter:</span>
                              <span>৳{ADDITIONAL_CHARGES.meter_rent}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>VAT:</span>
                              <span>৳{calculations.vatAmount}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>Rebate:</span>
                              <span>-৳{calculations.rebateAmount}</span>
                            </div>
                            <hr className="my-1" />
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>৳{calculations.totalMonthlyCost}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Appliances */}
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-3 shrink-0">
                <CardTitle className="text-lg">Your Appliances ({selectedAppliances.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                {selectedAppliances.length > 0 ? (
                  <div className="h-full overflow-y-auto pr-1">
                    <div className="space-y-2">
                      {selectedAppliances.map((appliance, index) => (
                        <div key={`${appliance.id}-${index}`} className="p-2 border rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-icons text-muted-foreground text-sm">{appliance.icon || 'devices'}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-xs truncate">{appliance.name}</h4>
                              <p className="text-xs text-muted-foreground">{appliance.power}W</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-primary">৳{appliance.monthly_cost.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">per month</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeAppliance(index)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Qty</Label>
                              <Input 
                                type="number"
                                min="1"
                                value={appliance.quantity}
                                onChange={(e) => updateAppliance(index, 'quantity', parseInt(e.target.value) || 1)}
                                className="h-6 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Hours</Label>
                              <Input 
                                type="number"
                                step="0.5"
                                min="0"
                                max="24"
                                value={appliance.daily_hours}
                                onChange={(e) => updateAppliance(index, 'daily_hours', parseFloat(e.target.value) || 0)}
                                className="h-6 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-icons text-muted-foreground text-2xl mb-2 block">devices</span>
                      <p className="text-muted-foreground text-xs mb-1">No appliances added</p>
                      <p className="text-xs text-muted-foreground">Select from left to start</p>
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
};

export default EnergyCalculator; 