import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { DataResponse, ErrorResponse } from "../types/response";
import { useQuery } from "@tanstack/react-query";
import { productQueryKey } from "../constants/queryKeys";
import { fetchProducts } from "../utils/authUtils";
import Availability from "../enums/Availability";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import Product from "../models/Product";
import FilterSidebar from "../components/FilterSidebar";
import { NavbarHeightContext } from "../store/navbarStore";
import CollectionCover from "/collection-cover.jpg";
const collectionData = {
  title: "MEN'S PRODUCTS",
  description:
    "Browse our collection of high-quality men’s clothing, specially curated for style and comfort.",
  coverImageSrc: CollectionCover,
  footerSectionTitle: "Shop Men Quasars",
  footerSectionDescription:
    "Explore all men's clothing. Gym and fitness clothes designed to complement the hard work and dedication you put into your workouts.",
};

const CollectionPage: React.FC = () => {
  const { sexId, collectionId } = useParams<{
    sexId: string;
    collectionId: string;
  }>();
  const {
    data: productData,
    error: productError,
    isError: productHasError,
    isLoading: productLoading,
  } = useQuery<DataResponse<Product>>({
    queryKey: productQueryKey,
    queryFn: () =>
      fetchProducts({
        availability: Object.values(Availability),
        itemLimit: Infinity,
      }),
  });
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
  if (sexId !== "men" && sexId !== "women" && sexId !== "unisex") {
    const error: ErrorResponse = {
      success: false,
      statusCode: 404,
      errors: [],
    };
    throw error;
  }
  if (productHasError) {
    return <div>Error: {productError.toString()}</div>;
  }
  if (productLoading) {
    return <Spinner />;
  }

  return (
    <div className="men-products-page">
      <div className="relative w-full h-[300px]">
        <img
          src={collectionData.coverImageSrc}
          alt="Powerhouse Men's Collection"
          className="absolute h-full w-full left-0 top-0 right-0 bottom-0 object-cover text-transparent transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <div className="relative z-10 flex flex-col justify-center items-start p-4 bg-black bg-opacity-20 h-full">
          <h2 className="text-lg font-bold text-white uppercase">Powerhouse</h2>
          <div className="flex items-end">
            <h2 className="text-3xl font-semibold text-white uppercase">
              {collectionData.title}
            </h2>
            {productData?.totalItems && (
              <p className="text-sm text-white ml-2">
                Total Products:{productData.totalItems}
              </p>
            )}
          </div>
          <h6 className="text-white mt-2 text-base">
            {collectionData.description}
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
      </main>{" "}
      <div className="bg-white mb-12 mt-16">
        <hr className="border-gray-300 mb-6" />
        <div className="p-4">
          <h1 className="text-lg font-bold uppercase mb-2 text-gray-900">
            {collectionData.footerSectionTitle}
          </h1>
          <p className="text-gray-600 text-sm font-semibold mb-2">
            {collectionData.footerSectionDescription}
          </p>
        </div>
        <hr className="border-gray-300 mt-6" />
      </div>
    </div>
  );
};

export default CollectionPage;
