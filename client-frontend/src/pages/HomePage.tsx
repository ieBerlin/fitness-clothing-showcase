import React from "react";
import ShowcaseSection from "../components/ShowcaseSection";
import { useQueries } from "@tanstack/react-query";
import Availability from "../enums/Availability";
import { productQueryKey, sectionQueryKey } from "../constants/queryKeys";
import { fetchProducts, fetchSections } from "../utils/authUtils";
import { DataResponse, SectionsResponse } from "../types/response";
import { ErrorResponse } from "react-router-dom";
import Product from "../models/Product";
import NoImageAvailable from "/NoImageAvailable.jpg";
import ProductCard from "../components/ProductCard";

const HomePage: React.FC = () => {
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
      isLoading: loadingState,
    },
    {
      data: productData,
      error: productError,
      isError: productHasError,
      isLoading: productLoading,
    },
  ] = queries;

  // Sections content
  let sectionsContent;
  if (loadingState) {
    sectionsContent = <div>Loading sections content...</div>;
  } else if (hasError) {
    sectionsContent = (
      <div>Error occurred while fetching section: {fetchError?.toString()}</div>
    );
  } else {
    sectionsContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {sectionsData?.map((category, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-md overflow-hidden"
          >
            <img
              src={`https://via.placeholder.com/300?text=${category.section.name}`}
              alt={category.section.name}
              className="w-full h-48 object-cover grayscale"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {category.section.name}
              </h3>
              <p className="text-gray-700">
                Shop the latest in {category.section.name.toLowerCase()}.
              </p>
              <button className="mt-4 bg-black text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-800 transition">
                Shop {category.section.name.toLowerCase()}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Products content
  let productsContent;
  if (productLoading) {
    productsContent = <div>Loading products...</div>;
  } else if (productHasError) {
    productsContent = (
      <div>
        Error occurred while fetching products: {productError?.toString()}
      </div>
    );
  } else {
    productsContent = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {productData?.items?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <ShowcaseSection />

      {/* Featured Products Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Featured Products
        </h2>
        {productsContent}
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-white border-t border-gray-300">
        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Explore Categories
        </h2>
        {sectionsContent}
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold text-center mb-4">Stay Updated!</h2>
        <p className="text-center mb-6">
          Subscribe to our newsletter for the latest updates and exclusive
          offers.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-l-full focus:outline-none  text-black"
          />
          <button className="bg-white text-black font-semibold py-2 px-4 rounded-r-full hover:bg-gray-300 transition">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
