import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQueries } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  DataResponse,
  ErrorResponse,
  SectionsResponse,
} from "../types/response";
import Product from "../models/Product";
import { productQueryKey, sectionQueryKey } from "../constants/queryKeys";
import { fetchProducts, fetchSections } from "../utils/authUtils";
import Availability from "../enums/Availability";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NavbarHeightContext } from "../store/navbarStore";
import ProductCarousel from "../components/ProductCarousel";
import Spinner from "../components/Spinner";
import PageTemplate from "../components/PageTemplate";

const ProductOverviewPage: React.FC = () => {
  const queries = useQueries<
    [[SectionsResponse, ErrorResponse], [DataResponse<Product>, ErrorResponse]]
  >({
    queries: [
      {
        queryKey: sectionQueryKey,
        queryFn: () => fetchSections({}),
        select: (data: SectionsResponse) => data,
      },
      {
        queryKey: productQueryKey,
        queryFn: () =>
          fetchProducts({
            availability: Object.values(Availability),
            itemLimit: Infinity,
          }),
        select: (data: DataResponse<Product>) => data,
      },
    ],
  });

  const [
    {
      data: sectionsData,
      error: fetchError,
      isError: hasError,
      isLoading: loadingState,
    },
    {
      data: productData,
      error: productError,
      isError: productHasError,
      isLoading: productLoading,
    },
  ] = queries;
  const { navbarHeight } = useContext(NavbarHeightContext);
  const productsContainerRef = useRef<HTMLDivElement | null>(null);
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);
  useEffect(() => {
    const handleScrollEvent = () => {
      if (productsContainerRef.current) {
        const { top } = productsContainerRef.current.getBoundingClientRect();
        setIsNavbarSticky(top - navbarHeight <= 0);
      }
    };

    window.addEventListener("scroll", handleScrollEvent);
    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [navbarHeight]);

  if (productHasError) {
    return <div>Error: {productError.toString()}</div>;
  }
  if (productLoading) {
    return <Spinner />;
  }
  let SectionContent;

  if (hasError) {
    SectionContent = (
      <div className="text-red-500 text-center">
        Error: {fetchError.toString()}
      </div>
    );
  } else if (loadingState) {
    SectionContent = <div className="text-center">Loading...</div>;
  } else if (!sectionsData?.length) {
    SectionContent = (
      <div className="text-center text-gray-500">No sections available</div>
    );
  } else {
    SectionContent = (
      <section className="p-4">
        {sectionsData.map((section, index) => (
          <div key={index}>
            <div className="bg-white rounded-lg mb-6 border-t border-gray-300">
              <div className="py-4 px-2 md:px-4 lg:px-8 bg-white">
                <h2 className="text-2xl font-bold tracking-widest uppercase text-black text-left">
                  {section.section.name}
                </h2>
                <p className="text-gray-900 mb-4 capitalize">
                  {section.section.description}
                </p>
              </div>

              {section.products.items && (
                <ProductCarousel
                  products={section.products.items || []}
                  renderedItem={(item) => <ProductCard product={item} />}
                />
              )}
            </div>
          </div>
        ))}
      </section>
    );
  }
  return (
    <PageTemplate title="All Products">
      <Navbar />
      <div className="relative w-full h-[300px]">
        <img
          src="https://row.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F4rRgFFaSrU4F5UTfyKEW7x%2Fd87c9e93e1dbf6f744c9d7362164c50a%2FCollection_Banner_-_Desktop.png&w=1664&q=85"
          alt="Powerhouse Men's Collection"
          className="absolute h-full w-full left-0 top-0 right-0 bottom-0 object-cover text-transparent transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <div className="relative z-10 flex flex-col justify-center items-start p-4 bg-black bg-opacity-20 h-full">
          <h2 className="text-lg font-bold text-white uppercase">Powerhouse</h2>
          <div className="flex items-end">
            <h2 className="text-3xl font-semibold text-white uppercase">
              Browse Our Collection
            </h2>
            <p className="text-sm text-white ml-2">
              ({productData?.items?.length} Products)
            </p>
          </div>
          <h6 className="text-white mt-2 text-base">
            Enhance your workout gear or find your next favorite outfit.
            Discover the complete men's collection at Powerhouse now!
          </h6>
        </div>
      </div>

      <main className="flex flex-row relative">
        <FilterSidebar
          style={
            isNavbarSticky
              ? {
                  position: "sticky",
                  top: navbarHeight,
                  left: 0,
                  backgroundColor: "white",
                  height: "100vh",
                  overflowY: "auto",
                }
              : {}
          }
        />

        <div className="container mx-auto px-4 py-8" ref={productsContainerRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productData?.items?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <main className="py-8 border-t border-gray-300">
        <div className="text-start p-6 bg-white rounded-lg">
          <h1 className="text-xl font-bold text-black mb-2 uppercase">
            Discover Men's Quasars
          </h1>
          <p className="text-black text-base leading-relaxed">
            Check out all Men's Quasars clothing. Fitness and gym attire
            designed to match your dedication and hard work in your training.
          </p>
        </div>

        {SectionContent}
      </main>
      <Footer />
    </PageTemplate>
  );
};

export default ProductOverviewPage;
