import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts";
import HomePage from "../pages/HomePage";
import CommoditiesPage from "../pages/CommoditiesPage";
import CommodityDetails from "../pages/CommodityDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "commodities",
        element: <CommoditiesPage />,
      },
      {
        path: "commodity/:id",
        element: <CommodityDetails />,
      }
    ],
  },
]); 