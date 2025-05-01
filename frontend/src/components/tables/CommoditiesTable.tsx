import { FC } from "react";
import { Link } from "react-router-dom";
import { Commodity } from "@/types";
import { Button } from "@/components/ui/button";
import { ResponsiveDataTable, ResponsiveTableColumn } from "@/components/ui/responsive-data-table";
import { formatCurrencyPrice, formatPriceChange } from "@/utils/price-utils";

// Table view for commodities
export const CommoditiesTable: FC<{ commodities: Commodity[]; isLoading?: boolean }> = ({
  commodities,
  isLoading = false,
}) => {
  // Define columns for the commodities table
  const columns: ResponsiveTableColumn<Commodity>[] = [
    {
      header: "Name",
      cell: (commodity) => (
        <div>
          <div className="font-medium">{commodity.name}</div>
          <div className="text-sm text-muted-foreground">{commodity.bengaliName}</div>
        </div>
      ),
      isPrimary: true, // This will be the main title in card view
    },
    {
      header: "Category",
      cell: (commodity) => (
        <span className="text-xs uppercase bg-secondary/50 px-2 py-1 rounded-full text-muted-foreground">
          {commodity.category}
        </span>
      ),
      showOn: "md",
    },
    {
      header: "Unit",
      accessorKey: "unit",
      showOn: "lg",
    },
    {
      header: "Min Price (৳)",
      cell: (commodity) => formatCurrencyPrice(commodity.minPrice, "৳"),
      className: "text-right",
      headerClassName: "text-right",
      showOn: "lg",
      isHidden: true, // Hide in card view
    },
    {
      header: "Max Price (৳)",
      cell: (commodity) => formatCurrencyPrice(commodity.maxPrice, "৳"),
      className: "text-right",
      headerClassName: "text-right",
      showOn: "lg",
      isHidden: true, // Hide in card view
    },
    {
      header: "Current Price",
      cell: (commodity) => formatCurrencyPrice(commodity.currentPrice, "৳"),
      className: "text-right font-medium",
      headerClassName: "text-right",
    },
    {
      header: "Weekly Change",
      cell: (commodity) => (
        <div
          className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${
            commodity.weeklyChange > 0
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : commodity.weeklyChange < 0
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {formatPriceChange(commodity.weeklyChange)}
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
      showOn: "md",
    },
    {
      header: "",
      cell: (commodity) => (
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link to={`/commodity/${commodity.id}`}>Details</Link>
        </Button>
      ),
      isAction: true, // This will be shown at the bottom of the card
    },
  ];

  return (
    <ResponsiveDataTable
      data={commodities}
      columns={columns}
      keyField="id"
      isLoading={isLoading}
      emptyMessage="No commodities available"
    />
  );
};
