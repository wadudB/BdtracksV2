import { useEffect, useState, useCallback } from "react";
import {
  useMap,
  InfoWindow,
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import AddDataModal from "@/components/modals/AddDataModal";

export function MapClickHandler() {
  const map = useMap();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [clickedPosition, setClickedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  useEffect(() => {
    if (!map) return;

    // Create a listener for map POI clicks (Points of Interest)
    const clickListener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      // Check if this is a POI click (Point of Interest)
      const iconEvent = e as google.maps.IconMouseEvent;

      if (iconEvent.placeId) {
        // This is a POI click
        const service = new google.maps.places.PlacesService(map);

        service.getDetails(
          {
            placeId: iconEvent.placeId,
            fields: ["name", "geometry", "formatted_address", "icon", "types"],
          },
          (place, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place &&
              place.geometry?.location
            ) {
              const position = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };

              setClickedPosition(position);
              setLocationName(place.name || "Location");
              setLocationAddress(place.formatted_address || "");
              setInfoWindowOpen(true);
            }
          }
        );
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map]);

  const handleClose = useCallback(() => {
    setInfoWindowOpen(false);
    // Also clear the clicked position to remove the marker
    setClickedPosition(null);
  }, []);

  return (
    <>
      {clickedPosition && (
        <AdvancedMarker ref={markerRef} position={clickedPosition} title={locationName}>
          <div className="relative flex flex-col items-center top-[-5px]">
            <div className="relative">
              <div className="bg-blue-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 border-3 border-white shadow-lg flex items-center justify-center">
                <span className="material-icons text-white text-xs sm:text-sm">location_on</span>
              </div>

              {/* Simple tail */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-500"></div>
              </div>
            </div>
          </div>
        </AdvancedMarker>
      )}

      {infoWindowOpen && clickedPosition && marker && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <div className="p-1 max-w-[280px] sm:max-w-[340px]">
            {/* More compact header - matching LocationMarker style */}
            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="flex-shrink-0 rounded-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-100 text-blue-700 shadow-sm">
                <span className="material-icons text-sm sm:text-base">location_on</span>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-0.5">
                  {locationName}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1">
                  {locationAddress || "Google Maps Location"}
                </p>
              </div>
            </div>

            {/* Empty state for no price data - matching LocationMarker style */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1.5">
                <h4 className="text-xs font-bold text-gray-800">Available Items</h4>
                <span className="text-[9px] sm:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  0 items
                </span>
              </div>

              {/* Empty state message */}
              <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-1 pr-1">
                <div className="text-[10px] sm:text-xs text-gray-500 text-center py-3 bg-gray-50 rounded-md">
                  <span className="material-icons text-gray-400 mb-1 text-sm">info</span>
                  <div>No price data available</div>
                </div>
              </div>
            </div>

            {/* Add Price Data Button - matching LocationMarker style */}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <AddDataModal
                trigger={
                  <Button size="sm" className="w-full text-xs py-2 h-8">
                    <span className="material-icons text-sm mr-1">add</span>
                    Add New Price Data
                  </Button>
                }
                initialLocation={{
                  name: locationName,
                  address: locationAddress,
                  latitude: clickedPosition.lat,
                  longitude: clickedPosition.lng,
                  // We don't have direct access to place_id here, but the modal will handle it
                }}
              />
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
