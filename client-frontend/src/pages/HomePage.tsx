import React from "react";
import { useQueries } from "@tanstack/react-query";
import Availability from "../enums/Availability";
import { productQueryKey, sectionQueryKey } from "../constants/queryKeys";
import { fetchProducts, fetchSections } from "../utils/authUtils";
import {
  DataResponse,
  ErrorResponse,
  SectionsResponse,
} from "../types/response";
import Product from "../models/Product";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import heroSectionPicture from "../../public/hero-section-picture.jpg";
import whitelogoimage from "../../public/icon.png";
import CategorySection from "../components/CategoryFilterSection";
import { quotes } from "../constants/quotes";
import { useNavigate } from "react-router-dom";
import popularProductsThumbnail from "/popular-products.jpg";
import onSaleThumbnail from "/on-sale.jpg";
import trendingNowThumbnail from "/trending-now.jpg";
import newArrivalsThumbnail from "/new-arrivals.jpg";
import PageTemplate from "../components/PageTemplate";
import { Link } from "react-router-dom";
import TabButton from "../components/TabButton";
import LoadingSpinner from "../components/LoadingSpinner";
function getThumbnail(category: string): string {
  switch (category.toLowerCase()) {
    case "popular products":
      return popularProductsThumbnail;
    case "on sale":
      return onSaleThumbnail;
    case "new arrivals":
      return newArrivalsThumbnail;
    case "trending now":
      return trendingNowThumbnail;
    default:
      return "";
  }
}
const HomePage: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState<number>(1);
  const [selectedGender, setSelectedGender] = useState<
    "men" | "women" | "unisex"
  >("men");

  useEffect(() => {
    const handler = setInterval(() => {
      setQuoteIndex((prevQuoteIndex: number) => {
        if (prevQuoteIndex === quotes.length - 1) {
          return 0;
        } else {
          return prevQuoteIndex + 1;
        }
      });
    }, 3000);

    return () => {
      clearInterval(handler);
    };
  }, []);

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
            itemLimit: 8,
          }),
      },
    ],
  });

  const [
    {
      data: sectionsData,
      error: fetchError,
      isError: hasError,
      isLoading: sectionsLoading,
    },
    {
      data: productData,
      error: productError,
      isError: productHasError,
      isLoading: productLoading,
    },
  ] = queries;

  let sectionsContent;
  if (sectionsLoading) {
    sectionsContent = <LoadingSpinner />;
  } else if (hasError) {
    sectionsContent = (
      <div>
        Error occurred while fetching sections: {fetchError?.toString()}
      </div>
    );
  } else {
    sectionsContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {sectionsData?.map((section, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 overflow-hidden box-content flex flex-col"
          >
            <img
              src={getThumbnail(section.section.name)}
              alt={section.section.name}
              className="w-full aspect-[16/9] object-cover"
            />

            <div className="p-4 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-gray-900">
                {section.section.name}
              </h3>
              <p className="text-gray-700">
                Shop the latest in {section.section.name.toLowerCase()}.
              </p>
              <div className="w-full flex-grow"></div>
              <Link
                to={`/sections/${section.section.name.replace(/ /g, "-")}`}
                className="w-full"
              >
                <span className="mt-4 bg-black text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-800 transition block text-center">
                  Shop {section.section.name.toLowerCase()}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  let productsContent;
  if (productLoading) {
    productsContent = <LoadingSpinner />;
  } else if (productHasError) {
    productsContent = (
      <div>
        Error occurred while fetching products: {productError?.toString()}
      </div>
    );
  } else {
    productsContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productData?.items?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }
  const navigate = useNavigate();

  function handleGenderChange(gender: "men" | "women" | "unisex") {
    setSelectedGender(gender);
  }
  function handleNavigate(gender: "men" | "women" | "unisex") {
    navigate(`/collections/${gender}`);
  }

  return (
    <PageTemplate title="Quasars Official Store | Gym Clothes & Workout Wear">
      <div className="bg-white">
        <section className="relative bg-white">
          <div className="w-full bg-white text-center py-8">
            <h1 className="text-lg font-extrabold tracking-wider uppercase">
              Quasars - {quotes[quoteIndex]}
            </h1>
          </div>
          <div className="relative">
            <img
              src={heroSectionPicture}
              alt="Fashionable clothing on display"
              className="w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-start gap-4 p-4">
              <img
                src={whitelogoimage}
                alt="Logo"
                className="absolute top-4 right-4 w-16 h-16 object-contain"
              />
              <h1 className="text-white text-2xl font-extrabold uppercase tracking-wider leading-tight">
                Discover the latest in fashion <br /> for men and women
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleNavigate("men")}
                  className={`px-10 font-extrabold uppercase tracking-wider py-3 bg-white text-black rounded-full hover:bg-black hover:text-white transition duration-300 ease-in-out`}
                >
                  Shop Men
                </button>

                <button
                  onClick={() => handleNavigate("women")}
                  className={`px-10 font-extrabold uppercase tracking-wider py-3 bg-black text-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out`}
                >
                  Shop Women
                </button>

                <button
                  onClick={() => handleNavigate("unisex")}
                  className={`px-10 font-extrabold uppercase tracking-wider py-3  bg-black text-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out`}
                >
                  Shop Unisex
                </button>
              </div>
            </div>
          </div>
        </section>

        <CategorySection categoryTitle=" Featured Products">
          {productsContent}
        </CategorySection>
        <CategorySection
          link={{ href: "/products", label: "View All" }}
          categoryTitle=" New Product Drops"
          filterControls={
            <div className="flex justify-start items-start gap-4 mb-4">
              <TabButton
                label={"men"}
                isActive={selectedGender === "men"}
                onClick={() => handleGenderChange("men")}
              />
              <TabButton
                label={"women"}
                isActive={selectedGender === "women"}
                onClick={() => handleGenderChange("women")}
              />
              <TabButton
                label={"unisex"}
                isActive={selectedGender === "unisex"}
                onClick={() => handleGenderChange("unisex")}
              />
            </div>
          }
        >
          {productsContent}
        </CategorySection>
        <CategorySection categoryTitle="Unisex Bestsellers">
          {productsContent}
        </CategorySection>
        <CategorySection categoryTitle="Explore Sections">
          {sectionsContent}
        </CategorySection>
      </div>
    </PageTemplate>
  );
};

export default HomePage;
