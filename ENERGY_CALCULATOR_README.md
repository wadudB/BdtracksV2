# Energy Cost Calculator - BDTracks

## Overview

The Energy Cost Calculator is a sophisticated web application designed specifically for Bangladesh users to calculate their electricity consumption and monthly bills. It incorporates Bangladesh's current tiered electricity pricing system (February 2024 rates) and provides real-time cost calculations with accurate billing components.

## 🚀 Features

### Core Functionality
- **Pre-defined Appliance Database**: Comprehensive collection of common household and commercial appliances
- **Custom Appliance Entry**: Ability to add custom devices with specific power ratings
- **Real-time Cost Calculation**: Instant calculation of monthly and yearly costs
- **Bangladesh-Specific Pricing**: Implements actual BD electricity rates with tiered pricing
- **Interactive UI**: Modern, responsive design with tabbed interface

### Advanced Features
- **Energy Efficiency Ratings**: Visual indicators for high, medium, and low efficiency appliances
- **Quantity and Usage Control**: Adjust quantity and daily usage hours for each appliance
- **Comprehensive Cost Breakdown**: Shows energy cost, VAT, demand charges, meter rent, and rebates
- **Energy Saving Tips**: Built-in recommendations for reducing electricity consumption
- **Category Filtering**: Filter appliances by category (Cooling, Lighting, Kitchen, etc.)

## 🛠 Technical Implementation

### Technology Stack
- **Frontend**: React with TypeScript
- **UI Components**: Custom UI components built on Radix UI
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks (useState, useMemo, useCallback)
- **Routing**: React Router for navigation

### Project Structure
```
frontend/src/pages/EnergyCalculator.tsx    # Main calculator component
frontend/src/App.tsx                       # Routing configuration
frontend/src/layouts/components/Header.tsx # Navigation updates
frontend/src/pages/HomePage.tsx           # Homepage integration
```

### Key Components

#### 1. Types and Interfaces
```typescript
interface Appliance {
  id: string;
  name: string;
  category: string;
  power: number; // Watts
  typical_usage: number; // Hours per day
  efficiency_rating?: 'High' | 'Medium' | 'Low';
  energy_efficient_alternative?: {
    name: string;
    power: number;
    savings_percentage: number;
  };
}

interface CalculatorAppliance extends Appliance {
  quantity: number;
  daily_hours: number;
  monthly_cost: number;
  yearly_cost: number;
}
```

#### 2. Bangladesh Electricity Rates Implementation
```typescript
const ELECTRICITY_RATES = [
  { min: 0, max: 75, rate: 5.26 },
  { min: 76, max: 200, rate: 7.20 },
  { min: 201, max: 300, rate: 7.59 },
  { min: 301, max: 400, rate: 8.02 },
  { min: 401, max: 600, rate: 12.67 },
  { min: 601, max: Infinity, rate: 14.61 }
];

const ADDITIONAL_CHARGES = {
  demand_charge: 42, // Per month
  vat_rate: 0.05, // 5%
  meter_rent: 40, // Per month
  rebate_rate: 0.005 // 0.5%
};
```

#### 3. Cost Calculation Algorithm
The calculator implements Bangladesh's tiered pricing system:
1. Calculate monthly consumption in kWh
2. Apply tiered rates progressively
3. Add additional charges (demand charge, meter rent, VAT)
4. Subtract applicable rebates
5. Display detailed cost breakdown

## 📊 Appliance Database

### Categories Included:
1. **Cooling**: ACs (regular/inverter), Ceiling fans (regular/BLDC), Table fans
2. **Lighting**: LED bulbs, CFL, Tube lights with various wattages
3. **Kitchen**: Refrigerators, Microwaves, Rice cookers, Electric kettles
4. **Entertainment**: LED TVs (various sizes), Computers, Laptops
5. **Laundry**: Washing machines, Electric irons
6. **Water**: Water heaters, Water pumps
7. **Custom**: User-defined appliances

### Appliance Data Structure:
Each appliance includes:
- Power consumption (Watts)
- Typical daily usage hours
- Efficiency rating (where applicable)
- Energy-efficient alternatives (future feature)

## 🎯 Educational Value

### Learning Objectives:
1. **Energy Awareness**: Understanding power consumption of household appliances
2. **Cost Consciousness**: Real impact of appliance usage on electricity bills
3. **Efficiency Education**: Benefits of energy-efficient appliances
4. **Financial Planning**: Budgeting for electricity expenses

