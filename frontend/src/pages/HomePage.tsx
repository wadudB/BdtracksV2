import { FC, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Grid } from "@/components/ui/grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const HomePage: FC = () => {
  // const navigate = useNavigate();
  const servicesRef = useRef<HTMLElement>(null);
  const allTrackersRef = useRef<HTMLDivElement>(null);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleExplore = (): void => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const handleLearnMore = (): void => {
  //   navigate("/about");
  // };

  const handleViewTrackers = (): void => {
    if (allTrackersRef.current) {
      allTrackersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContributeClick = (): void => {
    setIsContributeDialogOpen(true);
  };

  const ContributeContent = () => (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <span className="material-icons text-primary text-xl">trending_up</span>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Ready to Contribute?</h3>
          <p className="text-sm text-muted-foreground">Help improve our data accuracy</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="material-icons text-green-600 text-sm mt-0.5">check_circle</span>
          <div>
            <p className="font-medium text-sm">Commodity Price Tracker</p>
            <p className="text-xs text-muted-foreground">Add price data from your local market</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg opacity-60">
          <span className="material-icons text-muted-foreground text-sm mt-0.5">schedule</span>
          <div>
            <p className="font-medium text-sm">More trackers coming soon</p>
            <p className="text-xs text-muted-foreground">Weather, accidents, and more</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hero Section */}
      <Section variant="default">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="md:w-1/2 lg:w-[45%] mb-6 md:mb-0">
              <Heading as="h1" size="xl" className="mb-4">
                Welcome to BDTracks
              </Heading>
              <p className="text-base md:text-lg mb-6 text-muted-foreground max-w-lg">
                Your comprehensive platform for data tracking, tools, and services across
                Bangladesh. Access insights and resources for informed decision-making.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" onClick={handleExplore}>
                  Explore Platform
                </Button>
                {/* <Button variant="outline" onClick={handleLearnMore}>
                  Learn More
                </Button> */}
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-[45%]">
              <Card className="w-full shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg font-medium">
                    Tracking Highlights
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">Last updated: Today</span>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Commodity Prices */}
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-500 text-lg">🛒</span>
                        <span className="font-medium text-sm">Commodity Prices</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Rice</span>
                          <div className="flex items-center">
                            <span className="font-medium text-sm mr-1">৳75</span>
                            <span className="text-xs text-red-500">±2.4%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Onions</span>
                          <div className="flex items-center">
                            <span className="font-medium text-sm mr-1">৳60</span>
                            <span className="text-xs text-green-500">↑3.1%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weather */}
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500 text-lg">🌤️</span>
                        <span className="font-medium text-sm">Weather</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Dhaka</span>
                          <span className="font-medium text-sm">32°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Rainfall</span>
                          <span className="font-medium text-sm">3mm</span>
                        </div>
                      </div>
                    </div>

                    {/* Accidents */}
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500 text-lg">🚨</span>
                        <span className="font-medium text-sm">Accidents</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Today</span>
                          <span className="font-medium text-sm">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">This week</span>
                          <span className="font-medium text-sm">87</span>
                        </div>
                      </div>
                    </div>

                    {/* Health */}
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-500 text-lg">🏥</span>
                        <span className="font-medium text-sm">Health</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Hospitals</span>
                          <span className="font-medium text-sm">130</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Clinics</span>
                          <span className="font-medium text-sm">450+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      onClick={handleViewTrackers}
                    >
                      View All Trackers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section variant="muted">
        <Container>
          <Grid cols={2} className="text-center items-center">
            {/* <div className="bg-muted/20 p-4 md:p-5 rounded-lg">
              <span className="material-icons text-primary text-3xl mb-1">category</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">1000+</h3>
              <p className="text-sm text-muted-foreground">Tracking Categories</p>
            </div> */}
            <div className="bg-muted/20 p-4 md:p-5 rounded-lg">
              <span className="material-icons text-primary text-3xl mb-1">public</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">24/7</h3>
              <p className="text-sm text-muted-foreground">Real-time Updates</p>
            </div>
            <div className="bg-muted/20 p-4 md:p-5 rounded-lg">
              <span className="material-icons text-primary text-3xl mb-1">verified</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">64</h3>
              <p className="text-sm text-muted-foreground">Districts Covered</p>
            </div>
            {/* <div className="bg-muted/20 p-4 md:p-5 rounded-lg">
              <span className="material-icons text-primary text-3xl mb-1">groups</span>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">100K+</h3>
              <p className="text-sm text-muted-foreground">Trusted Users</p>
            </div> */}
          </Grid>
        </Container>
      </Section>

      {/* Comprehensive Services Platform */}
      <Section variant="default" ref={servicesRef} className="scroll-mt-15">
        <Container>
          <div className="text-center mb-10">
            <Heading size="lg" className="mb-3">
              Comprehensive Services Platform
            </Heading>
            <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto">
              Our platform brings together data trackers, calculators, and services from across
              Bangladesh, providing insights and tools for a variety of sectors in one unified
              interface.
            </p>
          </div>

          {/* Data Trackers */}
          <div className="mb-12 scroll-mt-24" ref={allTrackersRef}>
            <Heading size="md" className="mb-5 flex items-center">
              <span className="material-icons mr-2">insights</span> Data Trackers
            </Heading>

            <Grid cols={2}>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">traffic</span>
                    Road Accident Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Our dashboard collects up-to-date overview of road accidents, including total
                    impact and geographical distribution.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs mt-auto" asChild>
                    <Link to="/accidents">View</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">trending_up</span>
                    Commodity Price Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Stay informed about the latest market trends with our commodity price tracker.
                    Users can verify if the information is current and accurate.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs mt-auto" asChild>
                    <Link to="/commodities">View</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">power</span>
                    National Outage Detector
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Our interactive tool provides real-time updates on power outages across the
                    country, helping you stay prepared and informed.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs pointer-events-none mt-auto"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">cloud</span>
                    Weather Forecast and Modeling
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Stay ahead of the weather with our advanced weather forecast and numerical
                    modeling service. We use Google TensorFlow to provide accurate predictions.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs pointer-events-none mt-auto"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </div>

          {/* Calculators & Tools */}
          <div className="mb-12">
            <Heading size="md" className="mb-5 flex items-center">
              <span className="material-icons mr-2">calculate</span> Calculators & Tools
            </Heading>

            <Grid cols={2}>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">bolt</span>
                    Energy Cost Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Calculate your energy consumption with our energy cost calculator, designed to
                    give you an estimate of your monthly energy bills.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-auto"
                    onClick={() => window.location.href = '/energy-calculator'}
                  >
                    Try Calculator
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">wb_sunny</span>
                    Photovoltaic System Design Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Design your solar panel system with our Photovoltaic System Design Calculator.
                    This tool is designed to help you estimate size, capacity, and cost of your
                    system.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs pointer-events-none mt-auto"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </div>

          {/* Public Services */}
          <div>
            <Heading size="md" className="mb-5 flex items-center">
              <span className="material-icons mr-2">public</span> Public Services
            </Heading>

            <Grid cols={2}>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">how_to_vote</span>
                    Election Vote Survey
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    Participate in our democratic process with our voting survey platform. Share
                    your opinions and see what others think about current political issues.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs pointer-events-none mt-auto"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="material-icons text-primary mr-2">campaign</span>
                    July Movement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col h-full">
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">
                    From July 1st to August 5th, 2024, Bangladesh witnessed a historic
                    transformation. Known as the "36th July," this period marked a peaceful
                    revolution that changed the nation's course forever.
                  </p>
                  {/* <Button variant="outline" size="sm" className="w-full text-xs mt-auto" asChild>
                    <Link
                      to="https://bdmovements.bdtracks.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Link>
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs pointer-events-none mt-auto"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Contribute Section */}
      <Section variant="muted">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <Heading size="lg" className="mb-3">
                Contribute to Our Data
              </Heading>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Help improve our database by submitting updates from your region or district! Share
                data for any of our tracking categories.
              </p>
              <Button
                variant="default"
                className="w-full md:w-auto"
                onClick={handleContributeClick}
              >
                Contribute Data
              </Button>
            </div>
            <div className="w-full md:w-1/3">
              <Card className="shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <span className="material-icons text-primary text-3xl mb-3">
                    assignment_turned_in
                  </span>
                  <h3 className="text-lg font-bold mb-2">Why Contribute?</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Help improve data accuracy</li>
                    <li>• Support your local community</li>
                    <li>• Make Bangladesh's data more transparent</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Responsive Contribute Modal */}
      {isDesktop ? (
        <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Contribute to BDTracks</DialogTitle>
              <DialogDescription className="sr-only">
                Learn how you can contribute data to our platform
              </DialogDescription>
            </DialogHeader>
            <ContributeContent />
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsContributeDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Maybe Later
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/commodities" onClick={() => setIsContributeDialogOpen(false)}>
                  Start Contributing
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Contribute to BDTracks</DrawerTitle>
              <DrawerDescription className="sr-only">
                Learn how you can contribute data to our platform
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <ContributeContent />
            </div>
            <DrawerFooter>
              <Button asChild>
                <Link to="/commodities" onClick={() => setIsContributeDialogOpen(false)}>
                  Start Contributing
                </Link>
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Maybe Later</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default HomePage;
