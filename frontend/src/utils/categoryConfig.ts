export type CategoryConfig = {
  icon: string;
  color: string;
  lightColor: string;
  textColor: string;
  accentColor: string;
  badgeColor: string;
};

export function getCategoryConfig(category: string): CategoryConfig {
  switch (category) {
    case "gas":
      return {
        icon: "local_gas_station",
        color: "bg-blue-500",
        lightColor: "bg-blue-100",
        textColor: "text-blue-600",
        accentColor: "text-blue-500",
        badgeColor: "bg-blue-600",
      };
    case "grocery":
      return {
        icon: "shopping_cart",
        color: "bg-emerald-500",
        lightColor: "bg-emerald-100",
        textColor: "text-emerald-600",
        accentColor: "text-emerald-500",
        badgeColor: "bg-emerald-600",
      };
    case "restaurant":
      return {
        icon: "restaurant",
        color: "bg-orange-500",
        lightColor: "bg-orange-100",
        textColor: "text-orange-600",
        accentColor: "text-orange-500",
        badgeColor: "bg-orange-600",
      };
    default:
      return {
        icon: "place",
        color: "bg-gray-500",
        lightColor: "bg-gray-100",
        textColor: "text-gray-600",
        accentColor: "text-gray-500",
        badgeColor: "bg-gray-600",
      };
  }
}
