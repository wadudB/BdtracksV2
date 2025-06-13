import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronFirst, ChevronLast, Clock, MapPin, Users, FileText } from "lucide-react";
import { AllAccidentsData } from "@/types";

interface AllAccidentsTableProps {
  accidentsData: AllAccidentsData[];
  isLoading?: boolean;
  maxPages?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const AllAccidentsTable: React.FC<AllAccidentsTableProps> = ({
  accidentsData,
  isLoading = false,
  maxPages = 5,
  currentPage,
  onPageChange,
}) => {
  const [selectedRow, setSelectedRow] = useState<AllAccidentsData | null>(null);

  const handleRowClick = (row: AllAccidentsData) => {
    setSelectedRow(row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const convertToIntegerOrDefault = (
    value: string | null | undefined,
    defaultValue = "Not Available"
  ) => {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    const number = parseFloat(value);
    return !isNaN(number) ? Math.floor(number).toString() : value;
  };

  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return "Not Available";
    try {
      const date = new Date(dateTimeStr);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return dateTimeStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-sm font-medium text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Date & Time</span>
                </div>
              </TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Casualties</span>
                </div>
              </TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
              </TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accidentsData.map((row, index) => (
              <TableRow
                key={row.uId || index}
                onClick={() => handleRowClick(row)}
                className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
              >
                <TableCell className="py-3">
                  <div className="text-sm font-medium text-foreground">
                    {formatDateTime(row.accidentDatetimeFromUrl)}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-destructive">
                        {convertToIntegerOrDefault(row.totalNumberOfPeopleKilled, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">killed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-orange-500">
                        {convertToIntegerOrDefault(row.totalNumberOfPeopleInjured, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">injured</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground truncate max-w-[350px]">
                      {row.exactLocationOfAccident || "Location not specified"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {row.districtOfAccident || "District not specified"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                    {row.accidentType || "Not specified"}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        {accidentsData.map((row, index) => (
          <Card
            key={row.uId || index}
            className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
            onClick={() => handleRowClick(row)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                {formatDateTime(row.accidentDatetimeFromUrl)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-destructive">
                        {convertToIntegerOrDefault(row.totalNumberOfPeopleKilled, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">killed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-orange-500">
                        {convertToIntegerOrDefault(row.totalNumberOfPeopleInjured, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">injured</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                    {row.accidentType || "Not specified"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {row.exactLocationOfAccident || "Location not specified"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {row.districtOfAccident || "District not specified"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {maxPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 w-full space-y-2 sm:space-y-0">
          <div className="text-xs text-muted-foreground">
            Page {currentPage + 1} of {maxPages}
          </div>
          <Pagination className="w-fit">
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(0)}
                  className="cursor-pointer"
                  aria-disabled={currentPage === 0}
                >
                  <ChevronFirst className="h-3 w-3" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                  className="cursor-pointer"
                  aria-disabled={currentPage === 0}
                />
              </PaginationItem>
              {[...Array(maxPages)].map((_, i) => {
                if (
                  i === 0 ||
                  i === maxPages - 1 ||
                  (i >= currentPage - 1 && i <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => onPageChange(i)}
                        isActive={currentPage === i}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if ((i === currentPage - 2 || i === currentPage + 2) && maxPages > 5) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(maxPages - 1, currentPage + 1))}
                  className="cursor-pointer"
                  aria-disabled={currentPage === maxPages - 1}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(maxPages - 1)}
                  className="cursor-pointer"
                  aria-disabled={currentPage === maxPages - 1}
                >
                  <ChevronLast className="h-3 w-3" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={Boolean(selectedRow)} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Accident Details</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] overflow-y-auto">
            {selectedRow && (
              <DialogDescription asChild>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium text-foreground mb-1">Casualties</div>
                        <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold text-destructive">
                              {convertToIntegerOrDefault(
                                selectedRow.totalNumberOfPeopleKilled,
                                "0"
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">Killed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-500">
                              {convertToIntegerOrDefault(
                                selectedRow.totalNumberOfPeopleInjured,
                                "0"
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">Injured</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-foreground mb-1">Date & Time</div>
                        <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                          {formatDateTime(selectedRow.accidentDatetimeFromUrl)}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-foreground mb-1">Accident Type</div>
                        <div className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                          {selectedRow.accidentType || "Not specified"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="font-medium text-foreground mb-1">Location</div>
                        <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                          {selectedRow.exactLocationOfAccident || "Not specified"}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-foreground mb-1">District</div>
                        <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                          {selectedRow.districtOfAccident || "Not specified"}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-foreground mb-1">Division</div>
                        <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                          {selectedRow.divisionOfAccident || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {(selectedRow.primaryVehicleInvolved || selectedRow.reasonOrCauseForAccident) && (
                    <div className="space-y-3 border-t pt-4">
                      {selectedRow.primaryVehicleInvolved && (
                        <div>
                          <div className="font-medium text-foreground mb-1">Primary Vehicle</div>
                          <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                            {selectedRow.primaryVehicleInvolved}
                          </div>
                        </div>
                      )}

                      {selectedRow.reasonOrCauseForAccident && (
                        <div>
                          <div className="font-medium text-foreground mb-1">Cause</div>
                          <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                            {selectedRow.reasonOrCauseForAccident}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedRow.headline || selectedRow.summary) && (
                    <div className="space-y-3 border-t pt-4">
                      {selectedRow.headline && (
                        <div>
                          <div className="font-medium text-foreground mb-2">News Headline</div>
                          <div className="text-foreground font-medium bg-muted/50 p-3 rounded">
                            {selectedRow.headline}
                          </div>
                        </div>
                      )}

                      {selectedRow.summary && (
                        <div>
                          <div className="font-medium text-foreground mb-2">Summary</div>
                          <div className="text-muted-foreground bg-muted/50 p-3 rounded leading-relaxed">
                            {selectedRow.summary}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRow.url && (
                    <div className="border-t pt-4">
                      <div className="font-medium text-foreground mb-2">Source</div>
                      <a
                        href={selectedRow.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 underline text-sm"
                      >
                        {selectedRow.source || "View Original Article"}
                      </a>
                    </div>
                  )}
                </div>
              </DialogDescription>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleCloseModal} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllAccidentsTable;
