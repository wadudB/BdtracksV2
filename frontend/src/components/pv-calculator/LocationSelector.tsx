// Location Selector Component

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationData } from '@/types/pv-calculator';
import { BANGLADESH_DISTRICTS } from '@/data/bangladesh-solar-data';
import { usePVCalculator } from '@/contexts/pv-calculator-context';

interface LocationSelectorProps {
  onLocationSelected?: (location: LocationData) => void;
}

export function LocationSelector({ onLocationSelected }: LocationSelectorProps) {
  const { updateLocation, nextStep } = usePVCalculator();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customLocation, setCustomLocation] = useState({
    lat: '',
    lng: '',
    address: ''
  });

  const handleDistrictSelect = (districtName: string) => {
    const district = BANGLADESH_DISTRICTS.find(d => d.district === districtName);
    if (district) {
      setSelectedDistrict(districtName);
      updateLocation(district);
      onLocationSelected?.(district);
    }
  };

  const handleCustomLocationSubmit = () => {
    if (customLocation.lat && customLocation.lng && customLocation.address) {
      const location: LocationData = {
        coordinates: {
          lat: parseFloat(customLocation.lat),
          lng: parseFloat(customLocation.lng)
        },
        address: customLocation.address,
        district: 'Custom',
        division: 'Custom',
        solarIrradiance: 4.8, // Default value
        peakSunHours: 5.2,
        seasonalVariation: 0.25
      };
      updateLocation(location);
      onLocationSelected?.(location);
    }
  };

  const filteredDistricts = BANGLADESH_DISTRICTS.filter(district =>
    district.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const continueToNext = () => {
    if (selectedDistrict || (customLocation.lat && customLocation.lng)) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Location</h2>
        <p className="text-gray-600">
          Choose your location to get accurate solar irradiance data for your area
        </p>
      </div>

      {/* Quick District Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <Label className="text-lg font-semibold">Select from Bangladesh Districts</Label>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search districts or divisions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedDistrict} onValueChange={handleDistrictSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your district" />
            </SelectTrigger>
            <SelectContent>
              {filteredDistricts.map((district) => (
                <SelectItem key={district.district} value={district.district}>
                  <div className="flex flex-col">
                    <span className="font-medium">{district.district}</span>
                    <span className="text-sm text-gray-500">{district.division} Division</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDistrict && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Location Details</h3>
              {(() => {
                const district = BANGLADESH_DISTRICTS.find(d => d.district === selectedDistrict);
                return district ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">District:</span>
                      <p>{district.district}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Division:</span>
                      <p>{district.division}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Solar Irradiance:</span>
                      <p>{district.solarIrradiance} kWh/m²/day</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Peak Sun Hours:</span>
                      <p>{district.peakSunHours} hours/day</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </Card>

      {/* Custom Location Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Or Enter Custom Coordinates</Label>
          <p className="text-sm text-gray-600">
            If your location isn't listed, you can enter GPS coordinates manually
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="23.8103"
                value={customLocation.lat}
                onChange={(e) => setCustomLocation(prev => ({ ...prev, lat: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="90.4125"
                value={customLocation.lng}
                onChange={(e) => setCustomLocation(prev => ({ ...prev, lng: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Your address"
                value={customLocation.address}
                onChange={(e) => setCustomLocation(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          {customLocation.lat && customLocation.lng && customLocation.address && (
            <Button 
              onClick={handleCustomLocationSubmit}
              variant="outline"
              className="w-full"
            >
              Use Custom Location
            </Button>
          )}
        </div>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button 
          onClick={continueToNext}
          disabled={!selectedDistrict && !(customLocation.lat && customLocation.lng)}
          className="px-8 py-3"
        >
          Continue to Energy Analysis
        </Button>
      </div>
    </div>
  );
} 