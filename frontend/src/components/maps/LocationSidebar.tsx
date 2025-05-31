import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationCard } from "@/components/ui/LocationCard";
import { LocationCardSkeleton } from "@/components/ui/LocationCardSkeleton";
import { LocationWithPrices } from "@/types";

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

interface LocationSidebarProps {
  filteredLocations: LocationWithPrices[];
  activeMarkerId: number | null;
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  activeTab: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  showList: boolean;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCollapsed: (collapsed: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setShowList: (showList: boolean) => void;
  handleMarkerClick: (locationId: number) => void;
  // New props for category system
  viewMode: "group" | "individual";
  toggleViewMode: () => void;
  categories: CategoryItem[];
}

export function LocationSidebar({
  filteredLocations,
  activeMarkerId,
  isCollapsed,
  isMobileMenuOpen,
  activeTab,
  searchQuery,
  loading,
  error,
  showList,
  setActiveTab,
  setSearchQuery,
  setIsCollapsed,
  setIsMobileMenuOpen,
  setShowList,
  handleMarkerClick,
  // New props
  viewMode,
  toggleViewMode,
  categories,
}: LocationSidebarProps) {
  return (
    <div
      className={`
      fixed z-20 flex flex-col transition-all duration-300 ease-in-out
      ${isMobileMenuOpen ? "inset-0 bg-black/50 lg:bg-transparent" : ""}
      lg:left-4 lg:top-[calc(var(--header-height)+var(--submenu-height)+0.5rem)] lg:bottom-4
      ${isCollapsed ? "lg:w-16" : "lg:w-[350px] xl:w-[380px]"}
    `}
    >
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="absolute inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <Card
        className={`
        h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-2xl p-0 gap-0
        ${
          isMobileMenuOpen
            ? "fixed inset-x-3 top-[calc(var(--header-height)+var(--submenu-height)+1rem)] bottom-3 lg:relative lg:inset-auto"
            : "hidden lg:flex"
        }
      `}
      >
        {/* Optimized header */}
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl flex items-center px-4 py-3">
          <div className="flex items-center justify-between w-full">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full text-blue-600">
                  <span className="material-icons text-base">place</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">
                    Find Prices Near Me
                  </h2>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1">
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden rounded-full w-8 h-8 p-0"
                aria-label="Close menu"
              >
                <span className="material-icons">close</span>
              </Button>
              {/* Desktop collapse button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex flex-shrink-0 rounded-full w-8 h-8 p-0"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <span className="material-icons">
                  {isCollapsed ? "chevron_right" : "chevron_left"}
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex border-b">
              {/* Search section with maintained font size */}
              <div className="flex-1 px-3 py-2 bg-white">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search markets, areas, items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 h-10 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-lg text-sm transition-all"
                    aria-label="Search"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <span className="material-icons text-base">search</span>
                  </span>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <span className="material-icons text-sm">close</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* View toggle buttons */}
              <div className="flex">
                {/* Grid/List view toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-l px-2 h-auto rounded-none text-sm flex items-center gap-1 hover:bg-gray-100"
                  onClick={() => setShowList(!showList)}
                  aria-label={showList ? "Switch to grid view" : "Switch to list view"}
                >
                  <span className="material-icons">{showList ? "grid_view" : "list"}</span>
                </Button>

                {/* Category view mode toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-l px-2 h-auto rounded-none text-sm flex items-center gap-1 hover:bg-gray-100"
                  onClick={toggleViewMode}
                  aria-label={
                    viewMode === "group"
                      ? "Switch to individual categories"
                      : "Switch to category groups"
                  }
                >
                  <span className="material-icons text-base">
                    {viewMode === "group" ? "tune" : "category"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Tabs section with maintained font size */}
            <div className="px-3 py-2 border-b bg-white sticky top-0 z-10">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className={`grid ${categories.length <= 4 ? `grid-cols-${categories.length}` : "grid-cols-4"} h-9 bg-gray-100 rounded-lg p-0.5 gap-0.5 overflow-x-auto custom-scrollbar`}
                >
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="rounded-md font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:font-semibold transition-all whitespace-nowrap min-w-max"
                      aria-label={`Show ${category.label.toLowerCase()} locations`}
                    >
                      <span className="material-icons text-base mr-1">{category.icon}</span>
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* View mode indicator */}
              <div className="flex items-center justify-between mt-2">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium text-blue-700">{filteredLocations.length}</span>
                    <span className="ml-1">locations found</span>
                    {searchQuery && (
                      <span className="ml-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        "{searchQuery}"
                      </span>
                    )}
                    <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {viewMode === "group" ? "Group View" : "Detailed View"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Listings section */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-3 space-y-2.5">
                  {[...Array(5)].map((_, i) => (
                    <LocationCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <span className="material-icons text-3xl text-red-400 mb-3">error_outline</span>
                  <h3 className="font-semibold text-gray-900 mb-1 text-base">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm h-9"
                  >
                    <span className="material-icons text-sm mr-1">refresh</span>
                    Try Again
                  </Button>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <span className="material-icons text-3xl text-gray-400 mb-3">search_off</span>
                  <h3 className="font-semibold text-gray-900 mb-1 text-base">No locations found</h3>
                  <p className="text-sm text-gray-600">
                    Try adjusting your search or category filter
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-2.5">
                  {filteredLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      isActive={activeMarkerId === location.id}
                      onClick={() => {
                        handleMarkerClick(location.id);
                        setIsMobileMenuOpen(false); // Close mobile menu when selecting location
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
