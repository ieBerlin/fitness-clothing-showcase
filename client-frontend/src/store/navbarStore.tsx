import { createContext, FC, ReactNode, useCallback, useState } from "react";

interface NavbarContextProps {
  navbarHeight: number;
  footerHeight: number;
  onUpdateHeight: (heights: {
    navbarHeight?: number;
    footerHeight?: number;
  }) => void;
}

const defaultContextValue: NavbarContextProps = {
  navbarHeight: 0,
  footerHeight: 0,
  onUpdateHeight: () => {},
};

const NavbarHeightContext =
  createContext<NavbarContextProps>(defaultContextValue);

interface NavbarProviderProps {
  children: ReactNode;
}

const NavbarProvider: FC<NavbarProviderProps> = ({ children }) => {
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [footerHeight, setFooterHeight] = useState<number>(0);

  const updateHeight = useCallback(
    ({
      navbarHeight,
      footerHeight,
    }: {
      navbarHeight?: number;
      footerHeight?: number;
    }) => {
      if (navbarHeight !== undefined) setNavbarHeight(navbarHeight);
      if (footerHeight !== undefined) setFooterHeight(footerHeight);
    },
    []
  );

  const contextValue = {
    navbarHeight,
    footerHeight,
    onUpdateHeight: updateHeight,
  };

  return (
    <NavbarHeightContext.Provider value={contextValue}>
      {children}
    </NavbarHeightContext.Provider>
  );
};

export default NavbarProvider;
export { NavbarHeightContext };
