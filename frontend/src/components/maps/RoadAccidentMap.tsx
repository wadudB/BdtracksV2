import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { scaleQuantile, ScaleQuantile } from "d3-scale";
import { MapPin, Info, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";
import DashboardCard from "../DashboardCard";
import { Button } from "../ui/button";

interface GeoJsonData {
  id: string;
  name: string;
  lat: string;
  lon: string;
}

interface RoadAccidentMapProps {
  geojsonData: GeoJsonData[];
  accidentsByDistrict: Record<string, number>;
}

// Component to handle map resize
const MapResizeHandler = ({ isFullscreen }: { isFullscreen: boolean }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [isFullscreen, map]);

  return null;
};

const RoadAccidentMap: React.FC<RoadAccidentMapProps> = ({ geojsonData, accidentsByDistrict }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const colorScale: ScaleQuantile<string, number> = scaleQuantile<string>()
    .domain(Object.values(accidentsByDistrict).filter((val) => val > 0))
    .range([
      "#FEF2F2", // Very light red
      "#FECACA", // Light red
      "#FCA5A5", // Medium light red
      "#F87171", // Medium red
      "#EF4444", // Red
      "#DC2626", // Dark red
      "#B91C1C", // Very dark red
    ]);

  const getColor = (value: number): string => {
    if (value === 0) return "#F3F4F6"; // Gray for no accidents
    return colorScale(value) as string;
  };

  const calculateRadius = (accidentCount: number): number => {
    if (accidentCount === 0) return 3;
    return Math.min(Math.sqrt(accidentCount) * 3 + 4, 25); // Cap at 25px
  };

  const totalAccidents = Object.values(accidentsByDistrict).reduce((sum, val) => sum + val, 0);
  const maxAccidents = Math.max(...Object.values(accidentsByDistrict));
  const averageAccidents = totalAccidents / Object.keys(accidentsByDistrict).length;

  // Legend data
  const legendData = [
    { color: "#F3F4F6", label: "No accidents", range: "0" },
    { color: "#FEF2F2", label: "Very low", range: "1-10" },
    { color: "#FECACA", label: "Low", range: "11-50" },
    { color: "#FCA5A5", label: "Medium", range: "51-100" },
    { color: "#F87171", label: "High", range: "101-200" },
    { color: "#EF4444", label: "Very high", range: "201-500" },
    { color: "#DC2626", label: "Critical", range: "500+" },
  ];

  const mapHeight = isFullscreen ? "calc(100vh - 250px)" : "500px";

  return (
    <DashboardCard className={isFullscreen ? "fixed inset-4 z-50 overflow-auto" : ""}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Geographic Distribution</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="flex items-center gap-2"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" /> Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" /> Fullscreen
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground">Total Districts</div>
          <div className="text-lg font-bold text-foreground">{geojsonData?.length || 0}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground">Highest</div>
          <div className="text-lg font-bold text-destructive">{maxAccidents.toLocaleString()}</div>
        </div>
        <div className="text-center col-span-2 sm:col-span-1">
          <div className="text-sm font-medium text-muted-foreground">Average</div>
          <div className="text-lg font-bold text-foreground">
            {Math.round(averageAccidents).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          className="relative z-0 border border-border rounded-lg overflow-hidden"
          style={{ height: mapHeight }}
        >
          <MapContainer
            attributionControl={false}
            center={[23.685, 90.3563]}
            zoom={7.5}
            style={{
              height: "100%",
              width: "100%",
            }}
            className="z-0"
          >
            <MapResizeHandler isFullscreen={isFullscreen} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geojsonData &&
              geojsonData.map((district) => {
                const accidentCount = accidentsByDistrict[district.name.toLowerCase()] || 0;
                const radius = calculateRadius(accidentCount);
                return (
                  <CircleMarker
                    key={district.id}
                    center={[parseFloat(district.lat), parseFloat(district.lon)]}
                    radius={radius}
                    fillColor={getColor(accidentCount)}
                    color="white"
                    weight={2}
                    opacity={1}
                    fillOpacity={0.8}
                    eventHandlers={{
                      mouseover: () => setSelectedDistrict(district.name),
                      mouseout: () => setSelectedDistrict(null),
                    }}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -10]}
                      opacity={1}
                      className="custom-tooltip"
                    >
                      <div className="p-2">
                        <div className="font-semibold text-foreground">{district.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {accidentCount.toLocaleString()} accidents
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {accidentCount === 0
                            ? "No incidents"
                            : accidentCount > averageAccidents
                              ? "Above average"
                              : "Below average"}
                        </div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
          </MapContainer>
        </div>

        {/* Map Legend */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Legend</span>
            </div>
            <div className="space-y-1">
              {legendData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground min-w-0">
                    {item.label}
                    {isFullscreen && (
                      <span className="text-muted-foreground/70 ml-1">({item.range})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected District Info */}
        {selectedDistrict && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium text-foreground">{selectedDistrict}</div>
              <div className="text-xs text-muted-foreground">
                {(accidentsByDistrict[selectedDistrict.toLowerCase()] || 0).toLocaleString()}{" "}
                accidents
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-friendly district list for small screens */}
      <div className="block sm:hidden mt-4">
        <div className="text-sm font-medium text-foreground mb-2">District Summary</div>
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
          {geojsonData?.slice(0, 10).map((district) => {
            const accidentCount = accidentsByDistrict[district.name.toLowerCase()] || 0;
            return (
              <div
                key={district.id}
                className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm"
              >
                <span className="text-foreground">{district.name}</span>
                <span className="text-muted-foreground">{accidentCount.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
};

export default RoadAccidentMap;
