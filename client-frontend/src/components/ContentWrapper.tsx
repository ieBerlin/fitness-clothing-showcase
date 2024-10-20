import { FC, ReactNode, useContext } from "react";
import { NavbarHeightContext } from "../store/navbarStore";

const ContentWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { navbarHeight } = useContext(NavbarHeightContext);

  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: `calc(100vh - ${navbarHeight}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
