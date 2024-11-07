import React, { useContext } from "react";
import { NavbarHeightContext } from "../store/navbarStore";
import LoadingIndicator from "./LoadingIndicator";

const LoadingSpinner: React.FC<{
  isNavbarHeightSignificant?: boolean;
}> = ({ isNavbarHeightSignificant = true }) => {
  const { navbarHeight } = useContext(NavbarHeightContext);
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: isNavbarHeightSignificant
          ? `calc(100vh - ${navbarHeight}px)`
          : "100vh",
      }}
    >
      <LoadingIndicator dimensions="h-16 w-16" />
    </div>
  );
};

export default LoadingSpinner;
