import React, { useState } from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  CartesianGrid,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Skull } from "lucide-react";
import { ChartTooltip } from "@/components/ui/chart";

interface LineChartProps {
  dailyDeathsData: Record<string, number>;
  dailyInjuredData: Record<string, number>;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const LineChart: React.FC<LineChartProps> = ({ dailyDeathsData, dailyInjuredData }) => {
  const [chartType, setChartType] = useState<"line" | "area">("line");

  // Combine dailyDeathsData and dailyInjuredData into a single array of objects
  const chartData = Object.keys(dailyDeathsData).map((date) => ({
    date: formatDate(date),
    fullDate: date,
    totalDeaths: dailyDeathsData[date],
    totalInjured: dailyInjuredData[date],
  }));

  // Calculate totals and trends
  const totalDeaths = Object.values(dailyDeathsData).reduce((a, b) => a + b, 0);
  const totalInjured = Object.values(dailyInjuredData).reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-muted-foreground">
                  {entry.dataKey === "totalDeaths" ? "Deaths" : "Injured"}:
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === "area") {
      return (
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorInjured" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(43 96% 56%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(43 96% 56%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.15)"
            opacity={0.8}
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.3)", strokeWidth: 1 }}
            tickMargin={8}
            className="text-xs text-muted-foreground"
            interval={Math.floor(chartData.length / 4)}
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
          <Area
            type="monotone"
            dataKey="totalDeaths"
            stroke="hsl(0 84% 60%)"
            fillOpacity={1}
            fill="url(#colorDeaths)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="totalInjured"
            stroke="hsl(43 96% 56%)"
            fillOpacity={1}
            fill="url(#colorInjured)"
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    return (
      <ReLineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          opacity={0.8}
          horizontal={true}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
          tickMargin={8}
          className="text-xs text-muted-foreground"
          interval={Math.floor(chartData.length / 4)}
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
        <Line
          type="monotone"
          dataKey="totalDeaths"
          stroke="hsl(0 84% 60%)"
          strokeWidth={2}
          dot={{ r: 3, fill: "hsl(0 84% 60%)", strokeWidth: 1 }}
          activeDot={{ r: 5, fill: "hsl(0 84% 60%)", strokeWidth: 2 }}
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="totalInjured"
          stroke="hsl(43 96% 56%)"
          strokeWidth={2}
          dot={{ r: 3, fill: "hsl(43 96% 56%)", strokeWidth: 1 }}
          activeDot={{ r: 5, fill: "hsl(43 96% 56%)", strokeWidth: 2 }}
          animationDuration={1500}
        />
      </ReLineChart>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 lg:items-center">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span>Daily Casualties Trend</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Last 30 days overview</p>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("line")}
            className="flex items-center justify-center space-x-1 flex-1 sm:flex-initial min-h-[2.25rem]"
          >
            <span className="text-sm">Line</span>
          </Button>
          <Button
            variant={chartType === "area" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("area")}
            className="flex items-center justify-center space-x-1 flex-1 sm:flex-initial min-h-[2.25rem]"
          >
            <span className="text-sm">Area</span>
          </Button>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
            <Skull className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium truncate">
              Total Deaths
            </p>
            <p className="text-sm sm:text-lg font-bold text-red-700 dark:text-red-300">
              {totalDeaths}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 font-medium truncate">
              Total Injured
            </p>
            <p className="text-sm sm:text-lg font-bold text-yellow-700 dark:text-yellow-300">
              {totalInjured}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
