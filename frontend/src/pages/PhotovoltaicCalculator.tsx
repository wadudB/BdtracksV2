// Photovoltaic System Design Calculator Page

import { PVCalculatorProvider } from '@/contexts/pv-calculator-context';
import { PVCalculator } from '@/components/pv-calculator/PVCalculator';

export default function PhotovoltaicCalculator() {
  return (
    <PVCalculatorProvider>
      <div className="min-h-screen bg-gray-50">
        <PVCalculator />
      </div>
    </PVCalculatorProvider>
  );
} 