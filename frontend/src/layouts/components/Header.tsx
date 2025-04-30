import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useNavigation } from "../hooks/useNavigation";
import SubNavigation from "./SubNavigation";

export default function Header() {
  const { isActive, shouldShowSubNavbar } = useNavigation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <Container>
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex w-full justify-between space-x-2">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="material-icons text-primary">agriculture</span>
              <Link to="/" className="text-xl font-bold">
                BDTRACKS
              </Link>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    to="/"
                    className={`${navigationMenuTriggerStyle()} ${
                      isActive("/") ? "bg-muted text-primary" : ""
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    to="/commodities"
                    className={`${navigationMenuTriggerStyle()} ${
                      isActive("/commodities") ? "bg-muted text-primary" : ""
                    }`}
                  >
                    Commodities
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    to="https://bdmovements.bdtracks.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${navigationMenuTriggerStyle()}`}
                  >
                    July Movement
                  </Link>
                </NavigationMenuItem>
                {/* <NavigationMenuItem>
                  <Link
                    to="/about"
                    className={`${navigationMenuTriggerStyle()} ${
                      isActive("/about") ? "bg-muted text-primary" : ""
                    }`}
                  >
                    About
                  </Link>
                </NavigationMenuItem> */}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {shouldShowSubNavbar() && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  className="md:hidden"
                >
                  <span className="material-icons">
                    {isSubMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </Button>
              )}
              <Button variant="default" size="sm">
                Login
              </Button>
            </div>
            </div>
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-icons">menu</span>
            </Button>
          </div>
        </div>
      </Container>

      {/* Mobile menu (simplified for now) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border p-4">
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="px-2 py-1 hover:bg-muted rounded">
              Home
            </Link>
            <Link to="/commodities" className="px-2 py-1 hover:bg-muted rounded">
              Commodities
            </Link>
            <Link to="/about" className="px-2 py-1 hover:bg-muted rounded">
              About
            </Link>
          </nav>
        </div>
      )}

      {/* Sub navigation bar */}
      {shouldShowSubNavbar() && <SubNavigation isOpen={isSubMenuOpen} />}
    </header>
  );
}
