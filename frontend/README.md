# BDTracks Frontend

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:5173)

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Pre-commit hooks
npm run prepare         # Setup Husky pre-commit hooks
```

## 🌐 API Integration

- **TanStack Query** for efficient data fetching, caching, and synchronization
- **Axios** for HTTP requests
- Custom hooks for API operations
- Error boundaries for graceful error handling
- Loading states and optimistic updates

### Code Style

- ESLint configuration with React and TypeScript rules
- Prettier for code formatting
- Husky pre-commit hooks for code quality
- Consistent naming conventions

### Component Structure

```tsx
// Preferred component structure
import { ComponentProps } from "./Component.types";

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return <div className="component-styles">{/* Component JSX */}</div>;
}
```

### State Management

- React useState and useReducer for local state
- TanStack Query for server state
- Context API for global application state

### Build Optimization

- Code splitting with React.lazy
- Tree shaking for minimal bundle size
- Asset optimization with Vite
- Progressive Web App features

## 🤝 Contributing

1. Follow the established code style and patterns
2. Write TypeScript with proper type definitions
3. Test components thoroughly
4. Update documentation for new features
5. Run linting and formatting before commits

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query)
