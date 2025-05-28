import { useLocation } from "react-router-dom";

type NavigationPaths = {
  showSubNav: string[];
};

export function useNavigation() {
  const location = useLocation();

  const paths: NavigationPaths = {
    showSubNav: ["/commodities", "/commodities/map", "/find-prices"],
  };

  // Check if current path matches exactly
  const isActive = (path: string) => location.pathname === path;

  // Check if current path starts with a prefix
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  // Check if subnav should be shown
  const shouldShowSubNavbar = () => {
    return paths.showSubNav.some(
      (path) => isActive(path) || (path === "/commodities" && isActivePrefix("/commodity/"))
    );
  };

  return {
    currentPath: location.pathname,
    isActive,
    isActivePrefix,
    shouldShowSubNavbar,
  };
}
