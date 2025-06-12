import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { RootLayout } from "./layouts";
import { Toaster } from "sonner";
import React, { Suspense } from "react";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const CommoditiesPage = React.lazy(() => import("./pages/CommoditiesPage"));
const CommodityDetails = React.lazy(() => import("./pages/CommodityDetails"));
const MapPage = React.lazy(() => import("./pages/MapPage"));
const FindPricesPage = React.lazy(() => import("./pages/FindPricesPage"));
const RoadAccidentDashBoard = React.lazy(() => import("./pages/RoadAccidentDashboard"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main application routes with standard layout */}
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/commodities"
            element={
              <Suspense fallback={<PageLoader />}>
                <CommoditiesPage />
              </Suspense>
            }
          />
          <Route
            path="/commodity/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <CommodityDetails />
              </Suspense>
            }
          />
          <Route
            path="/commodities/map"
            element={
              <Suspense fallback={<PageLoader />}>
                <MapPage />
              </Suspense>
            }
          />
          <Route
            path="/find-prices"
            element={
              <Suspense fallback={<PageLoader />}>
                <FindPricesPage />
              </Suspense>
            }
          />
          <Route
            path="/accidents"
            element={
              <Suspense fallback={<PageLoader />}>
                <RoadAccidentDashBoard />
              </Suspense>
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            }
          />
        </Route>

        {/* Routes with different layouts here 
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        */}
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
