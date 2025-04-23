import { useCallback, useState } from "react";
import { CommodityCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import AddDataModal from "@/components/modals/AddDataModal";
import { useGetCommodities } from "@/hooks/useQueries";
import { CommoditiesTable } from "@/components/tables/CommoditiesTable";
import { Pagination } from "@/components/Pagination";

// Extracted component for category filter buttons
interface CategoryFilterProps {
  categories: Array<{ value: CommodityCategory | "all"; label: string }>;
  selectedCategory: CommodityCategory | "all";
  onSelect: (category: CommodityCategory | "all") => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
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

const CommoditiesPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<CommodityCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Use React Query hook with filtering
  const params = categoryFilter !== "all" ? { category: categoryFilter } : undefined;
  const { data: commoditiesData = [], isLoading, error: queryError } = useGetCommodities(params);

  // Filter commodities based on search query
  const filteredCommodities = commoditiesData.filter((commodity) => {
    const matchesSearch =
      commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commodity.bengaliName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate total pages and paginated commodities
  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCommodities = filteredCommodities.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  const handleCategoryChange = useCallback((category: CommodityCategory | "all"): void => {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Category options
  const categories: { value: CommodityCategory | "all"; label: string }[] = [
    { value: "all", label: "All Categories" },
    { value: "agriculture", label: "Agriculture" },
    { value: "industrial", label: "Industrial" },
    { value: "consumer", label: "Consumer" },
    { value: "energy", label: "Energy" },
  ];

  return (
    <Section>
      <Container>
        {/* Page Header */}
        <div className="mb-8 text-center">
          <Heading size="lg" className="mb-2">Commodity Prices</Heading>
          <p className="text-muted-foreground max-w-full mx-auto">
            Browse current prices for various commodities across different categories. All prices are
            updated daily based on TCB data.
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

          <AddDataModal trigger={<Button>Add New Price Data</Button>} />
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
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredCommodities.length)} of{" "}
              {filteredCommodities.length} commodities
            </div>
          </>
        ) : !isLoading && !queryError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No commodities found matching your criteria. Please try a different search or category.
            </p>
          </div>
        ) : null}
      </Container>
    </Section>
  );
};

export default CommoditiesPage;
