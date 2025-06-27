// Energy Analysis Component

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnergyConsumption } from '@/types/pv-calculator';
import { usePVCalculator } from '@/contexts/pv-calculator-context';

export function EnergyAnalysis() {
  const { updateConsumption, calculateSystem, previousStep } = usePVCalculator();
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [consumerCategory, setConsumerCategory] = useState<'residential' | 'commercial' | 'industrial'>('residential');

  const calculateUnitsFromBill = (billAmount: number): number => {
    // Simplified calculation for residential category
    if (billAmount <= 394.5) return billAmount / 5.26; // First tier
    if (billAmount <= 1834.5) return 75 + (billAmount - 394.5) / 7.20; // Second tier
    // Add more tiers as needed
    return Math.round(billAmount / 8); // Simplified average
  };

  const handleContinue = () => {
    const bill = parseFloat(monthlyBill);
    if (bill > 0) {
      const consumption: EnergyConsumption = {
        monthlyBill: bill,
        monthlyUnits: calculateUnitsFromBill(bill),
        appliances: [],
        usagePattern: consumerCategory,
        consumerCategory
      };
      updateConsumption(consumption);
      // Trigger automatic calculation
      setTimeout(() => {
        calculateSystem();
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Energy Consumption Analysis</h2>
        <p className="text-gray-600">
          Help us understand your electricity usage to design the optimal solar system
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Label htmlFor="category" className="text-lg font-semibold">Consumer Category</Label>
          <Select value={consumerCategory} onValueChange={(value: typeof consumerCategory) => setConsumerCategory(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <Label htmlFor="bill" className="text-lg font-semibold">Monthly Electricity Bill (BDT)</Label>
          </div>
          <Input
            id="bill"
            type="number"
            placeholder="Enter your average monthly bill"
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(e.target.value)}
          />
          {monthlyBill && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                <span className="font-semibold">Estimated consumption:</span> {' '}
                {calculateUnitsFromBill(parseFloat(monthlyBill))} kWh/month
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button onClick={previousStep} variant="outline">
          Back to Location
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!monthlyBill || parseFloat(monthlyBill) <= 0}
        >
          Continue to System Design
        </Button>
      </div>
    </div>
  );
} 