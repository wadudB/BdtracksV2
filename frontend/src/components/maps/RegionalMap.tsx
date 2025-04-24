import { useEffect, useRef, useState } from "react";
import { Region } from "@/types";

interface RegionalMapProps {
  regions?: Region[];
  priceData: {
    regionId: string | number;
    regionName?: string;
    price: number;
    change?: number;
  }[];
  selectedCommodity: string;
  isLoading?: boolean;
}

// Map of Bangladesh regions with coordinates
const DEFAULT_REGIONS: Region[] = [
  { id: "dhaka", name: "Dhaka", lat: 23.9535742, lng: 90.14949879999999 },
  { id: "chittagong", name: "Chittagong", lat: 23.1793157, lng: 91.9881527 },
  { id: "rajshahi", name: "Rajshahi", lat: 24.7105776, lng: 88.94138650000001 },
  { id: "khulna", name: "Khulna", lat: 22.8087816, lng: 89.24671909999999 },
  { id: "barisal", name: "Barisal", lat: 22.3811131, lng: 90.3371889 },
  { id: "sylhet", name: "Sylhet", lat: 24.7049811, lng: 91.67606909999999 },
  { id: "rangpur", name: "Rangpur", lat: 25.8483388, lng: 88.94138650000001 },
  { id: "mymensingh", name: "Mymensingh", lat: 24.71362, lng: 90.4502368 },
];

// Global script loaded flag
let googleMapsScriptLoaded = false;

// Define types for Google Maps objects
interface ExtendedInfoWindow extends google.maps.InfoWindow {
  close(): void;
}

interface MarkerWithInfoWindow extends google.maps.Marker {
  infoWindow?: ExtendedInfoWindow;
}

// Declare global function for Google Maps callback
declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

export default function RegionalMap({
  regions = DEFAULT_REGIONS,
  priceData = [],
  selectedCommodity,
  isLoading = false,
}: RegionalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerWithInfoWindow[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  
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
          center: { lat: 23.685, lng: 90.3563 }, // Center of Bangladesh
          zoom: 7,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        };

        googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initGoogleMaps&v=weekly`;
      script.async = true;
      script.defer = true;

      // Define callback function globally
      window.initGoogleMaps = function () {
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
    };
  }, []);

  // Create markers when data or map changes
  useEffect(() => {
    // Skip if map isn't initialized or if isLoading
    if (!googleMapRef.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Skip if no price data
    if (priceData.length === 0) {
      console.log("No price data available to display markers");
      return;
    }

    console.log("Price data received:", priceData);

    // Process regions and create markers
    regions.forEach((region) => {
      if (!region.id || !region.lat || !region.lng) return;

      // Find the right price data by matching regionName instead of ID
      const priceEntry = priceData.find(p =>
        p.regionName && p.regionName.toLowerCase() === region.name.toLowerCase()
      );

      if (!priceEntry) {
        console.log(`No price data found for region: ${region.name}`);
        return;
      }

      const price = priceEntry.price;
      console.log(`Match found! Price: ${price} for region ${priceEntry.regionName}`);

      const map = googleMapRef.current;
      if (!map) return;

      try {
        // Create the marker
        const marker = new window.google.maps.Marker({
          position: { lat: region.lat, lng: region.lng },
          map,
          title: `${priceEntry.regionName}: ৳${price}`,
          label: {
            text: `৳${price}`,
            color: "white",
          },
        }) as MarkerWithInfoWindow;

        console.log(
          `Created marker for ${priceEntry.regionName} at ${region.lat},${region.lng} with price ৳${price}`
        );

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px;">${priceEntry.regionName}</h3>
              <p style="margin: 0; font-size: 14px;">
                <strong>${selectedCommodity}:</strong> ৳${price}
              </p>
            </div>
          `,
        }) as ExtendedInfoWindow;

        // Add click listener
        marker.addListener("click", () => {
          // Close all other info windows first
          markersRef.current.forEach((m) => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });

          // Open this info window
          infoWindow.open(map, marker);
        });

        // Store reference to info window on the marker
        marker.infoWindow = infoWindow;

        // Add to markers array
        markersRef.current.push(marker);
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });

    console.log(`Total markers created: ${markersRef.current.length}`);
  }, [regions, priceData, selectedCommodity, isLoading]);

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

      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ display: mapError ? "none" : "block" }}
      />
    </div>
  );
}
