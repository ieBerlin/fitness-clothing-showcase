import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { NavbarHeightContext } from "../store/navbarStore";
import links from "../constants/links";
import { Link } from "react-router-dom";
import LogoImage from "/customized-icon.png";
import SearchBar from "./SearchBar";

const MainLayout: React.FC = () => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);

  const [hoveredCategory, setHoveredCategory] = useState<
    "men" | "women" | "unisex" | null
  >(null);

  const toggleSearchBarVisibility = useCallback(() => {
    setHoveredCategory(null);

    setIsSearchBarVisible((prevState) => !prevState);
  }, []);

  const toggleCategoryHover = useCallback(
    (category: "men" | "women" | "unisex" | null) => {
      setHoveredCategory(category);
    },
    []
  );

  const { navbarHeight } = useContext(NavbarHeightContext);
  const categoryLinks = links[hoveredCategory!];
  const { onUpdateHeight: updateNavbarHeight } =
    useContext(NavbarHeightContext);
  const navbarElementRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (navbarElementRef.current) {
      updateNavbarHeight({
        navbarHeight: navbarElementRef.current.offsetHeight,
      });
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbarElementRef.current.offsetHeight}px`
      );
    }
  }, [updateNavbarHeight]);

  const navigation = useNavigate();

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    if (searchInputRef.current) {
      setHoveredCategory(null);
      setIsSearchBarVisible(false);
      navigation(`/products/search?q=${searchInputRef.current.value}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <nav
        className="bg-white shadow-md px-4 sticky top-0 left-0 w-full z-[100]"
        ref={navbarElementRef}
      >
        <div
          className="flex items-end w-full px-4 bg-white"
          ref={navbarElementRef}
        >
          <div className="flex items-center py-3">
            <Link to="/">
              <img src={LogoImage} alt="Brand Logo" className="h-10 invert" />
            </Link>
          </div>
          <div
            className="flex w-full flex-row justify-center self-stretch items-stretch"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              to="/collections/men"
              onMouseOver={() => toggleCategoryHover("men")}
              onMouseLeave={() => toggleCategoryHover(null)}
            >
              <h2
                className={`${
                  hoveredCategory === "men" && "border-b-2 border-black"
                } text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase flex-grow h-full flex items-center justify-center`}
              >
                Men's
              </h2>
            </Link>
            <Link
              to="/collections/women"
              onMouseOver={() => toggleCategoryHover("women")}
              onMouseLeave={() => toggleCategoryHover(null)}
            >
              <h2
                className={`${
                  hoveredCategory === "women" && "border-b-2 border-black"
                } text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase flex-grow h-full flex items-center justify-center`}
              >
                Women's
              </h2>
            </Link>
            <Link
              to="/collections/unisex"
              onMouseOver={() => toggleCategoryHover("unisex")}
              onMouseLeave={() => toggleCategoryHover(null)}
            >
              <h2
                className={`${
                  hoveredCategory === "unisex" && "border-b-2 border-black"
                } text-black mx-4 hover:text-gray-600 transition duration-300 font-semibold uppercase flex-grow h-full flex items-center justify-center`}
              >
                Unisex's
              </h2>
            </Link>
          </div>
          <div className="flex items-center py-3">
            <button
              onClick={toggleSearchBarVisibility}
              aria-expanded={isSearchBarVisible}
              aria-label={
                isSearchBarVisible ? "Close Search Bar" : "Open Search Bar"
              }
              className="text-black p-2 rounded-full transition duration-300 hover:bg-gray-100"
            >
              {isSearchBarVisible ? (
                // "X" icon to close the search
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
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>
              ) : (
                // Search (magnifying glass) icon
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
              )}
            </button>
          </div>
        </div>
      </nav>

      {hoveredCategory && (
        <main
          onMouseOver={
            hoveredCategory
              ? () => toggleCategoryHover(hoveredCategory)
              : undefined
          }
          onMouseLeave={() => toggleCategoryHover(null)}
          style={{
            height: `calc(100vh - ${navbarHeight}px)`,
          }}
          className={`bottom-0 left-0 z-[102] fixed w-full bg-white border-t border-gray-200`}
        >
          <div className="flex gap-8 p-6 justify-center">
            {categoryLinks.map((section, sectionIndex) => (
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
      {!hoveredCategory && isSearchBarVisible && (
        <main
          onMouseLeave={() => setHoveredCategory(null)}
          style={{
            height: `calc(100vh - ${navbarHeight}px)`,
          }}
          className={`bottom-0 left-0 z-[101] fixed w-full backdrop-blur-lg border-t border-gray-200`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="pt-4 pb-7 w-1/2 md:w-2/5 lg:w-1/3 mx-auto"
          >
            <SearchBar ref={searchInputRef} />
          </form>
          <div className="bg-white py-8 w-[90%] md:w-[80%] lg:w-[70%] mx-auto shadow-2xl rounded-lg">
            <div className="flex items-center space-x-3 px-6">
              <h3 className="text-base font-bold tracking-wider text-gray-900 uppercase">
                Trending Searches
              </h3>
            </div>

            <div className="flex flex-wrap gap-3 px-6 mt-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                />
              </svg>

              <button
                onClick={() => navigation("/search/trending1")}
                className=" uppercase px-5 py-2 bg-gray-50 text-sm text-gray-700 font-bold rounded-md hover:bg-gray-200 transition"
              >
                Trending 1
              </button>
              <button
                onClick={() => navigation("/search/trending2")}
                className=" uppercase px-5 py-2 bg-gray-50 text-sm text-gray-700 font-bold rounded-md hover:bg-gray-200 transition"
              >
                Trending 2
              </button>
              <button
                onClick={() => navigation("/search/trending3")}
                className=" uppercase px-5 py-2 bg-gray-50 text-sm text-gray-700 font-bold rounded-md hover:bg-gray-200 transition"
              >
                Trending 3
              </button>
              <button
                onClick={() => navigation("/search/trending4")}
                className=" uppercase px-5 py-2 bg-gray-50 text-sm text-gray-700 font-bold rounded-md hover:bg-gray-200 transition"
              >
                Trending 4
              </button>
            </div>

            <div className="flex items-center space-x-3 mt-8 px-6">
              <h3 className="text-base font-bold tracking-wider text-gray-900 uppercase">
                Recent Searches
              </h3>
            </div>

            <div className="flex flex-col space-y-3 mt-4 px-6 pb-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17.5 10.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
                <Link
                  to="/search/recent1"
                  className=" uppercase text-sm text-gray-700   hover:text-gray-900 font-medium transition"
                >
                  Recent 1
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17.5 10.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
                <Link
                  to="/search/recent2"
                  className=" uppercase text-sm text-gray-700  hover:text-gray-900 font-medium transition"
                >
                  Recent 2
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17.5 10.5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
                <Link
                  to="/search/recent3"
                  className=" uppercase text-sm text-gray-700 hover:text-gray-900 font-medium transition"
                >
                  Recent 3
                </Link>
              </div>
            </div>
          </div>
        </main>
      )}
      <main className={`flex-grow ${hoveredCategory && "blur-lg"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
