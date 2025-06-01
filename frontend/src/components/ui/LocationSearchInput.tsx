import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { toast } from "sonner";

interface LocationSearchInputProps {
  placeholder?: string;
  onLocationSelect: (location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    place_id?: string;
    poi_id?: string;
  }) => void;
  className?: string;
}

// Component that needs to be inside APIProvider
function LocationSearchCore({
  placeholder = "Search for a location...",
  onLocationSelect,
  className = "",
}: LocationSearchInputProps) {
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Initialize Places Autocomplete
  useEffect(() => {
    if (!placesLib || !searchInputRef.current || autocomplete) return;

    try {
      const autoCompleteInstance = new placesLib.Autocomplete(searchInputRef.current, {
        fields: ["formatted_address", "geometry", "name", "place_id"],
        strictBounds: false,
      });

      setAutocomplete(autoCompleteInstance);

      // Listen for place selection
      autoCompleteInstance.addListener("place_changed", () => {
        const place = autoCompleteInstance.getPlace();

        if (!place.geometry || !place.geometry.location) {
          toast.error("Could not find details for this location. Please try another search term.");
          return;
        }

        // Extract location data
        const locationData = {
          name: place.name || "",
          address: place.formatted_address || "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          place_id: place.place_id || "",
          poi_id: "", // POI ID is only available for POI clicks, not search
        };

        // Call the callback with location data
        onLocationSelect(locationData);

        // Clear the input field
        setSearchInput("");
      });
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      toast.error("Failed to initialize location search");
    }
  }, [placesLib, autocomplete, onLocationSelect]);

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={searchInputRef}
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pr-10"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    </div>
  );
}

// Main component that provides the API context
export function LocationSearchInput(props: LocationSearchInputProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`relative ${props.className || ""}`}>
        <Input
          placeholder="Location search unavailable (API key missing)"
          disabled
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <LocationSearchCore {...props} />
    </APIProvider>
  );
}
