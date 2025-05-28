import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  const routesWithoutFooter = ["/find-prices"];

  const shouldHideFooter = routesWithoutFooter.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}
