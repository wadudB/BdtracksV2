import React, { useMemo } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { AccidentData } from "@/types";

interface BarChartProps {
  monthlyInjured: Record<string, number>;
  monthlyDeaths: Record<string, number>;
  accidentData: AccidentData[];
  viewMode: "monthly" | "yearly";
}

interface ChartDataItem {
  label: string;
  totalDeaths: number;
  totalInjured: number;
}

const BarChart: React.FC<BarChartProps> = ({
  monthlyInjured,
  monthlyDeaths,
  accidentData,
  viewMode,
}) => {
  const chartData: ChartDataItem[] = useMemo(() => {
    if (viewMode === "yearly") {
      // Process yearly data
      const yearlyData = accidentData
        .map((data) => ({
          label: data.year.toString(),
          totalDeaths: data.total_killed,
          totalInjured: data.total_injured,
        }))
        .sort((a, b) => parseInt(a.label) - parseInt(b.label)); // Sort by year

      return yearlyData;
    } else {
      // Process monthly data
      const sortedMonths = Object.keys(monthlyDeaths).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      return sortedMonths.map((month) => {
        const date = new Date(month);
        const label = date.toLocaleString("default", { month: "short" });
        return {
          label,
          totalDeaths: monthlyDeaths[month],
          totalInjured: monthlyInjured[month],
        };
      });
    }
  }, [monthlyInjured, monthlyDeaths, accidentData, viewMode]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-3">
            {viewMode === "yearly" ? `Year ${label}` : `${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-6 mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-muted-foreground">
                  {entry.dataKey === "totalDeaths" ? "Deaths" : "Injured"}:
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center space-x-6 mb-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-64 sm:h-80 lg:h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="deathsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="injuredGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(43 96% 56%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(43 96% 56%)" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.8}
            horizontal={true}
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
            className="text-xs text-muted-foreground"
            fontSize={10}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-xs text-muted-foreground"
            fontSize={10}
            width={35}
          />

          <ChartTooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          <Bar
            dataKey="totalDeaths"
            name="Deaths"
            fill="url(#deathsGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            animationDuration={1000}
          />

          <Bar
            dataKey="totalInjured"
            name="Injured"
            fill="url(#injuredGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            animationDuration={1000}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
