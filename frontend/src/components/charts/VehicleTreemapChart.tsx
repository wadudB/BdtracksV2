import React, { useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

interface VehicleData {
  [key: string]: number;
}

interface TreemapChartProps {
  vehiclesInvolved: VehicleData;
}

// Custom color palette for treemap
const TREEMAP_COLORS = [
  "#3B82F6",
  "#1E40AF",
  "#60A5FA", // Blues
  "#EF4444",
  "#DC2626",
  "#F87171", // Reds
  "#10B981",
  "#059669",
  "#34D399", // Greens
  "#F59E0B",
  "#D97706",
  "#FBBF24", // Yellows
  "#8B5CF6",
  "#7C3AED",
  "#A78BFA", // Purples
  "#EC4899",
  "#DB2777",
  "#F472B6", // Pinks
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} accidents ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, value, percentage } = props;

  // Only show labels for larger rectangles and if we have valid data
  const showText = width > 60 && height > 40 && name;
  const showSubText = width > 100 && height > 60 && name && value !== undefined;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: props.fill,
          stroke: "#fff",
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
        className="transition-opacity hover:opacity-80"
      />
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showSubText ? 8 : 0)}
          textAnchor="middle"
          fill="#fff"
          fontSize={width > 120 ? "14" : "12"}
          fontWeight="600"
          className="pointer-events-none"
        >
          <tspan>{name && name.length > 12 ? `${name.slice(0, 12)}...` : name || ""}</tspan>
        </text>
      )}
      {showSubText && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="400"
          className="pointer-events-none"
        >
          <tspan>
            {value} ({percentage}%)
          </tspan>
        </text>
      )}
    </g>
  );
};

const VehicleTreemapChart: React.FC<TreemapChartProps> = ({ vehiclesInvolved }) => {
  const treeMapData = useMemo(() => {
    const entries = Object.entries(vehiclesInvolved);
    entries.sort((a, b) => b[1] - a[1]);

    const total = entries.reduce((sum, [, count]) => sum + count, 0);

    return entries.map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: ((value / total) * 100).toFixed(1),
      fill: TREEMAP_COLORS[index % TREEMAP_COLORS.length],
    }));
  }, [vehiclesInvolved]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treeMapData}
          dataKey="value"
          aspectRatio={4 / 3}
          content={<CustomizedContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default VehicleTreemapChart;
