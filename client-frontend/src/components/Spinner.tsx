import React, { useContext } from "react";
import { NavbarHeightContext } from "../store/navbarStore";

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
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black border-solid"></div>
    </div>
  );
};

export default LoadingSpinner;
