import { FC } from "react";
import { Link } from "react-router-dom";
import { Commodity } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrencyPrice, formatPriceChange } from "@/utils/price-utils";

// Table view for commodities
export const CommoditiesTable: FC<{ commodities: Commodity[] }> = ({ commodities }) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Min Price (৳)</TableHead>
            <TableHead className="text-right">Max Price (৳)</TableHead>
            <TableHead className="text-right">Current Price (avg) (৳)</TableHead>
            <TableHead className="text-right">Weekly Change</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commodities.map((commodity) => (
            <TableRow key={commodity.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{commodity.name}</div>
                  <div className="text-sm text-muted-foreground">{commodity.bengaliName}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs uppercase bg-secondary/50 px-2 py-1 rounded-full text-muted-foreground">
                  {commodity.category}
                </span>
              </TableCell>
              <TableCell>{commodity.unit}</TableCell>
              <TableCell className="text-right">
                {formatCurrencyPrice(commodity.minPrice, "৳")}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrencyPrice(commodity.maxPrice, "৳")}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrencyPrice(commodity.currentPrice, "৳")}
              </TableCell>
              <TableCell className="text-right">
                <div
                  className={cn(
                    "inline-flex rounded px-1.5 py-0.5 text-xs font-medium",
                    commodity.weeklyChange > 0
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : commodity.weeklyChange < 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  )}
                >
                  {formatPriceChange(commodity.weeklyChange)}
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/commodity/${commodity.id}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
