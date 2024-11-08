import React, { useCallback, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NavbarHeightContext } from "../store/navbarStore";
import links from "../constants/links";
import { Link } from "react-router-dom";

const RootLayout: React.FC = () => {
  const [navbarHoverLabel, setNavbarHoverLabel] = useState<
    "men" | "women" | "unisex" | null
  >(null);

  const toggleNavbarHover = useCallback(
    (label: "men" | "women" | "unisex" | null) => {
      setNavbarHoverLabel(label);
    },
    []
  );

  const { navbarHeight } = useContext(NavbarHeightContext);
  const navbarLinks = links[navbarHoverLabel!];
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar currentTab={navbarHoverLabel} onHover={toggleNavbarHover} />
      {navbarHoverLabel && (
        <main
          onMouseOver={
            navbarHoverLabel
              ? () => toggleNavbarHover(navbarHoverLabel)
              : undefined
          }
          onMouseLeave={() => toggleNavbarHover(null)}
          style={{
            height: `calc(100vh - ${navbarHeight}px)`,
          }}
          className={`bottom-0 left-0 z-[100] fixed w-full bg-white border-t border-gray-200`}
        >
          <div className="flex gap-8 p-6 justify-center">
            {navbarLinks.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="flex flex-col items-center pb-6"
              >
                <h3 className="text-black font-bold mb-4 text-base tracking-wide uppercase">
                  {section.title}
                </h3>
                <div className="flex flex-col items-center space-y-1">
                  {section.items.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.path}
                      className="text-gray-700 capitalize text-sm hover:text-black font-semibold w-full text-center py-1 px-4 rounded-lg transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
      <main className={`flex-grow ${navbarHoverLabel && "blur-lg"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
