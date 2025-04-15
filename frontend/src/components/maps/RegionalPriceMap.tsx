import { useState, useEffect, useRef } from 'react';
import { Region } from '../../types';

interface RegionalPriceMapProps {
  regions?: Region[];
  selectedCommodity: string;
  priceData: {
    regionId: string;
    price: number;
  }[];
}

// These would be fetched from an API in a real app
const MOCK_REGIONS: Region[] = [
  { id: 'dhaka', name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { id: 'chittagong', name: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { id: 'sylhet', name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { id: 'rajshahi', name: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { id: 'khulna', name: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { id: 'barisal', name: 'Barisal', lat: 22.7000, lng: 90.3500 },
  { id: 'rangpur', name: 'Rangpur', lat: 25.7439, lng: 89.2752 },
  { id: 'mymensingh', name: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
];

export default function RegionalPriceMap({ regions = MOCK_REGIONS, selectedCommodity, priceData }: RegionalPriceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Get Google Maps API key from .env
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Initialize Google Maps
  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      document.head.removeChild(script);
    };
  }, [apiKey]);

  // Initialize map once API is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 23.685, lng: 90.3563 }, // Center of Bangladesh
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
  }, [mapLoaded]);

  // Update markers when map, regions, or price data changes
  useEffect(() => {
    if (!map || !priceData) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create new markers
    const newMarkers = regions.map(region => {
      const regionPrice = priceData.find(item => item.regionId === region.id);
      const price = regionPrice ? regionPrice.price : 0;
      
      // Determine marker color based on price (higher price = more red)
      const marker = new google.maps.Marker({
        position: { lat: region.lat, lng: region.lng },
        map,
        title: `${region.name}: ৳${price}`,
        label: {
          text: `৳${price}`,
          color: 'white',
          fontWeight: 'bold',
        },
      });
      
      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${region.name}</h3>
            <p><strong>${selectedCommodity}</strong>: ৳${price}</p>
          </div>
        `,
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
  }, [map, regions, priceData, selectedCommodity]);

  return (
    <div className="w-full h-full">
      {!apiKey && (
        <div className="w-full h-full flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">
            Google Maps API key not found. Please add it to your .env file.
          </p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ display: apiKey ? 'block' : 'none' }}
      />
    </div>
  );
} 