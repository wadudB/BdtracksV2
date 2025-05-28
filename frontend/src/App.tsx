import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CommoditiesPage from "./pages/CommoditiesPage";
import CommodityDetails from "./pages/CommodityDetails";
import MapPage from "./pages/MapPage";
import FindPricesPage from "./pages/FindPricesPage";
import { RootLayout } from "./layouts";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main application routes with standard layout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/commodities" element={<CommoditiesPage />} />
          <Route path="/commodity/:id" element={<CommodityDetails />} />
          <Route path="/commodities/map" element={<MapPage />} />
          <Route path="/find-prices" element={<FindPricesPage />} />

          {/* Add other routes here */}

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* You can add routes with different layouts here 
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
