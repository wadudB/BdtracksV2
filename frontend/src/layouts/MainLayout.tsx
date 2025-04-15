import { FC, ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;
  
  // Check if current page should show the subnavbar
  const shouldShowSubNavbar = () => {
    return (
      location.pathname === '/commodities' || 
      location.pathname === '/map' || 
      location.pathname === '/supply-chain' || 
      location.pathname === '/analytics'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-primary">agriculture</span>
              <Link to="/" className="text-xl font-bold">BDTRACKS</Link>
            </div>
            
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={`${navigationMenuTriggerStyle()} ${isActive('/') ? 'bg-muted text-primary' : ''}`}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/commodities" className={`${navigationMenuTriggerStyle()} ${isActive('/commodities') ? 'bg-muted text-primary' : ''}`}>
                    Commodities
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className={`${navigationMenuTriggerStyle()} ${isActive('/about') ? 'bg-muted text-primary' : ''}`}>
                    About
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <span className="material-icons">search</span>
              </Button>
              {shouldShowSubNavbar() && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  className="md:hidden"
                >
                  <span className="material-icons">
                    {isSubMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </Button>
              )}
              <Button variant="default" size="sm">
                Login
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <span className="material-icons">menu</span>
            </Button>
          </div>
        </div>
        
        {/* Sub navigation bar - shown on commodities, map, supply-chain, and analytics pages */}
        {shouldShowSubNavbar() && (
          <div className={`border-t border-border bg-muted/30 ${isSubMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center">
                <div className="flex overflow-x-auto py-2 scrollbar-hide">
                  <Link to="/map" 
                        className={`whitespace-nowrap px-4 py-2 text-sm font-medium flex items-center
                                   ${isActive('/map') ? 'text-primary' : 'text-muted-foreground'} 
                                   hover:text-primary transition-colors`}>
                    <span className="material-icons mr-1 text-sm">map</span>
                    Regional Prices
                  </Link>
                  <Link to="/supply-chain" 
                        className={`whitespace-nowrap px-4 py-2 text-sm font-medium flex items-center
                                   ${isActive('/supply-chain') ? 'text-primary' : 'text-muted-foreground'} 
                                   hover:text-primary transition-colors`}>
                    <span className="material-icons mr-1 text-sm">inventory</span>
                    Supply Chain
                  </Link>
                  <Link to="/analytics" 
                        className={`whitespace-nowrap px-4 py-2 text-sm font-medium flex items-center
                                   ${isActive('/analytics') ? 'text-primary' : 'text-muted-foreground'} 
                                   hover:text-primary transition-colors`}>
                    <span className="material-icons mr-1 text-sm">insights</span>
                    Market Insights
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">BDTRACKS</h3>
              <p className="text-muted-foreground">
                Bangladesh Commodity Tracker - providing real-time prices and insights for agricultural, industrial, and energy commodities across Bangladesh.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/commodities" className="text-muted-foreground hover:text-primary transition-colors">Commodities</Link></li>
                <li><Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">Regional Prices</Link></li>
                <li><Link to="/supply-chain" className="text-muted-foreground hover:text-primary transition-colors">Supply Chain</Link></li>
                <li><Link to="/analytics" className="text-muted-foreground hover:text-primary transition-colors">Market Insights</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/api" className="text-muted-foreground hover:text-primary transition-colors">API</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Subscribe</h3>
              <p className="text-muted-foreground mb-4">Stay updated with the latest commodity prices and market trends.</p>
              <div className="flex">
                <Input type="email" placeholder="Your email" className="flex-1 rounded-r-none" />
                <Button className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} BDTRACKS. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="material-icons">facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="material-icons">twitter</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="material-icons">linkedin</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 