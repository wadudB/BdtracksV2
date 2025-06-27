# Photovoltaic System Design Calculator - Implementation Guide

## 📋 Step-by-Step Implementation Plan

### Phase 1: Project Setup (Week 1-2)

#### Step 1.1: Project Structure
```
frontend/src/pages/PhotovoltaicCalculator.tsx
frontend/src/components/pv-calculator/
├── LocationSelector/
├── EnergyAnalysis/
├── SystemDesign/
├── FinancialAnalysis/
└── Results/
```

#### Step 1.2: Type Definitions
```typescript
// types/pv-calculator.ts
export interface LocationData {
  coordinates: { lat: number; lng: number };
  address: string;
  solarIrradiance: number;
  peakSunHours: number;
}

export interface EnergyConsumption {
  monthlyBill: number;
  monthlyUnits: number;
  appliances: ApplianceLoad[];
}

export interface SystemConfiguration {
  panelType: PanelSpecification;
  systemSizeKW: number;
  panelCount: number;
  installationType: string;
}

export interface FinancialData {
  totalInvestment: number;
  monthlySavings: number;
  paybackPeriod: number;
  roi: number;
}
```

#### Step 1.3: Bangladesh Solar Database
```typescript
// data/bangladesh-solar-data.ts
export const BANGLADESH_DISTRICTS = [
  {
    name: "Dhaka",
    coordinates: { lat: 23.8103, lng: 90.4125 },
    avgIrradiance: 4.8, // kWh/m²/day
    peakSunHours: 5.2
  },
  // ... all 64 districts
];

export const SOLAR_PANELS = [
  {
    manufacturer: "Jinko Solar",
    model: "JKM330M-60",
    power: 330,
    efficiency: 20.1,
    price: 18000 // BDT
  },
  // ... panel database
];
```

### Phase 2: Core Components (Week 3-4)

#### Step 2.1: Location Selector
```typescript
export const LocationSelector: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Select Your Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AddressSearch onLocationSelect={setSelectedLocation} />
          <MapComponent onLocationSelect={setSelectedLocation} />
        </div>
        <SolarResourceDisplay location={selectedLocation} />
      </CardContent>
    </Card>
  );
};
```

#### Step 2.2: Energy Analysis
```typescript
export const EnergyAnalysis: React.FC = () => {
  const [consumptionData, setConsumptionData] = useState<EnergyConsumption>();

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Energy Consumption Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bill-input">
          <TabsList>
            <TabsTrigger value="bill-input">Electricity Bill</TabsTrigger>
            <TabsTrigger value="appliance-calc">Appliance Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bill-input">
            <BillInput onChange={setConsumptionData} />
          </TabsContent>
          
          <TabsContent value="appliance-calc">
            <ApplianceCalculator onChange={setConsumptionData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
```

### Phase 3: Calculation Engines (Week 5-6)

#### Step 3.1: Solar Calculator
```typescript
export class SolarCalculator {
  static calculateSystemSize(
    consumption: EnergyConsumption,
    location: LocationData
  ): number {
    const dailyConsumption = consumption.monthlyUnits / 30;
    const peakSunHours = location.peakSunHours;
    const systemEfficiency = 0.85;
    
    return (dailyConsumption) / (peakSunHours * systemEfficiency);
  }

  static calculateFinancials(
    systemConfig: SystemConfiguration,
    consumption: EnergyConsumption
  ): FinancialData {
    const systemCost = systemConfig.panelCount * systemConfig.panelType.price;
    const installationCost = systemConfig.systemSizeKW * 15000; // BDT per kW
    const totalInvestment = systemCost + installationCost;
    
    const monthlyGeneration = this.calculateMonthlyGeneration(systemConfig);
    const electricityRate = 8.5; // Average BDT per kWh
    const monthlySavings = monthlyGeneration * electricityRate;
    const paybackPeriod = totalInvestment / (monthlySavings * 12);
    
    return {
      totalInvestment,
      monthlySavings,
      paybackPeriod,
      roi: (monthlySavings * 12 * 25) / totalInvestment // 25-year ROI
    };
  }
}
```

### Phase 4: Results & Visualization (Week 7-8)

#### Step 4.1: Results Summary
```typescript
export const ResultsSummary: React.FC<{ results: CalculationResults }> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{results.systemSizeKW} kW</div>
          <p className="text-sm text-muted-foreground">
            {results.panelCount} panels
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ৳{results.totalInvestment.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ৳{results.monthlySavings.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payback Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {results.paybackPeriod.toFixed(1)} years
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

#### Step 4.2: Performance Charts
```typescript
export const PerformanceCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="generation" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line dataKey="cumulativeSavings" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
```

### Phase 5: Integration & Testing (Week 9-10)

#### Step 5.1: Main Calculator Component
```typescript
export const PhotovoltaicCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [calculatorData, setCalculatorData] = useState({
    location: null,
    consumption: null,
    systemConfig: null,
    results: null
  });

  const steps = [
    { title: "Location", component: LocationSelector },
    { title: "Energy Analysis", component: EnergyAnalysis },
    { title: "System Design", component: SystemDesign },
    { title: "Results", component: Results }
  ];

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <Heading level={1} className="mb-8">
          Photovoltaic System Design Calculator
        </Heading>
        
        <div className="mb-8">
          <ProgressIndicator 
            steps={steps.map(s => s.title)}
            currentStep={currentStep}
          />
        </div>
        
        <div className="mb-8">
          {React.createElement(steps[currentStep].component, {
            data: calculatorData,
            onChange: setCalculatorData
          })}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </Container>
  );
};
```

#### Step 5.2: Routing Integration
```typescript
// Add to App.tsx
const PhotovoltaicCalculator = React.lazy(() => import("./pages/PhotovoltaicCalculator"));

// Add route
<Route
  path="/photovoltaic-calculator"
  element={
    <Suspense fallback={<PageLoader />}>
      <PhotovoltaicCalculator />
    </Suspense>
  }
/>
```

### Phase 6: Bangladesh-Specific Features

#### Step 6.1: Local Considerations
- Monsoon season impact on performance
- Load shedding integration
- Local electricity tariff structure
- Government subsidy calculations
- Net metering policies

#### Step 6.2: Educational Components
- Interactive tutorials
- Solar energy basics
- Financial literacy modules
- Environmental impact calculator

### Testing Strategy

#### Unit Tests
- Solar calculation accuracy
- Financial modeling validation
- Component functionality

#### Integration Tests
- Complete calculation workflow
- Data persistence
- Cross-component communication

#### User Acceptance Tests
- Usability testing with target users
- Educational effectiveness assessment
- Calculation accuracy verification

This implementation guide provides a structured approach to building a comprehensive PV calculator tailored for Bangladesh's solar market. 