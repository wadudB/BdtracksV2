import { LocationWithPrices } from "@/types";
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { getCategoryConfig } from "@/utils/categoryConfig";
import { useState, useEffect } from "react";
import AddDataModal from "@/components/modals/AddDataModal";
import { Button } from "@/components/ui/button";

interface LocationMarkerProps {
  location: LocationWithPrices;
  isActive: boolean;
  onClick: () => void;
  onInfoWindowClose: () => void;
}

export function LocationMarker({
  location,
  isActive,
  onClick,
  onInfoWindowClose,
}: LocationMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const config = getCategoryConfig(location.category);
  const [showAllItems, setShowAllItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCommodities, setFilteredCommodities] = useState(location.commodities);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCommodities(location.commodities);
    } else {
      const filtered = location.commodities.filter((commodity) =>
        commodity.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCommodities(filtered);
    }
  }, [searchTerm, location.commodities]);

  // Reset search and view state when location changes or info window closes
  useEffect(() => {
    setSearchTerm("");
    setShowAllItems(false);
  }, [location.id, isActive]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        title={location.name}
        onClick={onClick}
      >
        <div className="relative flex flex-col items-center top-[-5px]">
          <div className="relative">
            {/* Main price badge with speech bubble tail */}
            {location.commodities.length > 0 ? (
              <div
                className={`transform transition-all duration-200 ${isActive ? "scale-110" : "hover:scale-105"}`}
              >
                <div className="relative">
                  {/* Main bubble - responsive sizing */}
                  <div className="bg-white rounded-full px-1 py-1 shadow-lg border-2 border-gray-900 flex items-center gap-1 sm:gap-2 min-w-[70px] sm:min-w-[50px]">
                    {/* Category indicator dot */}
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.color} flex-shrink-0`}
                    ></div>

                    {/* Price info only */}
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate max-w-[60px] sm:max-w-[80px] leading-tight">
                        {location.commodities[0].name}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                        ৳{location.commodities[0].price}
                      </span>
                    </div>
                  </div>

                  {/* Speech bubble tail */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px]">
                      <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>

                {/* Market name horizontal - responsive */}
                <div className="absolute left-full ml-1 sm:ml-2 top-1/2 transform -translate-y-1/2 w-full sm:block">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900  backdrop-blur-sm py-1">
                    {location.name}
                  </span>
                </div>
              </div>
            ) : (
              /* Fallback for locations without price data */
              <div
                className={`transform transition-all duration-200 ${isActive ? "scale-110" : "hover:scale-105"}`}
              >
                <div className="relative">
                  <div
                    className={`${config.color} rounded-full w-8 h-8 sm:w-10 sm:h-10 border-3 border-white shadow-lg flex items-center justify-center`}
                  >
                    <span className="material-icons text-white text-xs sm:text-sm">
                      {config.icon}
                    </span>
                  </div>

                  {/* Simple tail for fallback */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div
                      className={`w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent ${config.color.replace("bg-", "border-t-")}`}
                    ></div>
                  </div>
                </div>

                {/* Market name horizontal - responsive */}
                <div className="absolute left-full ml-1 sm:ml-2 top-1/2 transform -translate-y-1/2 max-w-[50ch] sm:block">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                    {location.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdvancedMarker>

      {isActive && (
        <InfoWindow anchor={marker} onClose={onInfoWindowClose}>
          <div className="p-1 max-w-[280px] sm:max-w-[340px]">
            {/* More compact header */}
            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div
                className={`flex-shrink-0 rounded-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center ${config.lightColor} ${config.textColor} shadow-sm`}
              >
                <span className="material-icons text-sm sm:text-base">{config.icon}</span>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-0.5">
                  {location.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1">
                  {location.address}
                </p>
              </div>
            </div>

            {/* Compact commodities list with search */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1.5">
                <h4 className="text-xs font-bold text-gray-800">Available Items</h4>
                <span className="text-[9px] sm:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {location.commodities.length} items
                </span>
              </div>

              {/* Compact search input */}
              {location.commodities.length > 5 && (
                <div className="relative mb-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search items..."
                    className="w-full text-xs px-2 py-1.5 pl-7 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="material-icons text-gray-400 text-xs absolute left-1.5 top-1/2 transform -translate-y-1/2">
                    search
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-icons text-xs">close</span>
                    </button>
                  )}
                </div>
              )}

              {/* Compact results summary */}
              {searchTerm && (
                <div className="text-[9px] sm:text-[10px] text-gray-500 italic -mt-1 mb-1">
                  Found {filteredCommodities.length} of {location.commodities.length} items
                </div>
              )}

              {/* Compact commodities list */}
              <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-1 pr-1">
                {filteredCommodities.length > 0 ? (
                  filteredCommodities
                    .slice(0, showAllItems ? filteredCommodities.length : 8)
                    .map((commodity, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1 sm:py-1.5 px-2 sm:px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all"
                      >
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 truncate mr-1 sm:mr-2 flex-grow">
                          {commodity.name}
                        </span>
                        <div className="text-right whitespace-nowrap">
                          <span
                            className={`text-[10px] sm:text-xs font-bold ${config.accentColor}`}
                          >
                            ৳{commodity.price}
                          </span>
                          <span className="text-[8px] sm:text-[10px] text-gray-500 ml-0.5">
                            /{commodity.unit}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-[10px] sm:text-xs text-gray-500 text-center py-3 bg-gray-50 rounded-md">
                    <span className="material-icons text-gray-400 mb-1 text-sm">search_off</span>
                    <div>No items match your search</div>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-1 text-blue-500 underline text-[9px] sm:text-[10px]"
                    >
                      Clear search
                    </button>
                  </div>
                )}

                {!showAllItems && filteredCommodities.length > 8 && (
                  <div
                    onClick={() => setShowAllItems(true)}
                    className={`text-sm sm:text-sm font-medium text-center py-1 border-t ${config.accentColor} cursor-pointer flex items-center justify-center gap-1.5`}
                  >
                    <span className="material-icons">expand_more</span>
                    <span className="hover:underline">
                      Show {filteredCommodities.length - 8} more items
                    </span>
                  </div>
                )}

                {showAllItems && filteredCommodities.length > 8 && (
                  <div
                    onClick={() => setShowAllItems(false)}
                    className={`text-sm sm:text-sm font-medium text-center py-1 border-t text-gray-500 cursor-pointer flex items-center justify-center gap-1.5`}
                  >
                    <span className="material-icons">expand_less</span>
                    <span className="hover:underline">Show less</span>
                  </div>
                )}

                {location.commodities.length === 0 && (
                  <div className="text-[10px] sm:text-xs text-gray-500 text-center py-3 bg-gray-50 rounded-md">
                    <span className="material-icons text-gray-400 mb-1 text-sm">info</span>
                    <div>No price data available</div>
                  </div>
                )}
              </div>
            </div>

            {/* Add Price Data Button - Always show regardless of whether there's commodity data */}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <AddDataModal
                trigger={
                  <Button size="sm" className="w-full text-xs py-2 h-8">
                    <span className="material-icons text-sm mr-1">add</span>
                    Add New Price Data
                  </Button>
                }
              />
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
