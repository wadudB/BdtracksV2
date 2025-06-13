import React, { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
  statistic?: string;
  statisticNote?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  gradient?: boolean;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  title,
  statistic,
  statisticNote,
  trend,
  trendValue,
  icon,
  gradient = false,
  loading = false,
  className,
  ...props
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-white-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-white-500" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-white-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "success";
      case "down":
        return "destructive";
      case "neutral":
        return "warning";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "p-4 sm:p-6 flex flex-col justify-between h-full bg-card rounded-xl border border-border/50 shadow-sm",
          "animate-pulse",
          className
        )}
        {...props}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 sm:h-4 bg-muted rounded w-16 sm:w-20"></div>
            <div className="h-5 w-5 sm:h-6 sm:w-6 bg-muted rounded-full"></div>
          </div>
          <div className="h-6 sm:h-8 bg-muted rounded w-20 sm:w-24"></div>
          <div className="h-2 sm:h-3 bg-muted rounded w-12 sm:w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 sm:p-6 flex flex-col justify-between h-full rounded-xl border border-border/50 shadow-sm",
        gradient ? "bg-gradient-to-br from-card via-card to-card/80" : "bg-card",
        className
      )}
      {...props}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          {title && (
            <h6 className="text-xs sm:text-sm font-medium text-muted-foreground leading-none">
              {title}
            </h6>
          )}
          {icon && <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>}
        </div>

        {/* Main Content */}
        <div className="space-y-1 sm:space-y-2">
          {statistic && (
            <div className="flex items-baseline space-x-1 sm:space-x-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {statistic}
              </h2>
              {trend && trendValue && (
                <Badge
                  variant={getTrendColor() as any}
                  className="flex items-center space-x-1 text-xs"
                >
                  {getTrendIcon()}
                  <span className="text-xs">{trendValue}</span>
                </Badge>
              )}
            </div>
          )}

          {statisticNote && (
            <p className="text-xs sm:text-sm text-muted-foreground">{statisticNote}</p>
          )}
        </div>

        {/* Children Content */}
        {children && <div className="pt-1 sm:pt-2">{children}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
