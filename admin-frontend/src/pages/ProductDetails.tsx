import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../components/PageTemplate";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import Product from "../models/Product";
import { fetchProduct } from "../utils/authUtils";
import Availability from "../enums/Availability";
import { NoImageAvailable, SERVER_URL } from "../utils/http";
import Image, { angles } from "../models/Image";
import { ErrorResponse } from "../types/response";
import { Link } from "react-router-dom";
import ProductNotFound from "../components/ProductNotFound";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SeasonTag from "../components/SeasonTag";
import { getQueryKey } from "../constants/queryKeys";

const ProductShowcase: React.FC = () => {
  const { productId } = useParams();
  const [activeImage, setActiveImage] = useState<Image | undefined>();
  const [isDescriptionShown, setIsDescriptionShown] = useState<boolean>(false);

  // Fetch product details using React Query
  const {
    data: product,
    isError: isProductError,
    error: productError,
    isLoading: isLoadingProduct,
  } = useQuery<Product, ErrorResponse>({
    queryKey: getQueryKey("products"),
    queryFn: () => fetchProduct(productId || ""),
    enabled: Boolean(productId),
    retry: 1,
  });

  // Set the initial displayed image to the first product image
  useEffect(() => {
    if (product?.images[0]) {
      setActiveImage(product.images[0]);
    }
  }, [product?.images]);
  function handleDescriptionChange() {
    setIsDescriptionShown((prevVal) => !prevVal);
  }
  let content: ReactNode;
  // Loading state
  const onImageSelect = (image?: Image) => {
    setActiveImage(image);
  };

  const imageUrl = `${SERVER_URL}/public/uploads/product/`;
  if (isLoadingProduct) {
    content = <LoadingSpinner title=" Loading product details..." />;
  } else if (isProductError) {
    if (productError.statusCode === 404) {
      content = <ProductNotFound />;
    } else {
      content = (
        <div className="p-6">
          <ErrorAlert error={productError} />
        </div>
      );
    }
  } else {
    content = (
      <div className=" border border-gray-200 p-6 bg-white">
        {product && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4">
                <div className="h-[460px] rounded-lg bg-white mb-4 shadow-md transition-transform duration-300 hover:shadow-lg">
                  <img
                    loading="lazy"
                    className="w-full h-full object-cover transition-opacity duration-300"
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
                        } shadow-sm hover:shadow-lg hover:scale-105`}
                      >
                        <button
                          onClick={() => onImageSelect(image)}
                          className="flex flex-col items-center"
                        >
                          <img
                            loading="lazy"
                            className="w-24 h-24 object-cover"
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
              <div className="md:flex-1 px-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.productName}
                </h2>
                <button
                  onClick={handleDescriptionChange}
                  className="w-full py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors flex items-center justify-between mb-4"
                >
                  <span className="uppercase">Description</span>
                  <ChevronRightIcon
                    className={`h-5 w-5 transition-transform ${
                      isDescriptionShown ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </button>

                {isDescriptionShown && (
                  <div className="text-gray-600 text-base mt-2 pt-2">
                    {product?.productDescription || "No description available."}
                  </div>
                )}

                <div className="mb-6">
                  <h6 className="font-semibold text-gray-800 tracking-wider text-xl mb-2">
                    {product?.price
                      ? `DZD${product.price}`
                      : "Price not available"}
                  </h6>
                  <span
                    style={mapAvailabilityToStyle(product.availability)}
                    className="text-base font-semibold bg-gray-200 px-2 py-1 rounded-sm"
                  >
                    {formatAvailability(product.availability)}
                  </span>
                </div>

                {product.season.map((season, index) => (
                  <SeasonTag season={season} key={index + season} />
                ))}

                <div className="mt-6">
                  <Link
                    to={`/products/${product._id}/edit`}
                    className="mx-auto text-center block text-gray-600 hover:text-gray-800 transition-colors duration-300 text-lg font-semibold py-3 px-4 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Update Product Information
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <PageTemplate
      title={product?.productName ? product.productName : "Product Showcase"}
    >
      {content}
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
