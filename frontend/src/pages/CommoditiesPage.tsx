import { FC, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Commodity, CommodityCategory } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddDataModal from '@/components/modals/AddDataModal';
import { cn } from '@/lib/utils';
import { formatCurrencyPrice, formatPriceChange } from '@/utils/price-utils';
import { useGetCommodities } from '@/hooks/useQueries';

// Table view for commodities
const CommoditiesTable: FC<{ commodities: Commodity[] }> = ({ commodities }) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Min Price (৳)</TableHead>
            <TableHead className="text-right">Current Price (avg) (৳)</TableHead>
            <TableHead className="text-right">Max Price (৳)</TableHead>
            <TableHead className="text-right">Weekly Change</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commodities.map((commodity) => (
            <TableRow key={commodity.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{commodity.name}</div>
                  <div className="text-sm text-muted-foreground">{commodity.bengaliName}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs uppercase bg-secondary/50 px-2 py-1 rounded-full text-muted-foreground">
                  {commodity.category}
                </span>
              </TableCell>
              <TableCell>{commodity.unit}</TableCell>
              <TableCell className="text-right">{formatCurrencyPrice(commodity.minPrice, '৳')}</TableCell>
              <TableCell className="text-right">{formatCurrencyPrice(commodity.maxPrice, '৳')}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrencyPrice(commodity.currentPrice, '৳')}</TableCell>
              <TableCell className="text-right">
                <div
                  className={cn(
                    'inline-flex rounded px-1.5 py-0.5 text-xs font-medium',
                    commodity.weeklyChange > 0
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : commodity.weeklyChange < 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  )}
                >
                  {formatPriceChange(commodity.weeklyChange)}
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/commodity/${commodity.id}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Add first page
  pages.push(1);
  
  // Add current page and surrounding pages
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (pages[pages.length - 1] !== i - 1) {
      pages.push(-1); // Indicator for ellipsis
    }
    pages.push(i);
  }
  
  // Add last page if needed
  if (totalPages > 1) {
    if (pages[pages.length - 1] !== totalPages - 1) {
      pages.push(-1); // Indicator for ellipsis
    }
    if (pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }
  }
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button 
        variant="outline" 
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      
      {pages.map((page, index) => 
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
        ) : (
          <Button 
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-10"
          >
            {page}
          </Button>
        )
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

// Extracted component for category filter buttons
interface CategoryFilterProps {
  categories: Array<{ value: CommodityCategory | 'all'; label: string }>;
  selectedCategory: CommodityCategory | 'all';
  onSelect: (category: CommodityCategory | 'all') => void;
}

const CategoryFilter: FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory,
  onSelect 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Button
          key={category.value}
          onClick={() => onSelect(category.value)}
          variant={selectedCategory === category.value ? "default" : "secondary"}
          size="sm"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

const CommoditiesPage: FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<CommodityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  
  // Use React Query hook with filtering
  const params = categoryFilter !== 'all' ? { category: categoryFilter } : undefined;
  const { data: commoditiesData = [], isLoading, error: queryError } = useGetCommodities(params);
  
  // Filter commodities based on search query
  const filteredCommodities = commoditiesData.filter(commodity => {
    const matchesSearch = commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         commodity.bengaliName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate total pages and paginated commodities
  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCommodities = filteredCommodities.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  const handleCategoryChange = useCallback((category: CommodityCategory | 'all'): void => {
    setCategoryFilter(category);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Category options
  const categories: { value: CommodityCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'energy', label: 'Energy' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Bangladesh Commodity Prices</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Browse current prices for various commodities across different categories. All prices are updated daily based on TCB data.
        </p>
      </div>

      {/* Filters with Add Data Button */}
      <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={categoryFilter} 
            onSelect={handleCategoryChange} 
          />
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <span className="material-icons text-sm">search</span>
            </div>
            <Input
              type="text"
              placeholder="Search commodities..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full md:w-64"
            />
          </div>
        </div>
        
        <AddDataModal 
          trigger={
            <Button>
              Add New Price Data
            </Button>
          }
        />
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {queryError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <p className="text-red-700">Failed to load commodities. Please try again later.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Commodities Table with Pagination */}
      {!isLoading && !queryError && filteredCommodities.length > 0 ? (
        <>
          <CommoditiesTable commodities={paginatedCommodities} />
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCommodities.length)} of {filteredCommodities.length} commodities
          </div>
        </>
      ) : !isLoading && !queryError ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No commodities found matching your criteria. Please try a different search or category.</p>
        </div>
      ) : null}
    </div>
  );
};

export default CommoditiesPage; 