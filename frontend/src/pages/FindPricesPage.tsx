import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { LocationWithPrices } from "@/types";
import { LocationMarker } from "@/components/maps/LocationMarker";
import { LocationSidebar } from "@/components/maps/LocationSidebar";
import { MapClickHandler } from "@/components/maps/MapClickHandler";
import { useGetCommodityDropdown, useGetLocationsWithPrices } from "@/hooks/useQueries";

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
  const [showList, setShowList] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_CENTER);
  const [selectedCommodityId, setSelectedCommodityId] = useState("all");
  const [searchRadius, _setSearchRadius] = useState(50); // km

  const { data: commodities = [] } = useGetCommodityDropdown();

  const locationParams = {
    lat: currentLocation.lat,
    lng: currentLocation.lng,
    radius_km: searchRadius,
    days: 30,
    ...(selectedCommodityId && selectedCommodityId !== "all"
      ? { commodity_id: parseInt(selectedCommodityId) }
      : activeTab !== "all"
        ? { category: activeTab }
        : {}),
  };

  const {
    data: locationsData,
    isLoading: loading,
    error: queryError,
  } = useGetLocationsWithPrices(locationParams);

  // Extract locations from the response and handle error
  const locations = useMemo(
    () => locationsData?.locations || ([] as LocationWithPrices[]),
    [locationsData]
  );
  const error = queryError ? "Failed to load location data. Please try again." : null;

  // Filtering
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loc: LocationWithPrices) =>
          loc.name.toLowerCase().includes(query) ||
          loc.address.toLowerCase().includes(query) ||
          loc.commodities.some((commodity: { name: string }) =>
            commodity.name.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [searchQuery, locations]);

  // Handle location search from the sidebar
  const handleLocationSearch = (location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    place_id?: string;
    poi_id?: string;
  }) => {
    console.log("Location selected:", location);
    setCurrentLocation({ lat: location.latitude, lng: location.longitude });
    // Reset active marker when location changes
    setActiveMarkerId(null);
  };

  // Handle commodity selection
  const handleCommodityChange = (commodityId: string) => {
    setSelectedCommodityId(commodityId);
    // Reset active marker when commodity filter changes
    setActiveMarkerId(null);
  };

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
          <APIProvider apiKey={apiKey} libraries={["places"]}>
            <Map
              key={`${currentLocation.lat}-${currentLocation.lng}`}
              defaultCenter={currentLocation}
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
              {filteredLocations.map((location: LocationWithPrices) => (
                <LocationMarker
                  key={location.id}
                  location={location}
                  isActive={activeMarkerId === location.id}
                  onClick={() => handleMarkerClick(location.id)}
                  onInfoWindowClose={handleInfoWindowClose}
                />
              ))}

              <MapClickHandler />
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
        commodities={commodities}
        selectedCommodityId={selectedCommodityId}
        setSelectedCommodityId={handleCommodityChange}
        onLocationSearch={handleLocationSearch}
      />

      {/* Enhanced responsive floating action buttons */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-10 flex flex-col gap-2 sm:gap-3">
        {/* Current location button */}
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-110"
          title="Find my location"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setCurrentLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                  console.error("Error getting location:", error);
                  // Fallback to default location
                  setCurrentLocation(DEFAULT_CENTER);
                }
              );
            } else {
              console.error("Geolocation is not supported by this browser.");
              setCurrentLocation(DEFAULT_CENTER);
            }
          }}
        >
          <span className="material-icons text-lg sm:text-xl">my_location</span>
        </Button>

        {/* Refresh button */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg transition-all duration-200 hover:scale-110"
          title="Refresh locations"
          onClick={() => window.location.reload()}
        >
          <span className="material-icons text-base sm:text-lg">refresh</span>
        </Button>
      </div>
    </div>
  );
}
