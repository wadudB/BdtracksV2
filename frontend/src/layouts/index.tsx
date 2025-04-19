import { FC, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

/**
 * Root layout component that wraps all pages with the main layout
 */
export const RootLayout: FC = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

interface LayoutProps {
  children: ReactNode;
}

/**
 * No-layout component that just renders children directly
 * Useful for auth pages or special pages that don't need the main layout
 */
export const NoLayout: FC<LayoutProps> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Future layouts can be added here, for example:
 * - DashboardLayout
 * - AdminLayout
 * - AuthLayout
 * etc.
 */
