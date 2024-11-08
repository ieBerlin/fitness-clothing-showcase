import { forwardRef, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LogoImage from "/customized-icon.png";
import { NavbarHeightContext } from "../store/navbarStore";
interface NavbarProps {
  currentTab: "men" | "women" | "unisex" | null;
  onHover: (label: "men" | "women" | "unisex" | null) => void;
}
const Navbar = forwardRef<HTMLDivElement, NavbarProps>(function Navbar(
  { onHover, currentTab },
  ref
) {
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
      className="bg-white shadow-md px-4 sticky top-0 left-0 w-full z-[100]"
      ref={navbarRef}
    >
      <div className="flex items-end w-full px-4 bg-white" ref={ref}>
        <div className="flex items-center py-4">
          <Link to="/">
            <img src={LogoImage} alt="Brand Logo" className="h-10 invert" />
          </Link>
        </div>
        <div className="flex w-full flex-row justify-center self-stretch items-stretch">
          <Link
            to="/collections/men"
            onMouseOver={() => onHover("men")}
            onMouseLeave={() => onHover(null)}
          >
            <h2
              className={`${
                currentTab === "men" && "border-b-2 border-black"
              } text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase flex-grow h-full flex items-center justify-center`}
            >
              Men's
            </h2>
          </Link>
          <Link
            to="/collections/women"
            onMouseOver={() => onHover("women")}
            onMouseLeave={() => onHover(null)}
          >
            <h2
              className={`${
                currentTab === "women" && "border-b-2 border-black"
              } text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase flex-grow h-full flex items-center justify-center`}
            >
              Women's
            </h2>
          </Link>
          <Link
            to="/collections/unisex"
            onMouseOver={() => onHover("unisex")}
            onMouseLeave={() => onHover(null)}
          >
            <h2
              className={`${
                currentTab === "unisex" && "border-b-2 border-black"
              } text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase flex-grow h-full flex items-center justify-center`}
            >
              Unisex's
            </h2>
          </Link>
        </div>
        <div className="flex items-center py-4">
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
});

export default Navbar;