### Practical Applications:
- **Home Energy Audits**: Identify high-consumption appliances
- **Appliance Purchase Decisions**: Compare costs of regular vs. energy-efficient models
- **Usage Optimization**: Adjust usage patterns to reduce costs
- **Energy Conservation**: Implement suggested energy-saving tips

## 📋 How to Use

### Step 1: Select Appliances
1. Choose from predefined appliances by category
2. Or add custom appliances with specific power ratings
3. Click "Add to Calculator" for each appliance

### Step 2: Configure Usage
1. Adjust quantity for each appliance type
2. Set daily usage hours
3. View individual appliance costs

### Step 3: Review Calculations
1. Monitor total monthly consumption (kWh)
2. Review detailed cost breakdown
3. See yearly cost projections
4. Implement energy-saving recommendations

## 🌍 Bangladesh Context

### Current Electricity Rates (February 2024):
- **0-75 units**: ৳5.26/kWh
- **76-200 units**: ৳7.20/kWh
- **201-300 units**: ৳7.59/kWh
- **301-400 units**: ৳8.02/kWh
- **401-600 units**: ৳12.67/kWh
- **600+ units**: ৳14.61/kWh

### Additional Charges:
- **Demand Charge**: ৳42/month
- **VAT**: 5% of energy cost
- **Meter Rent**: ৳40/month
- **Rebate**: 0.5% of energy cost

### Local Considerations:
- Load shedding awareness
- Seasonal usage variations
- Common appliances in Bangladesh households
- Energy efficiency initiatives

## 🔮 Future Enhancements

### Phase 2 Features:
1. **Load Shedding Calculator**: Factor in power outages
2. **Solar Panel Integration**: Calculate solar savings
3. **Seasonal Adjustments**: Different rates for summer/winter
4. **Energy Efficiency Comparison**: Side-by-side appliance comparisons
5. **Carbon Footprint**: Environmental impact calculations
6. **Mobile App**: Progressive Web App for mobile users

### Phase 3 Features:
1. **Smart Home Integration**: Connect with IoT devices
2. **Predictive Analytics**: Forecast future consumption
3. **Community Features**: Compare with neighborhood averages
4. **Government Incentives**: Track rebates and subsidies
5. **Multi-language Support**: Bengali language interface

## 🎓 Teacher Resources

### Lesson Plan Integration:
1. **Mathematics**: Percentage calculations, cost analysis
2. **Physics**: Power, energy, efficiency concepts
3. **Economics**: Cost-benefit analysis, budgeting
4. **Environmental Science**: Energy conservation, sustainability

### Discussion Points:
- Why do electricity rates increase with higher consumption?
- How can individuals contribute to national energy conservation?
- What is the environmental impact of energy consumption?
- How do energy-efficient appliances save money long-term?

### Activities:
1. **Home Energy Audit**: Students calculate their home's consumption
2. **Efficiency Challenge**: Compare regular vs. energy-efficient appliances
3. **Budget Planning**: Create monthly electricity budgets
4. **Conservation Campaign**: Design energy-saving initiatives

## 📈 Impact Metrics

### Expected Outcomes:
- **20% increase** in energy awareness among users
- **15% reduction** in average household electricity consumption
- **Enhanced decision-making** for appliance purchases
- **Improved financial planning** for electricity expenses

### Success Indicators:
- User engagement metrics
- Feedback on cost accuracy
- Adoption of energy-saving recommendations
- Educational institution usage

## 🔧 Installation & Setup

### Prerequisites:
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Development Setup:
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
cd BdtracksV2/frontend
npm install

# Start development server
npm run dev

# Navigate to energy calculator
http://localhost:3000/energy-calculator
```

### Production Deployment:
```bash
# Build for production
npm run build

# Deploy to hosting platform
npm run deploy
```

## 📞 Support & Contact

### For Teachers:
- Educational resource requests
- Curriculum integration support
- Bulk usage licensing
- Custom feature requests

### For Developers:
- Technical documentation
- API integration
- Custom implementations
- Bug reports and feature requests

### Contact Information:
- **Website**: [BDTracks](https://bdtracks.com)
- **Email**: support@bdtracks.com
- **GitHub**: [Project Repository]

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- **Bangladesh Government**: For providing accurate electricity rate data
- **Educational Institutions**: For feedback and testing
- **Community Contributors**: For appliance database improvements
- **Open Source Community**: For UI components and tools

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Compatibility**: All modern web browsers, Mobile responsive

For the latest updates and documentation, visit our [project website](https://bdtracks.com/energy-calculator). 