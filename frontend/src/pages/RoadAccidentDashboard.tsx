import { useEffect, useState, useMemo } from "react";
import { useGetAccidentData } from "../hooks/useQueries";
import { Car, AlertTriangle, Users, MapPin, Activity, BarChart3 } from "lucide-react";

// Components
import DashboardCard from "../components/DashboardCard";
import DashboardHeader from "../components/DashboardHeader";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import VehicleInvolvedChart from "../components/charts/VehicleInvolvedChart";
import RoadAccidentMap from "../components/maps/RoadAccidentMap";
import { Button } from "../components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
const RoadAccidentDashBoard = () => {
  // TanStack Query for accident data
  const { data: accidentData = [], isLoading, error, refetch } = useGetAccidentData();

  // Local state management
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");

  // Computed state using useMemo for better performance
  const selectedYearData = useMemo(() => {
    return accidentData.find((item) => item.year === selectedYear);
  }, [accidentData, selectedYear]);

  const {
    totalAccidents,
    totalDeaths,
    totalInjured,
    highestAccidentLocation,
    dailyDeaths,
    dailyInjured,
    monthlyDeaths,
    monthlyInjured,
    vehiclesInvolved,
    accidentsByDistrict,
  } = useMemo(() => {
    if (!selectedYearData) {
      return {
        totalAccidents: 0,
        totalDeaths: 0,
        totalInjured: 0,
        highestAccidentLocation: "",
        dailyDeaths: {},
        dailyInjured: {},
        monthlyDeaths: {},
        monthlyInjured: {},
        vehiclesInvolved: {},
        accidentsByDistrict: {},
      };
    }

    const parsedAccidentsByDistrict = JSON.parse(selectedYearData.accidents_by_district);

    // District names to lowercase for case-insensitive comparison
    const lowercaseAccidentsByDistrict: Record<string, number> = Object.keys(
      parsedAccidentsByDistrict
    ).reduce(
      (acc, current) => {
        const lowercaseKey = current.toLowerCase();
        acc[lowercaseKey] = parsedAccidentsByDistrict[current];
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalAccidents: selectedYearData.total_accidents,
      totalDeaths: selectedYearData.total_killed,
      totalInjured: selectedYearData.total_injured,
      highestAccidentLocation: selectedYearData.accident_hotspot,
      dailyDeaths: JSON.parse(selectedYearData.daily_deaths),
      dailyInjured: JSON.parse(selectedYearData.daily_injured),
      monthlyDeaths: JSON.parse(selectedYearData.monthly_deaths),
      monthlyInjured: JSON.parse(selectedYearData.monthly_injured),
      vehiclesInvolved: JSON.parse(selectedYearData.vehicles_involved),
      accidentsByDistrict: lowercaseAccidentsByDistrict,
    };
  }, [selectedYearData]);

  const handleRefresh = () => {
    refetch();
  };

  // Load geojson data
  useEffect(() => {
    const geojsonURL = "/districts.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data: any) => {
        setGeojsonData(data[0].data);
      })
      .catch((error) => console.error("Error loading geojson:", error));
  }, []);

  // Extract unique years using useMemo for better performance
  const getUniqueYears = useMemo(() => {
    const years = new Set<number>();
    accidentData.forEach((item) => {
      years.add(item.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [accidentData]);

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
  };

  const handleViewModeChange = (mode: "monthly" | "yearly") => {
    setViewMode(mode);
  };

  // Loading state
  if (isLoading) {
    return (
      <Section>
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Container>
      </Section>
    );
  }

  // Error state
  if (error) {
    return (
      <Section>
        <Container>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-700">Failed to load dashboard data. Please try again later.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
    //   <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <Section>
      <Container>
        {/* Enhanced Header */}
        <DashboardHeader
          selectedYear={selectedYear}
          availableYears={getUniqueYears}
          onYearChange={handleYearChange}
          onRefresh={handleRefresh}
          isLoading={false}
          totalRecords={accidentData.length}
        />

        {/* Main Dashboard Grid */}
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          {/* Statistics Overview */}
          <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <DashboardCard
              title="Total Accidents"
              statistic={totalAccidents.toLocaleString()}
              icon={<Car className="h-4 w-4 sm:h-5 sm:w-5" />}
              trend="up"
              trendValue="+12%"
              gradient={true}
            />
            <DashboardCard
              title="Fatalities"
              statistic={totalDeaths.toLocaleString()}
              icon={<AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />}
              trend="down"
              trendValue="-3%"
              gradient={true}
            />
            <DashboardCard
              title="Injuries"
              statistic={totalInjured.toLocaleString()}
              icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
              trend="up"
              trendValue="+8%"
              gradient={true}
            />
            <DashboardCard
              title="Accident Hotspot"
              statistic={highestAccidentLocation}
              icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />}
              trend="neutral"
              statisticNote="Most incidents"
              gradient={true}
            />
          </section>

          {/* Charts Section */}
          <section className="space-y-4 sm:space-y-6">
            {/* Desktop layout for charts */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Daily Casualties Chart */}
              <div className="lg:col-span-2">
                <DashboardCard>
                  <LineChart dailyDeathsData={dailyDeaths} dailyInjuredData={dailyInjured} />
                </DashboardCard>
              </div>

              {/* Vehicles Involved */}
              <div className="lg:col-span-1">
                <DashboardCard>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Vehicles Involved</h3>
                    </div>
                    <VehicleInvolvedChart vehiclesInvolved={vehiclesInvolved} />
                  </div>
                </DashboardCard>
              </div>
            </div>
          </section>

          {/* Monthly/Yearly Analysis */}
          <section>
            <DashboardCard>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 lg:items-center">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      Casualties Analysis
                    </h3>
                  </div>
                  <div className="flex bg-muted rounded-lg p-1 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant={viewMode === "monthly" ? "default" : "ghost"}
                      onClick={() => handleViewModeChange("monthly")}
                      className="rounded-r-none flex-1 sm:flex-initial min-h-[2.25rem]"
                    >
                      <span className="text-sm">Monthly</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === "yearly" ? "default" : "ghost"}
                      onClick={() => handleViewModeChange("yearly")}
                      className="rounded-l-none flex-1 sm:flex-initial min-h-[2.25rem]"
                    >
                      <span className="text-sm">Yearly</span>
                    </Button>
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <BarChart
                    monthlyInjured={monthlyInjured}
                    monthlyDeaths={monthlyDeaths}
                    accidentData={accidentData}
                    viewMode={viewMode}
                  />
                </div>
              </div>
            </DashboardCard>
          </section>

          {/* Geographic Analysis */}
          <section>
            <RoadAccidentMap geojsonData={geojsonData} accidentsByDistrict={accidentsByDistrict} />
          </section>
        </div>
        {/* </div>
          </div> */}
      </Container>
    </Section>
  );
};

export default RoadAccidentDashBoard;
