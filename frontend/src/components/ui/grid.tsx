import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  children: ReactNode;
}

export function Grid({ 
  children, 
  className, 
  cols = 3,
  ...props 
}: GridProps) {
  return (
    <div
      data-slot="grid"
      className={cn(
        "grid gap-4 md:gap-6",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-1 md:grid-cols-2": cols === 2,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === 3,
          "grid-cols-2 md:grid-cols-3 lg:grid-cols-4": cols === 4,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 