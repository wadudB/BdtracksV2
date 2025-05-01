import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: Record<string, any>;
  // Responsive visibility
  showOn?: "sm" | "md" | "lg" | "xl" | "2xl" | "always";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  className,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  // Map columns to their visibility class
  const getVisibilityClass = (showOn?: Column<T>["showOn"]) => {
    switch (showOn) {
      case "sm": return "hidden sm:table-cell";
      case "md": return "hidden md:table-cell";
      case "lg": return "hidden lg:table-cell";
      case "xl": return "hidden xl:table-cell";
      case "2xl": return "hidden 2xl:table-cell";
      case "always": 
      default: return "";
    }
  };

  return (
    <div className={cn("bg-card rounded-lg border border-border overflow-hidden", className)}>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index} 
                  className={cn(
                    column.headerClassName,
                    getVisibilityClass(column.showOn)
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow 
                  key={String(item[keyField])}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {columns.map((column, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        column.className,
                        getVisibilityClass(column.showOn)
                      )}
                    >
                      {column.cell 
                        ? column.cell(item) 
                        : column.accessorKey 
                          ? String(item[column.accessorKey] ?? '') 
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 