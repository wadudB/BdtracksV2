import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "primary";
  children: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        data-slot="section"
        className={cn(
          "py-8 md:py-12",
          {
            "bg-background": variant === "default",
            "bg-muted": variant === "muted",
            "bg-primary text-primary-foreground": variant === "primary",
          },
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
); 