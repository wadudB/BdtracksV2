import React, { useState } from "react";
import { useGetAllAccidentsData } from "@/hooks/useQueries";
import AllAccidentsTable from "@/components/tables/AllAccidentsTable";
import DashboardCard from "@/components/DashboardCard";
import { FileText, AlertCircle } from "lucide-react";

const AllAccidentsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const rowsPerPage = 10;
  const maxRecords = 50;
  const skip = currentPage * rowsPerPage;

  // Fetch accidents data with pagination (limited to 50 total records)
  const {
    data: accidentsData = [],
    isLoading: dataLoading,
    error: dataError,
  } = useGetAllAccidentsData({
    skip,
    limit: Math.min(rowsPerPage, maxRecords - skip),
  });

  const maxPages = Math.ceil(maxRecords / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = dataLoading;

  if (dataError) {
    return (
      <DashboardCard>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Recent Accident Records
            </h3>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">
              Failed to load accidents data. Please try again later.
            </p>
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Recent Accident Records
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing latest {maxRecords} records
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <AllAccidentsTable
            accidentsData={accidentsData}
            isLoading={isLoading}
            maxPages={maxPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DashboardCard>
  );
};

export default AllAccidentsSection;
