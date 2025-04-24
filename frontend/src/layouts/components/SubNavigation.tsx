import { Link } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";
import { Container } from "@/components/ui/container";

interface SubNavigationProps {
  isOpen: boolean;
}

export default function SubNavigation({ isOpen }: SubNavigationProps) {
  const { isActive } = useNavigation();

  return (
    <div className={`border-t border-border bg-muted/30 ${isOpen ? "block" : "hidden md:block"}`}>
      <Container>
        <div className="flex sm:flex-row flex-col justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Bangladesh Commodity Prices</h2>
          </div>
          <div className="flex overflow-x-auto scrollbar-hide">
            <Link
              to="/commodities/map"
              className={`whitespace-nowrap py-2 text-sm font-medium flex items-center
                         ${isActive("/commodities/map") ? "text-primary" : "text-muted-foreground"} 
                         hover:text-primary transition-colors`}
            >
              <span className="material-icons mr-1 text-sm">map</span>
              Regional Prices
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
