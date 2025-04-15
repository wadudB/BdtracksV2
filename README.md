# Bangladesh Commodity Price Tracker

A platform for tracking commodity prices across different regions of Bangladesh.

## Features

- Display of commodity prices with historical data
- Regional price variations across Bangladesh
- Filtering by commodity categories
- Adding new price data records
- Responsive design for all devices

## API Integration

The application uses TanStack Query (React Query) for data fetching and state management.

### Query Hooks

All API interactions are centralized in custom hooks located in `src/hooks/useQueries.ts`:

- `useGetCommodities` - For fetching all commodities with optional filtering
- `useGetCommodity` - For fetching a single commodity by ID
- `useGetCommodityDropdown` - For fetching commodity dropdown data
- `useGetRegions` - For fetching all regions
- `useCreatePriceRecord` - For creating new price records

### Benefits of TanStack Query

- Automatic caching and background refetching
- Loading and error states management
- Optimistic updates with invalidation
- Reduced boilerplate code
- Consistent data fetching patterns

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Technologies

- React with TypeScript
- TanStack Query for API management
- Radix UI components
- Tailwind CSS for styling
- Vite for bundling