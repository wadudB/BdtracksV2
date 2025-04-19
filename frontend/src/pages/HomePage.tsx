import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { commodities, getTopChangedCommodities } from "@/data/commodityData";

const HomePage: FC = () => {
  const navigate = useNavigate();

  // Get top 4 commodities with significant price changes
  const featuredCommodities = getTopChangedCommodities(4);

  const handleViewCommodities = (): void => {
    navigate("/commodities");
  };

  const handleViewMap = (): void => {
    navigate("/map");
  };

  const handleSignUp = (): void => {
    // Would handle signup logic
    navigate("/signup");
  };

  const handleLearnMore = (): void => {
    navigate("/about");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Bangladeshi Commodity Prices in Real-Time
            </h1>
            <p className="text-xl mb-8">
              BDTRACKS provides up-to-date commodity prices, regional comparisons, and market
              insights across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" onClick={handleViewCommodities}>
                View Commodities
              </Button>
              <Button variant="outline" onClick={handleViewMap}>
                Regional Map
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-secondary/20 rounded-lg transform rotate-3"></div>
              <img
                src="https://via.placeholder.com/600x400"
                alt="Bangladesh Market"
                className="relative z-10 rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Commodities */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Commodities</h2>
              <p className="text-muted-foreground">
                Monitor the most important commodity prices in Bangladesh
              </p>
            </div>
            <Link
              to="/commodities"
              className="mt-4 md:mt-0 text-primary hover:underline flex items-center"
            >
              View all commodities <span className="material-icons ml-1">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCommodities.map((commodity) => (
              <Card key={commodity.id} className="transition-transform hover:scale-105">
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      commodity.image ||
                      `https://via.placeholder.com/600x400?text=${encodeURIComponent(commodity.name)}`
                    }
                    alt={commodity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{commodity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      ৳{commodity.currentPrice}/{commodity.unit}
                    </span>
                    <span
                      className={
                        commodity.weeklyChange > 0
                          ? "text-red-500"
                          : commodity.weeklyChange < 0
                            ? "text-green-500"
                            : "text-yellow-500"
                      }
                    >
                      {commodity.weeklyChange > 0 && "+"}
                      {Math.round(commodity.weeklyChange)}%
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to={`/commodity/${commodity.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Price Changes Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Recent Price Changes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-2">Commodity</th>
                  <th className="text-right py-4 px-2">Current Price</th>
                  <th className="text-right py-4 px-2">Previous Price</th>
                  <th className="text-right py-4 px-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {commodities.slice(0, 10).map((commodity) => (
                  <tr key={commodity.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-2">
                      <Link to={`/commodity/${commodity.id}`} className="hover:text-primary">
                        {commodity.name}
                      </Link>
                    </td>
                    <td className="text-right py-4 px-2">
                      ৳{commodity.currentPrice}/{commodity.unit}
                    </td>
                    <td className="text-right py-4 px-2">
                      ৳{commodity.previousPrice}/{commodity.unit}
                    </td>
                    <td
                      className={`text-right py-4 px-2 ${
                        commodity.weeklyChange > 0
                          ? "text-red-500"
                          : commodity.weeklyChange < 0
                            ? "text-green-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {commodity.weeklyChange > 0 && "+"}
                      {Math.round(commodity.weeklyChange)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/commodities">View All Prices</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Regional Map Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold mb-6">Regional Price Comparison</h2>
              <p className="mb-6 text-muted-foreground">
                Prices of commodities vary across different regions of Bangladesh. Our interactive
                map allows you to visualize price differences by location.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">check_circle</span>
                  <span>Compare prices across all 8 divisions of Bangladesh</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">check_circle</span>
                  <span>Identify regions with the lowest and highest prices</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">check_circle</span>
                  <span>Make informed purchasing decisions based on location</span>
                </li>
              </ul>
              <Button asChild variant="default" className="mt-8">
                <Link to="/map">View Regional Map</Link>
              </Button>
            </div>
            <div className="md:w-1/2 h-96 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive Map (Google Maps integration)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose BDTRACKS?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We provide comprehensive commodity tracking tools designed specifically for
              Bangladesh's markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <span className="material-icons text-primary text-4xl mb-4">update</span>
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our prices are updated daily to ensure you always have access to the most current
                  information.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <span className="material-icons text-primary text-4xl mb-4">insights</span>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get expert insights on price trends, seasonal patterns, and market forecasts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <span className="material-icons text-primary text-4xl mb-4">notifications</span>
                <CardTitle>Price Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up custom alerts to be notified when prices of your watched commodities change
                  significantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to track commodity prices?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up for free to access all our features and stay updated with the latest prices.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="secondary" onClick={handleSignUp}>
              Sign Up Free
            </Button>
            <Button variant="outline" onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
