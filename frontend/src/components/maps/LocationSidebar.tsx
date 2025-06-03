import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationCard } from "@/components/ui/LocationCard";
import { LocationCardSkeleton } from "@/components/ui/LocationCardSkeleton";
import { LocationWithPrices } from "@/types";
import { LocationSearchInput } from "@/components/ui/LocationSearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

interface CommodityDropdownItem {
  id: number;
  name: string;
  bengaliName?: string;
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
  viewMode: "group" | "individual";
  toggleViewMode: () => void;
  categories: CategoryItem[];
  commodities: CommodityDropdownItem[];
  selectedCommodityId: string;
  setSelectedCommodityId: (commodityId: string) => void;
  onLocationSearch: (location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    place_id?: string;
    poi_id?: string;
  }) => void;
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
  showList: _showList,
  setActiveTab,
  setIsCollapsed,
  setIsMobileMenuOpen,
  setShowList: _setShowList,
  handleMarkerClick,
  toggleViewMode: _toggleViewMode,
  categories,
  commodities,
  selectedCommodityId,
  setSelectedCommodityId,
  onLocationSearch,
}: LocationSidebarProps) {
  return (
    <>
      {/* Mobile overlay - separate from sidebar for better z-index control */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[19] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main sidebar container */}
      <div
        className={`
        fixed z-20 transition-all duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "inset-x-2 top-[calc(var(--header-height)+var(--submenu-height)+2rem)] bottom-2 lg:left-4 lg:right-auto lg:bottom-4 lg:top-[calc(var(--header-height)+var(--submenu-height)+0.5rem)]"
            : "hidden lg:flex lg:left-4 lg:top-[calc(var(--header-height)+var(--submenu-height)+0.5rem)] lg:bottom-4"
        }
        ${isCollapsed ? "lg:w-16" : "lg:w-[350px] xl:w-[380px]"}
      `}
      >
        {/* Sidebar content */}
        <Card className="h-full flex flex-col shadow-2xl border-0 bg-card/95 backdrop-blur-lg rounded-xl lg:rounded-2xl p-0 gap-0 overflow-hidden">
          {/* Header - more compact on mobile */}
          <CardHeader className="bg-muted/50 rounded-t-xl lg:rounded-t-2xl flex items-center px-3 lg:px-4 py-2 lg:py-3 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              {!isCollapsed && (
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="bg-primary/10 rounded-full text-primary p-1.5 lg:p-2">
                    <span className="material-icons text-sm lg:text-base">place</span>
                  </div>
                  <div>
                    <h2 className="text-sm lg:text-base font-bold text-foreground leading-tight">
                      Find Prices Near Me
                    </h2>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                {/* Mobile close button */}
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden rounded-full w-7 h-7 lg:w-8 lg:h-8 p-0"
                  aria-label="Close menu"
                >
                  <span className="material-icons text-lg text-foreground">close</span>
                </Button> */}
                {/* Desktop collapse button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex flex-shrink-0 rounded-full w-8 h-8 p-0"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <span className="material-icons text-foreground">
                    {isCollapsed ? "chevron_right" : "chevron_left"}
                  </span>
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isCollapsed && (
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Search and filter section - more compact spacing on mobile */}
              <div className="flex flex-col border-b border-border flex-shrink-0">
                {/* Location Search section */}
                <div className="px-2 lg:px-3 py-1.5 lg:py-2 bg-card">
                  <LocationSearchInput
                    placeholder="Search location..."
                    onLocationSelect={onLocationSearch}
                    className="w-full"
                  />
                </div>

                {/* Commodity Filter section */}
                <div className="px-2 lg:px-3 py-1.5 lg:py-2 bg-card">
                  <Select value={selectedCommodityId} onValueChange={setSelectedCommodityId}>
                    <SelectTrigger id="commodity" className="w-full h-9 lg:h-10">
                      <SelectValue placeholder="Filter by commodity" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="max-h-[200px] lg:max-h-[300px] overflow-y-auto z-50"
                      sideOffset={4}
                    >
                      <SelectItem value="all">
                        <span className="text-sm lg:text-base">All Commodities</span>
                      </SelectItem>
                      {commodities.map((commodity: CommodityDropdownItem) => (
                        <SelectItem key={commodity.id} value={commodity.id.toString()}>
                          <div className="flex flex-col">
                            <span className="text-sm lg:text-base">{commodity.name}</span>
                            {commodity.bengaliName && (
                              <span className="text-xs lg:text-sm text-muted-foreground">
                                {commodity.bengaliName}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tabs section - optimized for mobile */}
              <div className="px-2 lg:px-3 py-1.5 lg:py-2 border-b border-border bg-card sticky top-0 z-10 flex-shrink-0">
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full bg-muted rounded-lg p-0.5 h-auto">
                    <div className="grid grid-cols-4 gap-0.5 w-full">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className="rounded-md font-medium text-xs lg:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-semibold transition-all flex flex-col items-center justify-center text-muted-foreground py-2 lg:py-3 px-1 lg:px-2 min-h-[3rem] lg:min-h-[3.5rem]"
                          aria-label={`Show ${category.label.toLowerCase()} locations`}
                        >
                          <span className="material-icons text-sm lg:text-base mb-0.5">
                            {category.icon}
                          </span>
                          <span className="text-xs lg:text-sm leading-tight text-center">
                            {category.label}
                          </span>
                        </TabsTrigger>
                      ))}
                    </div>
                  </TabsList>
                </Tabs>

                {/* View mode indicator - more compact on mobile */}
                <div className="flex items-center justify-between mt-1.5 lg:mt-2">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs lg:text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs lg:text-sm text-muted-foreground">
                      <span className="font-medium text-primary">{filteredLocations.length}</span>
                      <span className="ml-1">found</span>
                      {searchQuery && (
                        <span className="ml-1.5 bg-primary/10 text-primary px-1.5 lg:px-2 py-0.5 rounded-full text-xs">
                          "
                          {searchQuery.length > 10
                            ? searchQuery.substring(0, 10) + "..."
                            : searchQuery}
                          "
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Listings section - optimized scrolling for mobile */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-card">
                {loading ? (
                  <div className="p-2 lg:p-3 space-y-2 lg:space-y-2.5">
                    {[...Array(3)].map((_, i) => (
                      <LocationCardSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center p-4 lg:p-6 text-center">
                    <span className="material-icons text-2xl lg:text-3xl text-destructive mb-2 lg:mb-3">
                      error_outline
                    </span>
                    <h3 className="font-semibold text-foreground mb-1 text-sm lg:text-base">
                      Something went wrong
                    </h3>
                    <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-3">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="rounded-lg transition-all text-xs lg:text-sm h-8 lg:h-9"
                    >
                      <span className="material-icons text-xs lg:text-sm mr-1">refresh</span>
                      Try Again
                    </Button>
                  </div>
                ) : filteredLocations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 lg:p-6 text-center">
                    <span className="material-icons text-2xl lg:text-3xl text-muted-foreground mb-2 lg:mb-3">
                      search_off
                    </span>
                    <h3 className="font-semibold text-foreground mb-1 text-sm lg:text-base">
                      No locations found
                    </h3>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Try searching for a location or adjusting filters
                    </p>
                  </div>
                ) : (
                  <div className="p-2 lg:p-3 space-y-2 lg:space-y-2.5">
                    {filteredLocations.map((location) => (
                      <LocationCard
                        key={location.id}
                        location={location}
                        isActive={activeMarkerId === location.id}
                        onClick={() => {
                          handleMarkerClick(location.id);
                          // Close mobile menu when selecting location
                          if (window.innerWidth < 1024) {
                            setIsMobileMenuOpen(false);
                          }
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
    </>
  );
}
