import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Commodity } from "@/types";
import { toast } from "sonner";
import { useCreatePriceRecord, useGetCommodityDropdown, useGetRegions } from "@/hooks/useQueries";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Search } from "lucide-react";

declare global {
  interface Window {
    initMap: () => void;
  }
}

interface AddDataModalProps {
  trigger: React.ReactNode;
  commodity?: Commodity;
  onSuccess?: () => void;
}

// Type for dropdown commodities
interface CommodityDropdownItem {
  id: number;
  name: string;
  bengaliName?: string;
}

// Location Picker component with search functionality
function InteractiveMap({
  latitude,
  longitude,
  onLocationChange,
  onAddressChange,
  regions,
  onRegionChange,
  onNameChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressChange: (address: string) => void;
  regions: any[];
  onRegionChange: (regionId: string) => void;
  onNameChange: (name: string) => void;
}) {
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  // const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Function to clear any existing marker
  const clearMarkers = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    // setMarker(null);
  }, []);

  // Helper function to find nearest region to the selected point
  const findNearestRegion = useCallback(
    (latitude: number, longitude: number) => {
      if (!regions || regions.length === 0) return;

      // Find the closest region based on coordinates
      let closestRegion = regions[0];
      let minDistance = Number.MAX_VALUE;

      regions.forEach((region) => {
        if (region.latitude && region.longitude) {
          const distance = calculateDistance(
            latitude,
            longitude,
            region.latitude,
            region.longitude
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region;
          }
        }
      });

      // Update the region if we found a match
      if (closestRegion && closestRegion.id) {
        onRegionChange(
          typeof closestRegion.id === "number" ? closestRegion.id.toString() : closestRegion.id
        );
      }
    },
    [regions, onRegionChange]
  );

  // Haversine formula to calculate distance between two points
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    },
    []
  );

  // Handle marker drag end event
  const handleMarkerDragEnd = () => {
    if (!markerRef.current) return;

    const position = markerRef.current.getPosition();
    if (!position) return;

    const newLat = position.lat();
    const newLng = position.lng();

    // Update coordinates
    onLocationChange(newLat, newLng);

    // Use Places service to get location information
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      
      // Use nearby search to find places near the dragged location
      service.nearbySearch({
        location: position,
        radius: 50, // Small radius to get only places very close to the dragged point
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          // Get details of the first place found
          service.getDetails({
            placeId: results[0].place_id as string, // Explicitly cast to string
            fields: ['name', 'formatted_address']
          }, (place, detailsStatus) => {
            if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && place) {
              // We found a place, update the name and address
              if (place.name) {
                onNameChange(place.name);
              }
              if (place.formatted_address) {
                onAddressChange(place.formatted_address);
              }
            } else {
              // If no place found or details failed, fall back to geocoding
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location: position }, (results, status) => {
                if (status === "OK" && results?.[0]) {
                  const address = results[0].formatted_address;
                  onAddressChange(address);
                  
                  // Try to extract a place name from the address
                  const addressParts = address.split(',');
                  if (addressParts.length > 0 && addressParts[0].trim()) {
                    onNameChange(addressParts[0].trim());
                  }
                } else {
                  console.error("Geocoder failed after drag:", status);
                  toast.error("Failed to get address for this location");
                }
              });
            }
          });
        } else {
          // If no place found, fall back to geocoding
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const address = results[0].formatted_address;
              onAddressChange(address);
              
              // Try to extract a place name from the address
              const addressParts = address.split(',');
              if (addressParts.length > 0 && addressParts[0].trim()) {
                onNameChange(addressParts[0].trim());
              }
            } else {
              console.error("Geocoder failed after drag:", status);
              toast.error("Failed to get address for this location");
            }
          });
        }
      });
    }

    // Find nearest region
    findNearestRegion(newLat, newLng);
  };

  // Function to handle marker creation and cleanup
  const createMarker = (
    position: google.maps.LatLng | google.maps.LatLngLiteral,
    title?: string,
    mapInstance?: google.maps.Map,
    placeName?: string
  ): google.maps.Marker | null => {
    // Use the passed map instance or fall back to the state map
    const mapToUse = mapInstance || map;

    if (!mapToUse) {
      console.error("Map not initialized yet");
      return null;
    }

    try {
      // Remove existing marker if there's one
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Create the new marker
      const marker = new google.maps.Marker({
        position,
        map: mapToUse,
        title: title || "Selected location",
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      // Store the marker reference
      markerRef.current = marker;

      // Add listener for drag end to update coordinates
      marker.addListener("dragend", handleMarkerDragEnd);

      // Get location details from marker position
      const latlng = marker.getPosition()!;
      onLocationChange(latlng.lat(), latlng.lng());

      // Find nearest region for region dropdown
      findNearestRegion(latlng.lat(), latlng.lng());

      // If placeName is provided, use it directly and update the name field
      if (placeName) {
        onAddressChange(title || "");
        onNameChange(placeName);
        return marker;
      }

      // Get address for these coordinates - this is now handled directly in the map click event 
      // or the handleMarkerDragEnd function to ensure we properly extract place names
      // We only use this for initial marker placement and search results

      // Center and zoom map to marker
      mapToUse.setCenter(position);
      mapToUse.setZoom(15);

      return marker;
    } catch (error) {
      console.error("Error creating marker:", error);
      toast.error("Failed to create marker");
      return null;
    }
  };

  // Load the map
  useEffect(() => {
    if (!mapRef) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError("Google Maps API key is missing");
      return;
    }

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API with Places library using the recommended async loading pattern
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initMap`;
      script.defer = true;

      // Define the callback function in the global scope
      window.initMap = initializeMap;

      script.onerror = () => setMapError("Failed to load Google Maps API");
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      // Clean up global callback if component unmounts before script loads
      if (window.initMap) {
        window.initMap = () => {}; // Replace with no-op function instead of delete
      }
    };
  }, [mapRef]);

  // Initialize the map
  function initializeMap() {
    if (!mapRef || !window.google || !window.google.maps) return;

    try {
      console.log("Initializing map");
      const newMap = new window.google.maps.Map(mapRef, {
        center: { lat: latitude || 23.8041, lng: longitude || 90.4152 },
        zoom: 10,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        scrollwheel: true,
      });

      // Set the map state right away
      setMap(newMap);

      // Create initial marker if latitude and longitude are provided
      if (latitude && longitude) {
        console.log("Creating initial marker at:", latitude, longitude);
        const initialPosition = { lat: latitude, lng: longitude };
        createMarker(initialPosition, undefined, newMap);

        // Pan and zoom to the marker location
        newMap.setCenter(initialPosition);
        newMap.setZoom(15);
      }

      // Set up our own click listener that works with InfoWindow
      newMap.addListener("click", (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        // Check if the event has a placeId (indicating a click on a POI icon)
        const iconEvent = e as google.maps.IconMouseEvent;
        if (iconEvent.placeId) {
          console.log("POI clicked:", iconEvent.placeId);
          // Use PlacesService to get details for the POI
          const service = new google.maps.places.PlacesService(newMap);
          service.getDetails({
            placeId: iconEvent.placeId,
            fields: ['name', 'formatted_address', 'geometry']
          }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
              // Update form with POI details
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              onLocationChange(lat, lng);
              findNearestRegion(lat, lng);
              if (place.name) {
                onNameChange(place.name);
              }
              if (place.formatted_address) {
                onAddressChange(place.formatted_address);
              }
              
              // Create marker at the POI location
              if (markerRef.current) {
                markerRef.current.setMap(null);
              }
              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: newMap,
                title: place.name,
                draggable: true,
                animation: google.maps.Animation.DROP,
              });
              markerRef.current = marker;
              marker.addListener("dragend", handleMarkerDragEnd);
              newMap.setCenter(place.geometry.location);
              newMap.setZoom(15);
            } else {
              console.error("Place details request failed:", status);
              // Optionally fall back to geocoding if getDetails fails
              if (e.latLng) {
                fallbackToGeocoding(e.latLng);
              }
            }
          });
        } else if (e.latLng) {
          // Handle clicks on empty map space (no placeId)
          console.log("Empty map space clicked at:", e.latLng.lat(), e.latLng.lng());
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onLocationChange(lat, lng);
          findNearestRegion(lat, lng);

          // Create marker at the clicked location
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          const marker = new google.maps.Marker({
            position: e.latLng,
            map: newMap,
            draggable: true,
            animation: google.maps.Animation.DROP,
          });
          markerRef.current = marker;
          marker.addListener("dragend", handleMarkerDragEnd);
          newMap.setCenter(e.latLng);
          newMap.setZoom(15);

          // Fall back to geocoding for address/name
          fallbackToGeocoding(e.latLng);
        }
      });

      // Function to fall back to geocoding when no place is found or click is on empty space
      const fallbackToGeocoding = (location: google.maps.LatLng) => {
        if (!location) return; // Add null check for location
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const address = results[0].formatted_address;
            onAddressChange(address);
            
            // Try to extract a place name from the address
            // First try to get the first part of the address
            const addressParts = address.split(',');
            if (addressParts.length > 0 && addressParts[0].trim()) {
              onNameChange(addressParts[0].trim());
            }
          } else {
            console.error("Geocoder failed:", status);
          }
        });
      };

      // Initialize Autocomplete instead of SearchBox
      try {
        console.log("Setting up autocomplete");
        const input = document.getElementById("map-search-input") as HTMLInputElement;

        if (!input) {
          console.error("Could not find map-search-input element");
          return;
        }

        if (!window.google.maps.places) {
          console.error("Google Maps Places library not loaded");
          return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          fields: ["formatted_address", "geometry", "name"],
          strictBounds: false,
        });

        // Store in state for potential future reference
        // setSearchBox(autocomplete as any); // Temporary type cast

        // Bias the autocomplete results toward the current map viewport
        newMap.addListener("bounds_changed", () => {
          autocomplete.setBounds(newMap.getBounds() as google.maps.LatLngBounds);
        });

        // Listen for place selection
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log("Place selected:", place);

          if (!place.geometry || !place.geometry.location) {
            console.error("Place has no geometry or location");
            toast.error(
              "Could not find details for this location. Please try another search term."
            );
            return;
          }

          console.log("Selected place:", place.name, place.formatted_address);

          // Get the place name and update the priceForm.name field
          if (place.name) {
            onNameChange(place.name);
          }

          // Update address
          if (place.formatted_address) {
            onAddressChange(place.formatted_address);
          }

          // Update coordinates
          const position = place.geometry.location;
          onLocationChange(position.lat(), position.lng());

          // Create marker at the selected place
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          
          const marker = new google.maps.Marker({
            position,
            map: newMap,
            title: place.name,
            draggable: true,
            animation: google.maps.Animation.DROP,
          });
          
          markerRef.current = marker;
          
          // Add listener for drag end to update coordinates
          marker.addListener("dragend", handleMarkerDragEnd);

          // Center map on the selected place with animation
          newMap.panTo(position);
          newMap.setZoom(15);

          // Find nearest region
          findNearestRegion(position.lat(), position.lng());

          // Clear the input field
          setSearchInput("");
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
    }
  }

  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id="map-search-input"
          placeholder="Search for a location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pr-10"
          ref={searchInputRef}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>

      <div className="w-full h-[250px] relative rounded-md overflow-hidden border">
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
          ref={setMapRef}
          className="w-full h-full"
          style={{ display: mapError ? "none" : "block" }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Click on the map to set a location or search for a place name. Region will be selected
        automatically.
      </p>
    </div>
  );
}

// Form content component to reuse across dialog and drawer
function FormContent({
  priceForm,
  setPriceForm,
  commodities = [],
  regions = [],
  handleSubmit,
  isSubmitting,
  isLoading,
  isMobile,
  // onClose,
}: {
  priceForm: any;
  setPriceForm: (form: any) => void;
  commodities: any[];
  regions: any[];
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isLoading: boolean;
  isMobile: boolean;
  onClose: () => void;
}) {
  // Handle location selection on the map
  const handleLocationChange = (lat: number, lng: number) => {
    console.log("handleLocationChange called with:", lat, lng);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      latitude: lat,
      longitude: lng,
    }));
  };

  // Handle address updates
  const handleAddressChange = (address: string) => {
    console.log("handleAddressChange called with:", address);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      address,
    }));
  };

  // Handle automatic region selection
  const handleRegionChange = (regionId: string) => {
    console.log("handleRegionChange called with:", regionId);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      regionId,
    }));
  };

  // Handle name updates when a place is selected
  const handleNameChange = (name: string) => {
    console.log("handleNameChange called with:", name);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      name,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid grid-cols-1 gap-4 ${!isMobile ? "sm:grid-cols-2" : ""}`}>
        <div className="space-y-2 w-auto">
          <Label htmlFor="commodity">Commodity</Label>
          {priceForm.commodity ? (
            <Input id="commodity" value={priceForm.commodity.name} disabled />
          ) : (
            <Select
              required
              value={priceForm.commodityId}
              onValueChange={(value) => setPriceForm({ ...priceForm, commodityId: value })}
            >
              <SelectTrigger id="commodity">
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent
                position={isMobile ? "popper" : "item-aligned"}
                className="max-h-[40vh]"
              >
                {commodities.map((commodity: CommodityDropdownItem) => (
                  <SelectItem key={commodity.id} value={commodity.id.toString()}>
                    {commodity.name} {commodity.bengaliName ? `(${commodity.bengaliName})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            required
            value={priceForm.regionId}
            onValueChange={(value) => setPriceForm({ ...priceForm, regionId: value })}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent position={isMobile ? "popper" : "item-aligned"} className="max-h-[40vh]">
              {regions.map((region) => (
                <SelectItem
                  key={typeof region.id === "number" ? region.id : region.id.toString()}
                  value={typeof region.id === "number" ? region.id.toString() : region.id}
                >
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${!isMobile ? "sm:grid-cols-2" : ""}`}>
        <div className="space-y-2">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            required
            type="number"
            value={priceForm.price}
            onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recordedAt">Date Recorded</Label>
          <Input
            id="recordedAt"
            required
            type="date"
            value={priceForm.recordedAt}
            onChange={(e) => setPriceForm({ ...priceForm, recordedAt: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Location</Label>

        {/* Interactive Map Section */}
        <InteractiveMap
          latitude={priceForm.latitude}
          longitude={priceForm.longitude}
          onLocationChange={handleLocationChange}
          onAddressChange={handleAddressChange}
          regions={regions}
          onRegionChange={handleRegionChange}
          onNameChange={handleNameChange}
        />

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={priceForm.name}
            onChange={(e) => setPriceForm({ ...priceForm, name: e.target.value })}
          />
        </div>

        {/* Address Display Section */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={priceForm.address || ""}
            className="bg-muted text-sm"
            readOnly
          />
        </div>

        {/* Coordinate Display Section */}
        <div className={`grid grid-cols-1 gap-4 ${!isMobile ? "sm:grid-cols-2" : ""} mt-3`}>
          <div className="space-y-2 hidden">
            <Label htmlFor="latitude">Latitude</Label>
            <div className="flex items-center gap-2">
              <Input
                id="latitude"
                value={priceForm.latitude === null ? "" : priceForm.latitude}
                className="bg-muted font-mono text-sm"
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2 hidden">
            <Label htmlFor="longitude">Longitude</Label>
            <div className="flex items-center gap-2">
              <Input
                id="longitude"
                value={priceForm.longitude === null ? "" : priceForm.longitude}
                className="bg-muted font-mono text-sm"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 hidden">
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          value={priceForm.source}
          onChange={(e) => setPriceForm({ ...priceForm, source: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={priceForm.notes}
          onChange={(e) => setPriceForm({ ...priceForm, notes: e.target.value })}
        />
      </div>

      {isMobile ? (
        <DrawerFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Price Record"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      ) : (
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Price Record"}
          </Button>
        </DialogFooter>
      )}
    </form>
  );
}

const AddDataModal: React.FC<AddDataModalProps> = ({ trigger, commodity, onSuccess }) => {
  // State for price record form
  const [priceForm, setPriceForm] = useState({
    commodityId: commodity?.id ? commodity.id.toString() : "",
    regionId: "",
    price: "",
    source: "submitted by user",
    notes: "",
    recordedAt: new Date().toISOString().split("T")[0],
    latitude: null as number | null,
    longitude: null as number | null,
    address: "",
    commodity: commodity,
    name: "",
  });

  const [open, setOpen] = useState<boolean>(false);

  // Use media query hook instead of state + resize listener
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Use React Query hooks
  const { data: commodities = [], isLoading: isLoadingCommodities } = useGetCommodityDropdown();
  const { data: regions = [], isLoading: isLoadingRegions } = useGetRegions();
  const { mutate: createPriceRecord, isPending: isSubmitting } = useCreatePriceRecord();

  // Determine if data is still loading
  const isLoading = isLoadingCommodities || isLoadingRegions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!priceForm.commodityId || !priceForm.regionId || !priceForm.price) {
      console.error("All fields are required");
      return;
    }

    // Create price record using the mutation
    createPriceRecord(
      {
        commodity_id: parseInt(priceForm.commodityId),
        region_id: parseInt(priceForm.regionId),
        price: parseFloat(priceForm.price),
        source: priceForm.source,
        notes: priceForm.notes,
        address: priceForm.address,
        recorded_at: priceForm.recordedAt,
        latitude: priceForm.latitude,
        longitude: priceForm.longitude,
        name: priceForm.name,
      },
      {
        onSuccess: () => {
          // Get the selected commodity name for the success message
          const selectedCommodity = commodities.find(
            (c: CommodityDropdownItem) => c.id.toString() === priceForm.commodityId
          );
          const commodityName = selectedCommodity ? selectedCommodity.name : priceForm.commodityId;

          toast.success(`Added price record: ৳${priceForm.price} for ${commodityName}`);

          // Close modal and reset form after successful submission
          setOpen(false);
          setPriceForm({
            ...priceForm,
            regionId: "",
            price: "",
            notes: "",
            name: "",
            address: "",
            latitude: null,
            longitude: null,
          });

          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
        },
      }
    );
  };

  // Use a Drawer component on mobile and Dialog on desktop
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle>Add Price Record</DrawerTitle>
            <DrawerDescription>
              {commodity
                ? `Enter new price information for ${commodity.name}`
                : "Enter new price information for a commodity"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <FormContent
              priceForm={priceForm}
              setPriceForm={setPriceForm}
              commodities={commodities}
              regions={regions}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isLoading={isLoading}
              isMobile={isMobile}
              onClose={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Price Record</DialogTitle>
          <DialogDescription>
            {commodity
              ? `Enter new price information for ${commodity.name}`
              : "Enter new price information for a commodity"}
          </DialogDescription>
        </DialogHeader>
        <FormContent
          priceForm={priceForm}
          setPriceForm={setPriceForm}
          commodities={commodities}
          regions={regions}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          isMobile={isMobile}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddDataModal;
