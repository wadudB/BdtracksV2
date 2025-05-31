import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { locationService } from "@/services/api";
import { LocationWithPrices } from "@/types";
import { LocationMarker } from "@/components/maps/LocationMarker";
import { LocationSidebar } from "@/components/maps/LocationSidebar";

// Default center coordinates (Dhaka, Bangladesh)
const DEFAULT_CENTER = { lat: 23.7413, lng: 90.395 };

// Category definitions to match backend
const CATEGORY_GROUPS = {
  all: { label: "All", icon: "category" },
  food: {
    label: "Food",
    icon: "restaurant",
    subcategories: [
      "agriculture",
      "pulses",
      "vegetables",
      "spices",
      "fish",
      "meat",
      "dairy",
      "grocery",
      "fruits",
      "poultry",
    ],
  },
  energy: { label: "Energy", icon: "local_gas_station", subcategories: ["oil"] },
  household: { label: "Household", icon: "home", subcategories: ["stationery", "construction"] },
};

// Individual categories with their display names and icons
const INDIVIDUAL_CATEGORIES = {
  agriculture: { label: "Agriculture", icon: "agriculture", group: "food" },
  oil: { label: "Oil", icon: "oil_barrel", group: "energy" },
  pulses: { label: "Pulses", icon: "breakfast_dining", group: "food" },
  vegetables: { label: "Vegetables", icon: "eco", group: "food" },
  spices: { label: "Spices", icon: "spa", group: "food" },
  fish: { label: "Fish", icon: "set_meal", group: "food" },
  meat: { label: "Meat", icon: "lunch_dining", group: "food" },
  dairy: { label: "Dairy", icon: "egg", group: "food" },
  grocery: { label: "Grocery", icon: "shopping_basket", group: "food" },
  fruits: { label: "Fruits", icon: "nutrition", group: "food" },
  poultry: { label: "Poultry", icon: "egg_alt", group: "food" },
  stationery: { label: "Stationery", icon: "edit", group: "household" },
  construction: { label: "Construction", icon: "construction", group: "household" },
};

export default function FindPricesPage() {
  // State for current category filter (can be a group or individual category)
  const [activeTab, setActiveTab] = useState("all");
  // State to track if we're viewing categories by group or individually
  const [viewMode, setViewMode] = useState<"group" | "individual">("group");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [locations, setLocations] = useState<LocationWithPrices[]>([]);
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enhanced filtering with memoization
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.address.toLowerCase().includes(query) ||
          loc.commodities.some((commodity) => commodity.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, locations]);

  // Enhanced data fetching
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: {
          lat: number;
          lng: number;
          radius_km?: number;
          days?: number;
          category?: string;
        } = {
          lat: DEFAULT_CENTER.lat,
          lng: DEFAULT_CENTER.lng,
          radius_km: 50,
          days: 30,
        };

        if (activeTab !== "all") {
          params.category = activeTab;
        }

        const response = await locationService.getWithPrices(params);
        setLocations(response.locations || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setError("Failed to load location data. Please try again.");
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [activeTab]);

  // Toggle between group view and individual category view
  const toggleViewMode = () => {
    if (viewMode === "group") {
      setViewMode("individual");
      // If current active tab is a group, reset to "all"
      if (["all", "food", "energy", "household"].includes(activeTab)) {
        setActiveTab("all");
      }
    } else {
      setViewMode("group");
      // If current active tab is an individual category, reset to its group
      if (activeTab in INDIVIDUAL_CATEGORIES) {
        setActiveTab(INDIVIDUAL_CATEGORIES[activeTab as keyof typeof INDIVIDUAL_CATEGORIES].group);
      }
    }
  };

  // Get the categories to display based on current view mode
  const getCategoriesToDisplay = () => {
    if (viewMode === "group") {
      return Object.entries(CATEGORY_GROUPS).map(([key, value]) => ({
        id: key,
        label: value.label,
        icon: value.icon,
      }));
    } else {
      return Object.entries(INDIVIDUAL_CATEGORIES).map(([key, value]) => ({
        id: key,
        label: value.label,
        icon: value.icon,
      }));
    }
  };

  const handleMarkerClick = (locationId: number) => {
    setActiveMarkerId((current) => (current === locationId ? null : locationId));
  };

  const handleInfoWindowClose = () => {
    setActiveMarkerId(null);
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div
      className="relative w-full bg-gray-50"
      style={{ height: "calc(100vh - var(--header-height) - var(--submenu-height))" }}
    >
      {/* Enhanced map container */}
      <div className="h-full w-full">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={15}
              mapId="find-prices-map"
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeControl={false}
              fullscreenControl={false}
              streetViewControl={false}
              cameraControl={false}
              className="h-full w-full"
              styles={[
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ]}
            >
              {filteredLocations.map((location) => (
                <LocationMarker
                  key={location.id}
                  location={location}
                  isActive={activeMarkerId === location.id}
                  onClick={() => handleMarkerClick(location.id)}
                  onInfoWindowClose={handleInfoWindowClose}
                />
              ))}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
            <span className="material-icons text-4xl sm:text-6xl mb-4 text-gray-400">map</span>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Map Unavailable</h3>
            <p className="text-sm">Google Maps API key is missing</p>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <Button
        variant="default"
        size="icon"
        className="fixed top-[calc(var(--header-height)+var(--submenu-height)+2rem)] left-4 z-30 rounded-full h-12 w-12 shadow-xl bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="material-icons text-xl">{isMobileMenuOpen ? "close" : "menu"}</span>
      </Button>

      {/* Pass new props to the LocationSidebar */}
      <LocationSidebar
        filteredLocations={filteredLocations}
        activeMarkerId={activeMarkerId}
        isCollapsed={isCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        activeTab={activeTab}
        searchQuery={searchQuery}
        loading={loading}
        error={error}
        showList={showList}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
        setIsCollapsed={setIsCollapsed}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setShowList={setShowList}
        handleMarkerClick={handleMarkerClick}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
        categories={getCategoriesToDisplay()}
      />

      {/* Enhanced responsive floating action buttons */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-10 flex flex-col gap-2 sm:gap-3">
        {/* Current location button */}
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-110"
          title="Find my location"
        >
          <span className="material-icons text-lg sm:text-xl">my_location</span>
        </Button>

        {/* Category view toggle button */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow-lg transition-all duration-200 hover:scale-110"
          title={viewMode === "group" ? "Show individual categories" : "Show category groups"}
          onClick={toggleViewMode}
        >
          <span className="material-icons text-base sm:text-lg">
            {viewMode === "group" ? "tune" : "category"}
          </span>
        </Button>

        {/* Refresh button */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow-lg transition-all duration-200 hover:scale-110"
          title="Refresh locations"
          onClick={() => window.location.reload()}
        >
          <span className="material-icons text-base sm:text-lg">refresh</span>
        </Button>
      </div>
    </div>
  );
}
