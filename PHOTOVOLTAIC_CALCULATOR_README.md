# Photovoltaic System Design Calculator - README

## Overview

The Photovoltaic System Design Calculator is a comprehensive web-based tool designed for Bangladesh users to calculate, design, and analyze solar photovoltaic (PV) systems. This calculator provides accurate system sizing, financial analysis, and performance projections tailored to Bangladesh's solar market.

## 🌟 Key Features

### Core Functionality
- **Interactive Location Selection**: Map-based picker with Bangladesh solar resource data
- **Smart System Sizing**: AI-powered optimal system size calculation
- **Financial Analysis**: ROI, payback period, and investment calculations
- **Performance Simulation**: Monthly and yearly energy generation projections
- **Component Database**: Solar panels and inverters available in Bangladesh

### Bangladesh-Specific Features
- **Local Solar Data**: District-wise solar irradiance and peak sun hours
- **Electricity Tariffs**: Current Bangladesh electricity rate structure
- **Net Metering**: Grid tie-in benefits and excess energy credits
- **Monsoon Considerations**: Seasonal performance variations
- **Government Incentives**: Subsidy and rebate calculations

## 🏗️ Technical Architecture

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **UI Framework**: Tailwind CSS with Radix UI components
- **State Management**: React Context API
- **Charts**: Recharts library
- **Maps**: Google Maps API
- **Storage**: localStorage for user data

### Project Structure
```
frontend/src/
├── pages/PhotovoltaicCalculator.tsx
├── components/pv-calculator/
│   ├── LocationSelector/
│   ├── EnergyAnalysis/
│   ├── SystemDesign/
│   ├── FinancialAnalysis/
│   └── Results/
├── types/pv-calculator.ts
├── data/bangladesh-solar-data.ts
└── utils/solar-calculations.ts
```

## 📊 Calculation Methodology

### System Sizing
```typescript
// Basic sizing formula
dailyConsumption = monthlyUnits / 30
systemEfficiency = 0.85 // System losses
requiredSystemSize = dailyConsumption / (peakSunHours * systemEfficiency)
```

### Financial Analysis
```typescript
// Investment and savings calculation
totalInvestment = equipmentCost + installationCost
monthlySavings = energyGeneration * electricityRate
paybackPeriod = totalInvestment / (monthlySavings * 12)
```

## 💡 Usage Guide

### Step 1: Location Selection
- Click on map or search address
- View local solar irradiance data
- Confirm district for accurate calculations

### Step 2: Energy Analysis
- Enter monthly electricity bill
- Or use appliance calculator
- Review consumption patterns

### Step 3: System Design
- Auto-sizing (recommended) or manual configuration
- Select panel and inverter types
- Choose installation type

### Step 4: Results
- View system specifications
- Financial projections and ROI
- Performance charts and reports

## 🌍 Bangladesh Solar Market

### Solar Resource
- **Average Irradiance**: 4.5-5.5 kWh/m²/day
- **Peak Sun Hours**: 4.5-6.0 hours/day
- **Seasonal Variation**: 20-30% between dry/monsoon seasons
- **Best Performance**: October to March

### Electricity Rates
- **Residential**: ৳5.26-৳14.61 per kWh (tiered pricing)
- **Commercial**: Higher rates with demand charges
- **Net Metering**: Available in major cities

### Regulatory Environment
- Bangladesh Grid Code compliance
- Building code requirements
- Environmental clearances for large systems

## 🚀 Installation

### Prerequisites
- Node.js 18+
- React development environment
- Google Maps API key

### Setup
```bash
# Clone repository
git clone https://github.com/your-org/bdtracks-v2.git

# Install dependencies
cd bdtracks-v2/frontend
npm install

# Environment setup
cp .env.example .env.local
# Add your Google Maps API key

# Start development
npm run dev
```

### Environment Variables
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
REACT_APP_SOLAR_RESOURCE_API_URL=your_endpoint
```

## 📈 Features Roadmap

### Phase 1 (MVP)
- ✅ Location selection with solar data
- ✅ Energy consumption analysis
- ✅ Basic system sizing
- ✅ Financial calculations
- ✅ Results visualization

### Phase 2 (Advanced)
- 🔄 Satellite imagery roof analysis
- 🔄 Advanced shading calculations
- 🔄 Battery storage integration
- 🔄 Load shedding considerations

### Phase 3 (Professional)
- ⏳ Commercial system design
- ⏳ Advanced reporting
- ⏳ Installer collaboration platform
- ⏳ API for third-party integration

## 🧪 Testing

### Test Coverage
- Unit tests for calculations
- Integration tests for workflows
- Performance tests for large datasets
- User acceptance tests

### Running Tests
```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage reports
```

## 📚 Educational Value

### Learning Objectives
- Solar technology understanding
- System design methodology
- Financial analysis skills
- Environmental impact awareness

### Educational Features
- Interactive tutorials
- Step-by-step guidance
- Real-world case studies
- Assessment tools

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Maintain accessibility standards

### Areas for Contribution
- New features and improvements
- Data updates (prices, products)
- Bengali language support
- Documentation and tutorials

## 📞 Support

### Documentation
- User guides and tutorials
- API documentation
- FAQ and troubleshooting
- Video walkthroughs

### Contact
- GitHub Issues for bugs
- Discussion forums for questions
- Email support for technical help
- Training workshops available

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

### Credits
- Solar resource data: Bangladesh Meteorological Department
- Component database: Local solar suppliers
- Technical validation: Bangladesh Solar and Renewable Energy Association
- Educational framework: Renewable energy education experts

---

*This calculator provides estimates based on current data and industry standards. Actual performance may vary. Consult certified solar professionals for final system design.* 