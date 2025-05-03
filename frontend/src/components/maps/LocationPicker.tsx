import { useState, useCallback, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

// Marker component that can be dragged to update location
function DraggableMarker({
  position,
  onPositionChange,
}: {
  position: google.maps.LatLngLiteral;
  onPositionChange: (lat: number, lng: number) => void;
}) {
  return (
    <AdvancedMarker
      position={position}
      draggable={true}
      title="Your selected location"
      onDragEnd={(e) => {
        if (e.latLng) {
          onPositionChange(e.latLng.lat(), e.latLng.lng());
        }
      }}
    />
  );
}

// MapClickHandler component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const map = useMap();

  // Add click listener when component mounts
  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      }
    });

    // Clean up listener when component unmounts
    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, onMapClick]);

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Set initial position to center of Bangladesh if not provided
  const initialPosition = {
    lat: latitude || 23.685, // Default to center of Bangladesh
    lng: longitude || 90.3563,
  };

  // Current marker position
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(initialPosition);

  // Update marker when coordinates change externally
  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  // Handle map click
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setMarkerPosition({ lat, lng });
      onLocationChange(lat, lng);
    },
    [onLocationChange]
  );

  // Handle marker drag
  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      onLocationChange(lat, lng);
    },
    [onLocationChange]
  );

  // Check if API key is available
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-muted/30 text-muted-foreground">
        Google Maps API key is missing
      </div>
    );
  }

  return (
    <div className="w-full h-96 relative rounded-md overflow-hidden">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground">
          {mapError}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      <APIProvider
        apiKey={apiKey}
        onLoad={() => setIsLoading(false)}
        onError={(error: unknown) => {
          console.error("Google Maps API error:", error);
          setMapError(`Google Maps API error occurred`);
        }}
      >
        <Map
          defaultCenter={initialPosition}
          defaultZoom={7}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          mapId="location-picker-map"
          reuseMaps={true}
          colorScheme="LIGHT"
        >
          {/* Map click handler */}
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Show marker if we have coordinates */}
          {(latitude && longitude) || (markerPosition.lat && markerPosition.lng) ? (
            <DraggableMarker position={markerPosition} onPositionChange={handleMarkerDrag} />
          ) : null}
        </Map>
      </APIProvider>

      <div className="text-xs text-muted-foreground mt-2">
        Click on the map to set a location or drag the marker to move it
      </div>
    </div>
  );
}
