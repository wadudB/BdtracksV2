import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "small" | "large";
  children: ReactNode;
}

export function Container({ 
  children, 
  className, 
  size = "default", 
  ...props 
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-4 md:px-6 @container",
        {
          "max-w-screen-2xl": size === "large",
          "max-w-screen-xl": size === "default",
          "max-w-screen-lg": size === "small"
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 