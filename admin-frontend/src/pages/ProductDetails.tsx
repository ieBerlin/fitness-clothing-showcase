import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../components/PageTemplate";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { productQueryKey } from "../constants/queryKeys";
import Product from "../models/Product";
import { fetchProduct } from "../utils/authUtils";
import Availability from "../enums/Availability";
import { SERVER_URL } from "../utils/http";
import Image, { angles } from "../models/Image";
import { ErrorResponse } from "../types/response";
import NoImageAvailable from "/NoImageAvailable.jpg";
import { Link } from "react-router-dom";

const ProductShowcase: React.FC = () => {
  const { productId } = useParams();
  const [activeImage, setActiveImage] = useState<Image | undefined>();

  // Fetch product details using React Query
  const {
    data: product,
    isError: isProductError,
    error: productError,
    isLoading: isLoadingProduct,
  } = useQuery<Product, ErrorResponse>({
    queryKey: [productQueryKey, productId],
    queryFn: () => fetchProduct(productId || ""),
    enabled: Boolean(productId),
  });

  // Set the initial displayed image to the first product image
  useEffect(() => {
    if (product?.images[0]) {
      setActiveImage(product.images[0]);
    }
  }, [product?.images]);

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">
          Loading product details...
        </h2>
      </div>
    );
  }

  // Error state
  if (isProductError) {
    return (
      <div className="p-6">
        <ErrorAlert error={productError} />
      </div>
    );
  }

  const onImageSelect = (image?: Image) => {
    setActiveImage(image);
  };

  const imageUrl = `${SERVER_URL}/public/uploads/product/`;

  return (
    <PageTemplate title="Product Showcase">
      <div className="flex flex-col lg:flex-row items-start justify-center lg:space-x-12 p-6 bg-gray-50 min-h-screen">
        {product && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row -mx-4">
                {/* Product Image Section */}
                <div className="md:flex-1 px-4">
                  <div className="h-[460px] rounded-lg bg-white mb-4 shadow-md transition-transform duration-300 hover:shadow-lg">
                    <img
                      loading="lazy"
                      className="rounded-lg w-full h-full object-cover transition-opacity duration-300"
                      src={
                        activeImage?.pathname
                          ? `${imageUrl}${activeImage.pathname}`
                          : NoImageAvailable
                      }
                      alt={`Image of ${product.productName}`}
                    />
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex space-x-4 mb-6">
                    {angles.map((angle) => {
                      const image = product.images.find(
                        (img) => img.angle === angle
                      );
                      const imagePath = image
                        ? `${imageUrl}${image.pathname}`
                        : NoImageAvailable;

                      return (
                        <li
                          key={angle}
                          className={`border transition-transform duration-300 ${
                            activeImage?.angle === angle
                              ? "border-blue-600"
                              : "border-gray-300"
                          } rounded-lg shadow-sm hover:shadow-lg hover:scale-105`}
                        >
                          <button
                            onClick={() => onImageSelect(image)}
                            className="flex flex-col items-center"
                          >
                            <img
                              loading="lazy"
                              className="w-24 h-24 object-cover rounded-t-lg"
                              src={imagePath}
                              alt={`${angle} view`}
                            />
                            <h2 className="text-center text-sm text-gray-700 capitalize py-2">
                              {angle}
                            </h2>
                          </button>
                        </li>
                      );
                    })}
                  </div>
                </div>

                {/* Product Information Section */}
                <div className="md:flex-1 px-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.productName}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    {product.productDescription}
                  </p>

                  {/* Price and Availability */}
                  <div className="mb-6">
                    {/* Price Section */}
                    <div className="flex items-center">
                      <span className="font-bold text-gray-800 text-lg mr-2">
                        Price:
                      </span>
                      <span className="text-2xl font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg shadow">
                        {product.price} DZD
                      </span>
                    </div>

                    {/* Availability Section */}
                    <div className="flex items-center mt-2">
                      <span className="font-bold text-gray-800 text-lg mr-2">
                        Availability:
                      </span>
                      <span
                        style={mapAvailabilityToStyle(product.availability)}
                        className="text-xl font-semibold bg-blue-100 px-2 py-1 rounded-lg shadow"
                      >
                        {formatAvailability(product.availability)}
                      </span>
                    </div>
                  </div>

                  {/* Seasons */}
                  <div className="flex flex-wrap mb-4">
                    <span className="font-bold text-gray-800 mr-2 text-lg">
                      Seasons:{" "}
                    </span>
                    {product.season.map((season, index) => (
                      <span
                        key={index}
                        className={`text-white px-3 py-1 rounded-full mr-3 mb-3 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
        ${
          season === "WINTER"
            ? "bg-gradient-to-r from-blue-500 to-blue-700"
            : season === "SUMMER"
            ? "bg-gradient-to-r from-yellow-500 to-yellow-700"
            : season === "AUTUMN"
            ? "bg-gradient-to-r from-orange-500 to-red-600"
            : "bg-gradient-to-r from-green-500 to-green-700"
        }`}
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/products/${product._id}/edit`}
                      className="mx-auto text-center block text-gray-600 hover:text-gray-800 transition-colors duration-300 text-lg font-semibold py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                      Update Product Information
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

// Utility functions for availability formatting
const formatAvailability = (availability: Availability) => {
  switch (availability) {
    case Availability.IN_STOCK:
      return "In Stock";
    case Availability.OUT_OF_STOCK:
      return "Out of Stock";
    case Availability.DISCOUNTED:
      return "Discounted";
    case Availability.COMING_SOON:
      return "Coming Soon";
    case Availability.OUT_OF_SEASON:
      return "Out of Season";
    case Availability.UNAVAILABLE:
      return "Unavailable";
    default:
      return "Unknown";
  }
};

const mapAvailabilityToStyle = (availability: Availability) => {
  switch (availability) {
    case Availability.IN_STOCK:
      return { color: "#22c55e" }; // green-500
    case Availability.OUT_OF_STOCK:
      return { color: "#ef4444" }; // red-500
    case Availability.DISCOUNTED:
      return { color: "#facc15" }; // yellow-500
    case Availability.COMING_SOON:
      return { color: "#3b82f6" }; // blue-500
    case Availability.OUT_OF_SEASON:
      return { color: "#fb923c" }; // orange-500
    case Availability.UNAVAILABLE:
      return { color: "#6b7280" }; // gray-500
    default:
      return { color: "#6b7280" }; // gray-500 as default
  }
};

export default ProductShowcase;
