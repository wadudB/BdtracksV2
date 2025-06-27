// PV Calculator Context

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  PVCalculatorState, 
  PVCalculatorContextType, 
  LocationData, 
  EnergyConsumption, 
  SystemConfiguration, 
  CalculationResults 
} from '@/types/pv-calculator';
import { SolarCalculator } from '@/utils/solar-calculations';

// Initial state
const initialState: PVCalculatorState = {
  currentStep: 0,
  location: null,
  consumption: null,
  systemConfig: null,
  results: null,
  isCalculating: false,
  errors: []
};

// Action types
type PVCalculatorAction =
  | { type: 'SET_LOCATION'; payload: LocationData }
  | { type: 'SET_CONSUMPTION'; payload: EnergyConsumption }
  | { type: 'SET_SYSTEM_CONFIG'; payload: SystemConfiguration }
  | { type: 'SET_RESULTS'; payload: CalculationResults }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: string[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET' };

// Reducer
function pvCalculatorReducer(state: PVCalculatorState, action: PVCalculatorAction): PVCalculatorState {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload, errors: [] };
    case 'SET_CONSUMPTION':
      return { ...state, consumption: action.payload, errors: [] };
    case 'SET_SYSTEM_CONFIG':
      return { ...state, systemConfig: action.payload, errors: [] };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, errors: [] };
    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) };
    case 'PREVIOUS_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Create context
const PVCalculatorContext = createContext<PVCalculatorContextType | undefined>(undefined);

// Provider component
interface PVCalculatorProviderProps {
  children: ReactNode;
}

export function PVCalculatorProvider({ children }: PVCalculatorProviderProps) {
  const [state, dispatch] = useReducer(pvCalculatorReducer, initialState);

  const updateLocation = (location: LocationData) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
  };

  const updateConsumption = (consumption: EnergyConsumption) => {
    dispatch({ type: 'SET_CONSUMPTION', payload: consumption });
  };

  const updateSystemConfig = (config: SystemConfiguration) => {
    dispatch({ type: 'SET_SYSTEM_CONFIG', payload: config });
  };

  const calculateSystem = async () => {
    if (!state.location || !state.consumption) {
      dispatch({ type: 'SET_ERRORS', payload: ['Location and consumption data are required'] });
      return;
    }

    dispatch({ type: 'SET_CALCULATING', payload: true });
    
    try {
      // Calculate optimal system size
      const systemSizeKW = SolarCalculator.calculateSystemSize(state.consumption, state.location);
      
      // Generate system configuration
      const systemConfig = SolarCalculator.optimizeSystemConfiguration(systemSizeKW);
      
      // Calculate financial analysis
      const financial = SolarCalculator.calculateFinancials(systemConfig, state.consumption, state.location);
      
      // Calculate performance data
      const performance = SolarCalculator.calculatePerformanceData(systemConfig, state.location, state.consumption);
      
      // Generate recommendations and warnings
      const recommendations = [
        `Recommended system size: ${systemConfig.systemSizeKW.toFixed(1)} kW`,
        `Expected monthly generation: ${performance.monthlyGeneration[0].generation} kWh`,
        `Payback period: ${financial.paybackPeriod.toFixed(1)} years`
      ];
      
      const warnings: string[] = [];
      if (financial.paybackPeriod > 10) {
        warnings.push('Long payback period - consider optimizing system size');
      }
      
      const results: CalculationResults = {
        location: state.location,
        consumption: state.consumption,
        systemConfig,
        financial,
        performance,
        recommendations,
        warnings
      };
      
      dispatch({ type: 'SET_SYSTEM_CONFIG', payload: systemConfig });
      dispatch({ type: 'SET_RESULTS', payload: results });
      dispatch({ type: 'NEXT_STEP' }); // Move to results step
      
    } catch {
      dispatch({ type: 'SET_ERRORS', payload: ['Calculation failed. Please try again.'] });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const resetCalculator = () => {
    dispatch({ type: 'RESET' });
  };

  const contextValue: PVCalculatorContextType = {
    state,
    updateLocation,
    updateConsumption,
    updateSystemConfig,
    calculateSystem,
    nextStep,
    previousStep,
    resetCalculator
  };

  return (
    <PVCalculatorContext.Provider value={contextValue}>
      {children}
    </PVCalculatorContext.Provider>
  );
}

// Hook to use context
export function usePVCalculator() {
  const context = useContext(PVCalculatorContext);
  if (context === undefined) {
    throw new Error('usePVCalculator must be used within a PVCalculatorProvider');
  }
  return context;
} 