import React, { forwardRef, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LogoImage from "/customized-icon.png";
import { NavbarHeightContext } from "../store/navbarStore";

const Navbar = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Navbar(_, ref) {
    const { onUpdateHeight } = useContext(NavbarHeightContext);
    const navbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (navbarRef.current) {
        onUpdateHeight({
          navbarHeight: navbarRef.current.offsetHeight,
        });
      }
    }, [onUpdateHeight]);
    return (
      <nav
        className="bg-white shadow-md sticky top-0 left-0 w-full z-[100]"
        ref={navbarRef}
      >
        <div
          className="container mx-auto px-4 py-4 flex justify-between items-center"
          ref={ref}
        >
          <div className="flex items-center">
            <Link to="/">
              <img src={LogoImage} alt="Brand Logo" className="h-10 invert" />
            </Link>
          </div>

          <div className="flex flex-row text-center flex-grow justify-center">
            <Link to="/collections/men">
              <h2 className="text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase">
                Men's
              </h2>
            </Link>
            <Link to="/collections/women">
              <h2 className="text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase">
                Women's
              </h2>
            </Link>
            <Link to="/collections/unisex">
              <h2 className="text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase">
                Unisex's
              </h2>
            </Link>
          </div>
          <div className="flex items-center">
            <button className="text-black p-2 rounded-full transition duration-300 hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    );
  }
);

export default Navbar;
