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
          ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200 shadow-md"
          : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 rounded-lg w-12 h-12 flex items-center justify-center transition-all duration-200 ${config.lightColor} ${config.textColor} group-hover:scale-105`}
          >
            <span className="material-icons text-lg">{config.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                  {location.name}
                </h3>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
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

            {/* Commodities preview */}
            <div className="space-y-1.5 mt-2">
              {location.commodities.slice(0, 2).map((commodity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-xs bg-gray-50 px-2.5 py-1.5 rounded"
                >
                  <span className="text-gray-700 truncate mr-2 font-medium">{commodity.name}</span>
                  <span className="text-gray-900 font-bold whitespace-nowrap">
                    ৳{commodity.price}/{commodity.unit}
                  </span>
                </div>
              ))}

              {location.commodities.length > 2 && (
                <div
                  className={`text-xs font-medium ${config.accentColor} bg-gray-50 px-2.5 py-1.5 rounded text-center hover:bg-gray-100 transition-colors`}
                >
                  +{location.commodities.length - 2} more items
                </div>
              )}

              {location.commodities.length === 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded text-center">
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
