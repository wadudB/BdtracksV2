import { Card, CardContent } from "@/components/ui/card";
import { LocationWithPrices } from "@/types";
import { getCategoryConfig } from "@/utils/categoryConfig";

interface LocationCardProps {
  location: LocationWithPrices;
  isActive: boolean;
  onClick: () => void;
}

export function LocationCard({ location, isActive, onClick }: LocationCardProps) {
  const config = getCategoryConfig(location.category);

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-lg border cursor-pointer group rounded-lg p-0 ${
        isActive
          ? "ring-2 ring-primary bg-primary/5 border-primary shadow-md"
          : "hover:bg-muted/50 border-border hover:border-muted-foreground/20 bg-card"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-2.5 lg:p-3">
        <div className="flex items-start gap-2.5 lg:gap-3">
          {/* Icon - slightly smaller on mobile */}
          <div
            className={`flex-shrink-0 rounded-lg w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all duration-200 ${config.lightColor} ${config.textColor} group-hover:scale-105`}
          >
            <span className="material-icons text-base lg:text-lg">{config.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-foreground text-sm lg:text-sm leading-tight truncate">
                  {location.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                  <span className="material-icons text-xs">place</span>
                  {location.address}
                </p>
              </div>

              {/* Price badge */}
              {/* {location.commodities.length > 0 && (
                <div className="flex-shrink-0 ml-2">
                  <div
                    className={`${config.badgeColor} text-white px-2 py-1 rounded-lg shadow-sm text-center`}
                  >
                    <div className="text-xs leading-tight opacity-90 truncate max-w-[70px]">
                      {location.commodities[0].name}
                    </div>
                    <div className="text-sm font-bold">৳{location.commodities[0].price}</div>
                  </div>
                </div>
              )} */}
            </div>

            {/* Commodities preview - more compact on mobile */}
            <div className="space-y-1 lg:space-y-1.5 mt-1.5 lg:mt-2">
              {location.commodities.slice(0, 2).map((commodity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-xs bg-muted/50 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded"
                >
                  <span className="text-foreground truncate mr-2 font-medium">
                    {commodity.name}
                  </span>
                  <span className="text-foreground font-bold whitespace-nowrap text-xs lg:text-sm">
                    ৳{commodity.price}/{commodity.unit}
                  </span>
                </div>
              ))}

              {location.commodities.length > 2 && (
                <div
                  className={`text-xs font-medium ${config.accentColor} bg-muted/50 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded text-center hover:bg-muted transition-colors`}
                >
                  +{location.commodities.length - 2} more items
                </div>
              )}

              {location.commodities.length === 0 && (
                <div className="text-xs text-muted-foreground bg-muted/50 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded text-center">
                  No price data available
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
