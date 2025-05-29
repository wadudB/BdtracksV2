import { LocationWithPrices } from "@/types";
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { getCategoryConfig } from "@/utils/categoryConfig";

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

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        title={location.name}
        onClick={onClick}
      >
        <div className="relative flex flex-col items-center">
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
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
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
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
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
          <div className="p-3 sm:p-5 max-w-[280px] sm:max-w-[350px]">
            {/* Enhanced header */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div
                className={`flex-shrink-0 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${config.lightColor} ${config.textColor}`}
              >
                <span className="material-icons text-base sm:text-lg">{config.icon}</span>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-1">
                  {location.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <span className="material-icons text-xs sm:text-sm">location_on</span>
                  {location.address}
                </p>
              </div>
            </div>

            {/* Enhanced commodities list */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800">Available Items</h4>
                <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {location.commodities.length} items
                </span>
              </div>

              <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-1 sm:space-y-2">
                {location.commodities.slice(0, 8).map((commodity, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2 sm:mr-3 flex-grow">
                      {commodity.name}
                    </span>
                    <div className="text-right">
                      <span className={`text-xs sm:text-sm font-bold ${config.accentColor}`}>
                        ৳{commodity.price}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        /{commodity.unit}
                      </span>
                    </div>
                  </div>
                ))}

                {location.commodities.length > 8 && (
                  <div
                    className={`text-[10px] sm:text-xs font-medium text-center py-2 border-t ${config.accentColor}`}
                  >
                    +{location.commodities.length - 8} more items available
                  </div>
                )}

                {location.commodities.length === 0 && (
                  <div className="text-xs sm:text-sm text-gray-500 text-center py-3 sm:py-4 bg-gray-50 rounded-lg">
                    <span className="material-icons text-gray-400 mb-2">info</span>
                    <div>No price data available</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
