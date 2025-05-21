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
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

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
  onPlaceIdChange,
  onPoiIdChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressChange: (address: string) => void;
  regions: any[];
  onRegionChange: (regionId: string) => void;
  onNameChange: (name: string) => void;
  onPlaceIdChange: (placeId: string) => void;
  onPoiIdChange: (poiId: string) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

  // Map Component that handles places and markers
  const MapContent = () => {
    const map = useMap();
    const placesLib = useMapsLibrary("places");
    const geocodingLib = useMapsLibrary("geocoding");
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    // Initialize Places Autocomplete
    useEffect(() => {
      if (!placesLib || !map || !searchInputRef.current || autocomplete) return;

      try {
        const autoCompleteInstance = new placesLib.Autocomplete(searchInputRef.current, {
          fields: ["formatted_address", "geometry", "name", "place_id"],
          strictBounds: false,
        });

        setAutocomplete(autoCompleteInstance);

        // Bias autocomplete results toward map's current bounds
        map.addListener("bounds_changed", () => {
          if (autoCompleteInstance) {
            autoCompleteInstance.setBounds(map.getBounds() as google.maps.LatLngBounds);
          }
        });

        // Listen for place selection
        autoCompleteInstance.addListener("place_changed", () => {
          const place = autoCompleteInstance.getPlace();

          if (!place.geometry || !place.geometry.location) {
            toast.error(
              "Could not find details for this location. Please try another search term."
            );
            return;
          }

          // Update place ID if available
          if (place.place_id) {
            console.log("Place ID:", place.place_id);
            onPlaceIdChange(place.place_id);
          }

          // Update place name
          if (place.name) {
            onNameChange(place.name);
          }

          // Update address
          if (place.formatted_address) {
            onAddressChange(place.formatted_address);
          }

          // Update coordinates
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setMarkerPosition(position);
          onLocationChange(position.lat, position.lng);

          // Center map on the selected place
          map.panTo(position);
          map.setZoom(15);

          // Find nearest region
          findNearestRegion(position.lat, position.lng);

          // Clear the input field
          setSearchInput("");
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
        setMapError("Failed to initialize search functionality");
      }
    }, [placesLib, map]);

    // Handle map click
    useEffect(() => {
      if (!map || !geocodingLib) return;

      const clickListener = map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        // Check if this is a POI click (Point of Interest)
        const iconEvent = e as google.maps.IconMouseEvent;
        if (placesLib && iconEvent.placeId) {
          console.log("POI clicked:", iconEvent.placeId);
          // Save the POI ID
          onPoiIdChange(iconEvent.placeId);
          
          // Use PlacesService to get details for the POI
          const service = new placesLib.PlacesService(map as any);

          service.getDetails(
            {
              placeId: iconEvent.placeId,
              fields: ["name", "formatted_address", "geometry", "place_id"],
            },
            (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.geometry?.location
              ) {
                // Update form with POI details
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                // Update coordinates and marker
                setMarkerPosition({ lat, lng });
                onLocationChange(lat, lng);

                // Find nearest region
                findNearestRegion(lat, lng);

                // Update place ID
                if (place.place_id) {
                  onPlaceIdChange(place.place_id);
                }

                // Update name and address
                if (place.name) {
                  onNameChange(place.name);
                }

                if (place.formatted_address) {
                  onAddressChange(place.formatted_address);
                }

                // Center map on the POI location
                map.panTo({ lat, lng });
                map.setZoom(15);
              } else {
                console.error("Place details request failed:", status);
                // Fall back to regular click handling
                if (e.latLng) {
                  // feature disabled for now
                  // handleRegularClick(e.latLng);
                }
              }
            }
          );
        } else if (e.latLng) {
          // This is a regular map click
          // feature disabled for now
          // handleRegularClick(e.latLng);
        }
      });

      // Handle regular map click (not on a POI)
      // feature disabled for now
      // const handleRegularClick = async (latLng: google.maps.LatLng) => {
      //   const lat = latLng.lat();
      //   const lng = latLng.lng();

      //   // Update marker position
      //   setMarkerPosition({ lat, lng });
      //   onLocationChange(lat, lng);

      //   // Find nearest region
      //   findNearestRegion(lat, lng);

      //   // Get address using Geocoder
      //   try {
      //     if (geocodingLib) {
      //       const geocoder = new geocodingLib.Geocoder();
      //       const response = await geocoder.geocode({ location: { lat, lng } });

      //       if (response.results?.[0]) {
      //         const address = response.results[0].formatted_address;
      //         onAddressChange(address);

      //         // Try to extract a place name from the address
      //         const addressParts = address.split(",");
      //         if (addressParts.length > 0 && addressParts[0].trim()) {
      //           onNameChange(addressParts[0].trim());
      //         }
      //       }
      //     }
      //   } catch (error) {
      //     console.error("Geocoder failed:", error);
      //     toast.error("Failed to get address for this location");
      //   }
      // };

      return () => {
        google.maps.event.removeListener(clickListener);
      };
    }, [map, geocodingLib, placesLib, findNearestRegion]);

    // Handle marker drag
    const handleMarkerDrag = (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setMarkerPosition({ lat, lng });
      onLocationChange(lat, lng);
      findNearestRegion(lat, lng);
    };

    // Handle marker drag end
    const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !geocodingLib) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // Update coordinates in form
      onLocationChange(lat, lng);

      // Find nearest region
      findNearestRegion(lat, lng);

      if (placesLib && map) {
        // First try Places API to get rich data
        try {
          const service = new placesLib.PlacesService(map as any);

          service.nearbySearch(
            {
              location: e.latLng,
              radius: 50, // Small radius to get only places very close to the dragged point
            },
            (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results.length > 0
              ) {
                // Get details of the first place found
                service.getDetails(
                  {
                    placeId: results[0].place_id as string,
                    fields: ["name", "formatted_address", "place_id"],
                  },
                  (place, detailsStatus) => {
                    if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && place) {
                      // Log place ID if available
                      if (place.place_id) {
                        console.log("Nearby place ID after drag:", place.place_id);
                        onPlaceIdChange(place.place_id);
                      }

                      // We found a place, update the name and address
                      if (place.name) {
                        onNameChange(place.name);
                      }
                      if (place.formatted_address) {
                        onAddressChange(place.formatted_address);
                      }
                    } else {
                      // If no place found or details failed, fall back to geocoding
                      if (e.latLng) {
                        fallbackToGeocoding(e.latLng);
                      }
                    }
                  }
                );
              } else {
                // If no nearby places found, fall back to geocoding
                if (e.latLng) {
                  fallbackToGeocoding(e.latLng);
                }
              }
            }
          );
        } catch (error) {
          console.error("Error in places service:", error);
          if (e.latLng) {
            fallbackToGeocoding(e.latLng);
          }
        }
      } else {
        // If Places API not available, use geocoding
        if (e.latLng) {
          fallbackToGeocoding(e.latLng);
        }
      }

      // Fallback to geocoding when places API fails or isn't available
      async function fallbackToGeocoding(latLng: google.maps.LatLng) {
        if (!geocodingLib) return;

        try {
          const geocoder = new geocodingLib.Geocoder();
          const response = await geocoder.geocode({
            location: { lat: latLng.lat(), lng: latLng.lng() },
          });

          if (response.results?.[0]) {
            const address = response.results[0].formatted_address;
            onAddressChange(address);

            // Try to extract a place name from the address
            const addressParts = address.split(",");
            if (addressParts.length > 0 && addressParts[0].trim()) {
              onNameChange(addressParts[0].trim());
            }
          }
        } catch (error) {
          console.error("Geocoder failed:", error);
          toast.error("Failed to get address for this location");
        }
      }
    };

    return markerPosition ? (
      <AdvancedMarker
        position={markerPosition}
        draggable={true}
        onDrag={handleMarkerDrag}
        onDragEnd={handleMarkerDragEnd}
      />
    ) : null;
  };

  // If API key is missing
  if (!apiKey) {
    return (
      <div className="space-y-3">
        <div className="w-full h-[250px] relative rounded-md overflow-hidden border bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Google Maps API key is missing.</p>
        </div>
      </div>
    );
  }

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
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground z-10">
            {mapError}
          </div>
        )}

        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{ lat: latitude || 23.8041, lng: longitude || 90.4152 }}
            defaultZoom={10}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId="interactive-map"
          >
            <MapContent />
          </Map>
        </APIProvider>
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
      location: {
        ...prevForm.location,
        latitude: lat,
        longitude: lng,
      },
    }));
  };

  // Handle address updates
  const handleAddressChange = (address: string) => {
    console.log("handleAddressChange called with:", address);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      location: {
        ...prevForm.location,
        address,
      },
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
      location: {
        ...prevForm.location,
        name,
      },
    }));
  };

  // Handle place ID updates
  const handlePlaceIdChange = (placeId: string) => {
    console.log("handlePlaceIdChange called with:", placeId);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      location: {
        ...prevForm.location,
        place_id: placeId,
      },
    }));
  };

  // Handle POI ID updates
  const handlePoiIdChange = (poiId: string) => {
    console.log("handlePoiIdChange called with:", poiId);
    setPriceForm((prevForm: typeof priceForm) => ({
      ...prevForm,
      location: {
        ...prevForm.location,
        poi_id: poiId,
      },
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
          latitude={priceForm.location?.latitude || null}
          longitude={priceForm.location?.longitude || null}
          onLocationChange={handleLocationChange}
          onAddressChange={handleAddressChange}
          regions={regions}
          onRegionChange={handleRegionChange}
          onNameChange={handleNameChange}
          onPlaceIdChange={handlePlaceIdChange}
          onPoiIdChange={handlePoiIdChange}
        />

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={priceForm.location?.name || ""}
            onChange={(e) => 
              setPriceForm({
                ...priceForm,
                location: {
                  ...priceForm.location,
                  name: e.target.value,
                },
              })
            }
          />
        </div>

        {/* Address Display Section */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={priceForm.location?.address || ""}
            className="bg-muted text-sm"
            readOnly
          />
        </div>

        {/* Place ID & POI ID (hidden but stored) */}
        <div className={`grid grid-cols-1 gap-4 ${!isMobile ? "sm:grid-cols-2" : ""} mt-3 hidden`}>
          <div className="space-y-2">
            <Label htmlFor="place_id">Place ID</Label>
            <Input
              id="place_id"
              value={priceForm.location?.place_id || ""}
              className="bg-muted text-sm"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="poi_id">POI ID</Label>
            <Input
              id="poi_id"
              value={priceForm.location?.poi_id || ""}
              className="bg-muted text-sm"
              readOnly
            />
          </div>
        </div>

        {/* Coordinate Display Section */}
        <div className={`grid grid-cols-1 gap-4 ${!isMobile ? "sm:grid-cols-2" : ""} mt-3`}>
          <div className="space-y-2 hidden">
            <Label htmlFor="latitude">Latitude</Label>
            <div className="flex items-center gap-2">
              <Input
                id="latitude"
                value={priceForm.location?.latitude === null ? "" : priceForm.location?.latitude}
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
                value={priceForm.location?.longitude === null ? "" : priceForm.location?.longitude}
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
    commodity: commodity,
    location: {
      name: "",
      address: "",
      latitude: null as number | null,
      longitude: null as number | null,
      place_id: "",
      poi_id: "",
    }
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

    // Check if location data is valid
    if (!priceForm.location?.name || !priceForm.location?.latitude || !priceForm.location?.longitude) {
      toast.error("Please select a valid location on the map");
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
        recorded_at: priceForm.recordedAt,
        location: {
          name: priceForm.location.name,
          address: priceForm.location.address,
          latitude: priceForm.location.latitude!,
          longitude: priceForm.location.longitude!,
          place_id: priceForm.location.place_id,
          poi_id: priceForm.location.poi_id,
        }
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
            location: {
              name: "",
              address: "",
              latitude: null,
              longitude: null,
              place_id: "",
              poi_id: "",
            }
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
