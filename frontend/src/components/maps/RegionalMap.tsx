import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";

interface RegionalMapProps {
  priceData: {
    regionId: string | number;
    regionName?: string;
    price: number;
    change?: number;
    latitude?: number;
    longitude?: number;
  }[];
  selectedCommodity: string;
  isLoading?: boolean;
}

// Marker component with info window functionality
function RegionMarker({ 
  position, 
  price, 
  regionName,
  selectedCommodity,
  isActive,
  onClick,
  onInfoWindowClose 
}: { 
  position: google.maps.LatLngLiteral; 
  price: number; 
  regionName: string;
  regionId: string | number;
  selectedCommodity: string;
  isActive: boolean;
  onClick: () => void;
  onInfoWindowClose: () => void;
}) {
  // Use the useAdvancedMarkerRef hook to get a reference to the marker
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        title={`${regionName}: ৳${price}`}
        onClick={onClick}
      >
        <div className="bg-[#171717] text-white px-2 py-1 rounded text-sm font-medium">
          ৳{price}
        </div>
      </AdvancedMarker>
      
      {isActive && (
        <InfoWindow
          anchor={marker}
          onClose={onInfoWindowClose}
        >
          <div style={{ padding: "8px", maxWidth: "200px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{regionName}</h3>
            <p style={{ margin: "0", fontSize: "14px" }}>
              <strong>{selectedCommodity}:</strong> ৳{price}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function RegionalMap({
  priceData = [],
  selectedCommodity,
  isLoading = false,
}: RegionalMapProps) {
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | number | null>(null);

  // Check if API key is available
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground">
        Google Maps API key is missing
      </div>
    );
  }

  // Handle marker click - set the active marker or toggle if the same marker
  const handleMarkerClick = useCallback((regionId: string | number) => {
    setActiveMarkerId(current => current === regionId ? null : regionId);
  }, []);

  // Handle info window close
  const handleInfoWindowClose = useCallback(() => {
    setActiveMarkerId(null);
  }, []);

  return (
    <div className="w-full h-full relative">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground">
          {mapError}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map data...</p>
          </div>
        </div>
      )}

      <APIProvider 
        apiKey={apiKey}
        onError={(error: unknown) => {
          console.error('Google Maps API error:', error);
          setMapError(`Google Maps API error occurred`);
        }}
      >
        <Map
          defaultCenter={{ lat: 23.685, lng: 90.3563 }} // Center of Bangladesh
          defaultZoom={7}
          gestureHandling={"none"}
          disableDefaultUI={true}
          mapId="bangladesh-regional-map"
          reuseMaps={true}
          colorScheme="LIGHT"
        >
          {!isLoading && priceData.map((region) => {
            // Skip regions without coordinates
            if (!region.latitude || !region.longitude) {
              console.log(`Missing coordinates for region: ${region.regionName || region.regionId}`);
              return null;
            }

            const regionName = region.regionName || `Region ${region.regionId}`;
            
            return (
              <RegionMarker
                key={region.regionId}
                regionId={region.regionId}
                position={{ lat: region.latitude, lng: region.longitude }}
                price={region.price}
                regionName={regionName}
                selectedCommodity={selectedCommodity}
                isActive={activeMarkerId === region.regionId}
                onClick={() => handleMarkerClick(region.regionId)}
                onInfoWindowClose={handleInfoWindowClose}
              />
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
