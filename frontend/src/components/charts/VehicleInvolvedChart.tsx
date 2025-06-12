import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PieChart as PieChartIcon,
  BarChart3,
  List,
  Car,
  Truck,
  Bike,
  Bus,
  Grid3X3,
} from "lucide-react";
import VehicleTreemapChart from "./VehicleTreemapChart";

interface VehicleData {
  [key: string]: number;
}

interface VehicleInvolvedChartProps {
  vehiclesInvolved: VehicleData;
}

type ViewMode = "donut" | "bar" | "list" | "treemap";

// Modern color palette
const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F43F5E", // Rose
];

// Vehicle type icons mapping
const getVehicleIcon = (vehicleName: string) => {
  const name = vehicleName.toLowerCase();
  if (name.includes("bus")) return <Bus className="h-4 w-4" />;
  if (name.includes("truck") || name.includes("lorry")) return <Truck className="h-4 w-4" />;
  if (name.includes("bike") || name.includes("cycle") || name.includes("motorcycle"))
    return <Bike className="h-4 w-4" />;
  return <Car className="h-4 w-4" />;
};

const VehicleInvolvedChart: React.FC<VehicleInvolvedChartProps> = ({ vehiclesInvolved }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("donut");
  const [showAll, setShowAll] = useState(false);

  const processedData = useMemo(() => {
    const entries = Object.entries(vehiclesInvolved);
    entries.sort((a, b) => b[1] - a[1]);

    const total = entries.reduce((sum, [, count]) => sum + count, 0);

    return entries.map(([name, count], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count,
      percentage: ((count / total) * 100).toFixed(1),
      color: COLORS[index % COLORS.length],
      icon: getVehicleIcon(name),
    }));
  }, [vehiclesInvolved]);

  const displayData = showAll ? processedData : processedData.slice(0, 8);
  const totalAccidents = processedData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            {data.icon}
            <span className="font-medium text-foreground">{data.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.value} accidents ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderDonutChart = () => (
    <div className="space-y-4 m-0">
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1000}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalAccidents}</p>
            <p className="text-sm text-muted-foreground">Total Accidents</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-20 overflow-y-auto">
        {displayData.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex items-center space-x-1 flex-1 min-w-0">
              {item.icon}
              <span className="text-sm font-medium truncate">{item.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {item.percentage}%
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBarChart = () => (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={displayData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            className="text-xs"
            angle={-90}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs" />
          <Tooltip content={renderCustomTooltip} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {displayData.map((item, index) => (
        <div
          key={index}
          className="space-y-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center space-x-2">
                {item.icon}
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">{item.value}</span>
              <Badge variant="outline" className="text-xs">
                {item.percentage}%
              </Badge>
            </div>
          </div>
          <Progress value={parseFloat(item.percentage)} className="h-2" />
        </div>
      ))}
    </div>
  );

  const renderTreemap = () => (
    <div className="space-y-4">
      <VehicleTreemapChart vehiclesInvolved={vehiclesInvolved} />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Size represents accident frequency • Hover for details
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case "donut":
        return renderDonutChart();
      case "bar":
        return renderBarChart();
      case "list":
        return renderListView();
      case "treemap":
        return renderTreemap();
      default:
        return renderDonutChart();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with view controls */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        {/* <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Vehicle Types
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {processedData.length} vehicle types • {totalAccidents} total accidents
          </p>
        </div> */}

        <div className="flex items-center space-x-1 overflow-x-auto">
          <Button
            variant={viewMode === "donut" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("donut")}
            className="flex items-center space-x-1 flex-shrink-0"
          >
            <PieChartIcon className="h-3 w-3" />
            <span className="hidden sm:inline">Donut</span>
          </Button>
          <Button
            variant={viewMode === "treemap" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("treemap")}
            className="flex items-center space-x-1 flex-shrink-0"
          >
            <Grid3X3 className="h-3 w-3" />
            <span className="hidden sm:inline">Treemap</span>
          </Button>
          <Button
            variant={viewMode === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("bar")}
            className="flex items-center space-x-1 flex-shrink-0"
          >
            <BarChart3 className="h-3 w-3" />
            <span className="hidden sm:inline">Bar</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center space-x-1 flex-shrink-0"
          >
            <List className="h-3 w-3" />
            <span className="hidden sm:inline">List</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      {renderContent()}

      {/* Show more/less toggle - only for donut, bar, and list views */}
      {viewMode !== "treemap" && processedData.length > 8 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showAll ? "Show Less" : `Show All ${processedData.length} Types`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehicleInvolvedChart;
