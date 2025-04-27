import { useEffect, useRef, useState } from "react";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

// Global script loaded flag
let googleMapsScriptLoaded = false;

declare global {
  interface Window {
    initLocationPickerMap: () => void;
  }
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set initial position to center of Bangladesh if not provided
  const initialPosition = {
    lat: latitude || 23.685, // Default to center of Bangladesh
    lng: longitude || 90.3563,
  };

  // Load Google Maps API
  useEffect(() => {
    // Skip if already initialized or if the container isn't available
    if (googleMapRef.current || !mapRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError("Google Maps API key is missing");
      return;
    }

    // Function to initialize the map
    function initializeMap() {
      try {
        if (!mapRef.current || !window.google || !window.google.maps) {
          console.warn("Google Maps not fully loaded or map container not available");
          return;
        }

        // Verify Map constructor exists
        if (typeof window.google.maps.Map !== "function") {
          console.error("Google Maps Map constructor not available yet");
          setTimeout(initializeMap, 200); // Try again after a delay
          return;
        }

        // Create the map
        const mapOptions = {
          center: initialPosition,
          zoom: 7,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        googleMapRef.current = map;

        // Create initial marker if coordinates are provided
        if (latitude && longitude) {
          markerRef.current = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map,
            draggable: true,
            title: "Your selected location",
          });

          // Add drag end listener to update coordinates
          markerRef.current.addListener("dragend", function() {
            const position = markerRef.current?.getPosition();
            if (position) {
              onLocationChange(position.lat(), position.lng());
            }
          });
        }

        // Add click listener to the map
        map.addListener("click", function(event: google.maps.MapMouseEvent) {
          const latLng = event.latLng;
          if (!latLng) return;
          
          // Update or create the marker
          if (markerRef.current) {
            markerRef.current.setPosition(latLng);
          } else {
            markerRef.current = new window.google.maps.Marker({
              position: latLng,
              map,
              draggable: true,
              title: "Your selected location",
            });

            // Add drag end listener to update coordinates
            markerRef.current.addListener("dragend", function() {
              const position = markerRef.current?.getPosition();
              if (position) {
                onLocationChange(position.lat(), position.lng());
              }
            });
          }

          // Notify parent component
          onLocationChange(latLng.lat(), latLng.lng());
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setMapError("Failed to initialize map");
      }
    }

    // Function to load the Google Maps API
    function loadGoogleMapsApi() {
      // If API is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // If script is already being loaded, wait for it
      if (googleMapsScriptLoaded) {
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            initializeMap();
          }
        }, 100);

        // Set a timeout to stop checking
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.google || !window.google.maps) {
            setMapError("Google Maps API took too long to load");
          }
        }, 10000);

        return;
      }

      // Mark as loading
      googleMapsScriptLoaded = true;

      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initLocationPickerMap&v=weekly`;
      script.async = true;
      script.defer = true;

      // Define callback function globally
      window.initLocationPickerMap = function () {
        // Maps API is now fully loaded and ready to use
        setTimeout(initializeMap, 100); // Small delay to ensure everything is ready
      };

      // Add error event handler for the script
      script.addEventListener("error", () => {
        setMapError("Failed to load Google Maps API");
        googleMapsScriptLoaded = false;
      });

      // Add script to page
      document.head.appendChild(script);
    }

    loadGoogleMapsApi();

    // Cleanup
    return () => {
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, onLocationChange, initialPosition]);

  // Update marker when coordinates change externally
  useEffect(() => {
    if (!googleMapRef.current || !latitude || !longitude) return;

    const position = { lat: latitude, lng: longitude };
    
    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        draggable: true,
        title: "Your selected location",
      });

      // Add drag end listener
      markerRef.current.addListener("dragend", function() {
        const newPosition = markerRef.current?.getPosition();
        if (newPosition) {
          onLocationChange(newPosition.lat(), newPosition.lng());
        }
      });
    }

    // Center map on the marker
    googleMapRef.current.panTo(position);
  }, [latitude, longitude, onLocationChange]);

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

      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ display: mapError ? "none" : "block" }}
      />
      
      <div className="text-xs text-muted-foreground mt-2">
        Click on the map to set a location or drag the marker to move it
      </div>
    </div>
  );
} 