import React from "react";
import { CalendarDays, Filter, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface DashboardHeaderProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  totalRecords?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedYear,
  availableYears,
  onYearChange,
  onRefresh,
  isLoading = false,
  totalRecords,
}) => {
  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
        <div className="space-y-2">
          <div className="flex space-x-2 sm:flex-row sm:items-center sm:space-y-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Road Accident Dashboard
            </h1>
            {totalRecords && (
              <Badge variant="secondary" className="self-center flex items-center space-x-1">
                <span className="text-xs">{totalRecords} records</span>
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor and analyze road accident statistics across Bangladesh
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 lg:flex-row">
          {/* Year Selector */}
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={selectedYear.toString()} onValueChange={onYearChange}>
              <SelectTrigger className="w-full sm:w-28 md:w-32 min-h-[2.5rem]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 min-h-[2.5rem] px-3 flex-1 sm:flex-initial"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="text-sm">Refresh</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground">Viewing data for {selectedYear}</span>
        </div>

        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Data</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
