// Results Display Component

import { Sun, DollarSign, Zap, Leaf, BarChart3, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePVCalculator } from '@/contexts/pv-calculator-context';

export function ResultsDisplay() {
  const { state, resetCalculator, previousStep } = usePVCalculator();
  const { results } = state;

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No calculation results available</p>
        <Button onClick={resetCalculator} className="mt-4">
          Start New Calculation
        </Button>
      </div>
    );
  }

  const { systemConfig, financial, performance, recommendations, warnings } = results;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Solar System Design</h2>
        <p className="text-gray-600">
          Here's your customized solar solution for {results.location.district}, {results.location.division}
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">System Size</h3>
          <p className="text-2xl font-bold text-blue-600">{systemConfig.systemSizeKW.toFixed(1)} kW</p>
          <p className="text-sm text-gray-500">{systemConfig.panelCount} panels</p>
        </Card>

        <Card className="p-6 text-center">
          <Zap className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">Monthly Generation</h3>
          <p className="text-2xl font-bold text-green-600">
            {performance.monthlyGeneration[0].generation} kWh
          </p>
          <p className="text-sm text-gray-500">Average per month</p>
        </Card>

        <Card className="p-6 text-center">
          <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">Monthly Savings</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(financial.monthlySavings)}
          </p>
          <p className="text-sm text-gray-500">On electricity bills</p>
        </Card>

        <Card className="p-6 text-center">
          <Leaf className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">CO₂ Saved</h3>
          <p className="text-2xl font-bold text-emerald-600">{performance.co2Reduction} kg</p>
          <p className="text-sm text-gray-500">Per year</p>
        </Card>
      </div>

      {/* Financial Analysis */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold">Financial Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-600">Total Investment</Label>
            <p className="text-lg font-bold">{formatCurrency(financial.totalInvestment)}</p>
            <div className="mt-1 text-xs text-gray-500">
              <p>Equipment: {formatCurrency(financial.equipmentCost)}</p>
              <p>Installation: {formatCurrency(financial.installationCost)}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Payback Period</Label>
            <p className="text-lg font-bold">{financial.paybackPeriod.toFixed(1)} years</p>
            <p className="text-xs text-gray-500">Break-even time</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">25-Year ROI</Label>
            <p className="text-lg font-bold">{financial.roi.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Return on investment</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Net Present Value</Label>
            <p className="text-lg font-bold">{formatCurrency(financial.npv)}</p>
            <p className="text-xs text-gray-500">At 5% discount rate</p>
          </div>
        </div>
      </Card>

      {/* System Specifications */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">System Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Solar Panels</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Model:</span> {systemConfig.panelType.model}</p>
              <p><span className="font-medium">Manufacturer:</span> {systemConfig.panelType.manufacturer}</p>
              <p><span className="font-medium">Power:</span> {systemConfig.panelType.power}W each</p>
              <p><span className="font-medium">Efficiency:</span> {systemConfig.panelType.efficiency}%</p>
              <p><span className="font-medium">Quantity:</span> {systemConfig.panelCount} panels</p>
              <p><span className="font-medium">Warranty:</span> {systemConfig.panelType.warranty} years</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Inverter</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Model:</span> {systemConfig.inverterType.model}</p>
              <p><span className="font-medium">Manufacturer:</span> {systemConfig.inverterType.manufacturer}</p>
              <p><span className="font-medium">Power:</span> {systemConfig.inverterType.power}W</p>
              <p><span className="font-medium">Efficiency:</span> {systemConfig.inverterType.efficiency}%</p>
              <p><span className="font-medium">Type:</span> {systemConfig.inverterType.type}</p>
              <p><span className="font-medium">Warranty:</span> {systemConfig.inverterType.warranty} years</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3">Installation Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span>
              <p className="capitalize">{systemConfig.installationType}</p>
            </div>
            <div>
              <span className="font-medium">Tilt Angle:</span>
              <p>{systemConfig.tiltAngle}°</p>
            </div>
            <div>
              <span className="font-medium">Azimuth:</span>
              <p>{systemConfig.azimuthAngle}° (South)</p>
            </div>
            <div>
              <span className="font-medium">Configuration:</span>
              <p>{systemConfig.stringConfiguration}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations and Warnings */}
      {(recommendations.length > 0 || warnings.length > 0) && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recommendations</h3>
          
          {recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-green-800 mb-2">✓ Recommendations</h4>
              <ul className="space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                    <span>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {warnings.length > 0 && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">⚠ Considerations</h4>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                    <span>•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={previousStep} variant="outline">
          Back to System Design
        </Button>
        <Button onClick={() => window.print()} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <Button onClick={resetCalculator}>
          Start New Calculation
        </Button>
      </div>
    </div>
  );
}

// Helper component for labels
function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
} 