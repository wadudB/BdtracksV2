// Main PV Calculator Component

import { usePVCalculator } from '@/contexts/pv-calculator-context';
import { LocationSelector } from './LocationSelector';
import { EnergyAnalysis } from './EnergyAnalysis';
import { ResultsDisplay } from './ResultsDisplay';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Location', description: 'Select your location' },
  { id: 1, title: 'Energy Analysis', description: 'Analyze consumption' },
  { id: 2, title: 'Calculation', description: 'System calculation' },
  { id: 3, title: 'Results', description: 'View your design' }
];

export function PVCalculator() {
  const { state } = usePVCalculator();
  const { currentStep, isCalculating, errors } = state;

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const renderCurrentStep = () => {
    if (isCalculating) {
      return (
        <Card className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold mb-2">Calculating Your Solar System</h3>
          <p className="text-gray-600">
            We're analyzing your location, consumption, and designing the optimal solar solution...
          </p>
        </Card>
      );
    }

    switch (currentStep) {
      case 0:
        return <LocationSelector />;
      case 1:
        return <EnergyAnalysis />;
      case 3:
        return <ResultsDisplay />;
      default:
        return (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Step not implemented yet</p>
          </Card>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Progress Indicator */}
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            Photovoltaic System Design Calculator
          </h1>
          <p className="text-gray-600 text-center">
            Design your custom solar energy system for Bangladesh
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={(currentStep / 3) * 100} className="w-full" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const isLast = index === STEPS.length - 1;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${status === 'completed' 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : status === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                    }
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      status === 'current' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                
                {!isLast && (
                  <div className={`
                    flex-1 h-0.5 mx-4 
                    ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="text-red-800">
            <h4 className="font-semibold mb-2">Please fix the following errors:</h4>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">• {error}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Current Step Content */}
      <div className="min-h-[600px]">
        {renderCurrentStep()}
      </div>

      {/* Footer Information */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="text-center text-blue-800 text-sm">
          <p className="font-medium mb-1">
            🌟 Professional Solar System Design for Bangladesh
          </p>
          <p>
            This calculator uses real Bangladesh solar irradiance data and local electricity rates 
            to provide accurate system sizing and financial analysis.
          </p>
        </div>
      </Card>
    </div>
  );
} 