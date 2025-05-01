import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm";
  children: ReactNode;
  className?: string;
}

export function Heading({
  children,
  className,
  as: Component = "h2",
  size = "lg",
  ...props
}: HeadingProps) {
  return (
    <Component
      data-slot="heading"
      className={cn(
        {
          "text-3xl md:text-4xl lg:text-5xl font-bold": size === "xl",
          "text-2xl md:text-3xl font-bold": size === "lg",
          "text-xl md:text-2xl font-bold": size === "md",
          "text-lg font-medium": size === "sm",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
