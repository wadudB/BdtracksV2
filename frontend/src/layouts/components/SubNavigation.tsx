import { Link } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";

interface SubNavigationProps {
  isOpen: boolean;
}

export default function SubNavigation({ isOpen }: SubNavigationProps) {
  const { isActive } = useNavigation();

  return (
    <div className={`border-t border-border bg-muted/30 ${isOpen ? "block" : "hidden md:block"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Bangladesh Commodity Prices</h2>
          </div>
          <div className="flex overflow-x-auto py-2 scrollbar-hide">
            <Link
              to="/commodities/map"
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium flex items-center
                         ${isActive("/commodities/map") ? "text-primary" : "text-muted-foreground"} 
                         hover:text-primary transition-colors`}
            >
              <span className="material-icons mr-1 text-sm">map</span>
              Regional Prices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 