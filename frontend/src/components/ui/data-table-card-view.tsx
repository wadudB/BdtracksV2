import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
  isPrimary?: boolean;
  isAction?: boolean;
  isHidden?: boolean;
}

export interface DataTableCardViewProps<T> {
  data: T[];
  columns: CardColumn<T>[];
  keyField: keyof T;
  className?: string;
  cardClassName?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  onCardClick?: (item: T) => void;
}

export function DataTableCardView<T>({
  data,
  columns,
  keyField,
  className,
  cardClassName,
  isLoading = false,
  emptyMessage = "No data available",
  onCardClick,
}: DataTableCardViewProps<T>) {
  // Separate columns by type
  const primaryColumn = columns.find((col) => col.isPrimary);
  const actionColumn = columns.find((col) => col.isAction);
  const regularColumns = columns.filter((col) => !col.isPrimary && !col.isAction && !col.isHidden);

  if (isLoading) {
    return (
      <div className={cn("p-4 text-center", className)}>
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {data.map((item) => (
        <div
          key={String(item[keyField])}
          className={cn(
            "bg-card rounded-lg border border-border overflow-hidden p-4 flex flex-col gap-2",
            onCardClick ? "cursor-pointer" : "",
            cardClassName
          )}
          onClick={onCardClick ? () => onCardClick(item) : undefined}
        >
          {/* Primary column (usually title/name) */}
          {primaryColumn && (
            <div className="font-semibold text-lg">
              {primaryColumn.cell
                ? primaryColumn.cell(item)
                : primaryColumn.accessorKey
                ? String(item[primaryColumn.accessorKey] ?? "")
                : null}
            </div>
          )}

          {/* Regular data columns */}
          <div className="grid gap-2">
            {regularColumns.map((column, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{column.header}:</span>
                <span className={cn(column.className)}>
                  {column.cell
                    ? column.cell(item)
                    : column.accessorKey
                    ? String(item[column.accessorKey] ?? "")
                    : null}
                </span>
              </div>
            ))}
          </div>

          {/* Action column (usually buttons) */}
          {actionColumn && (
            <div className="mt-auto pt-2">
              {actionColumn.cell
                ? actionColumn.cell(item)
                : actionColumn.accessorKey
                ? String(item[actionColumn.accessorKey] ?? "")
                : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 