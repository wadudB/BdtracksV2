import { ReactNode } from "react";
import { DataTable, Column } from "./data-table";
import { DataTableCardView, CardColumn } from "./data-table-card-view";

export interface ResponsiveTableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  // Table-specific properties
  showOn?: "sm" | "md" | "lg" | "xl" | "2xl" | "always";
  // Card-specific properties
  isPrimary?: boolean;
  isAction?: boolean;
  isHidden?: boolean;
}

export interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: ResponsiveTableColumn<T>[];
  keyField: keyof T;
  className?: string;
  cardClassName?: string;
  tableBelowBreakpoint?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function ResponsiveDataTable<T>({
  data,
  columns,
  keyField,
  className,
  cardClassName,
  tableBelowBreakpoint = true,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
}: ResponsiveDataTableProps<T>) {
  // Convert the unified columns to each specific format
  const tableColumns: Column<T>[] = columns.map(column => ({
    header: column.header,
    accessorKey: column.accessorKey,
    cell: column.cell,
    className: column.className,
    headerClassName: column.headerClassName,
    showOn: column.showOn,
  }));

  const cardColumns: CardColumn<T>[] = columns.map(column => ({
    header: column.header,
    accessorKey: column.accessorKey,
    cell: column.cell,
    className: column.className,
    isPrimary: column.isPrimary,
    isAction: column.isAction,
    isHidden: column.isHidden,
  }));

  return (
    <>
      {/* Card view on small screens */}
      <div className={`${tableBelowBreakpoint ? "sm:hidden" : "hidden sm:block"}`}>
        <DataTableCardView
          data={data}
          columns={cardColumns}
          keyField={keyField}
          className={className}
          cardClassName={cardClassName}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          onCardClick={onRowClick}
        />
      </div>

      {/* Table view on larger screens */}
      <div className={`${tableBelowBreakpoint ? "hidden sm:block" : "sm:hidden"}`}>
        <DataTable
          data={data}
          columns={tableColumns}
          keyField={keyField}
          className={className}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          onRowClick={onRowClick}
        />
      </div>
    </>
  );
} 