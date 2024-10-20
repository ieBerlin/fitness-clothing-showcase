import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "../utils/authUtils";
import Spinner from "../components/Spinner";
import {
  DataResponse,
  ErrorResponse,
  ProductResponse,
} from "../types/response";
import { NavbarHeightContext } from "../store/navbarStore";
import Availability from "../enums/Availability";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import NoImageAvailable from "/NoImageAvailable.jpg";
import Image, { angles } from "../models/Image";
import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/16/solid";
import ProductCarousel from "../components/ProductCarousel";
import Product from "../models/Product";
import { productQueryKey } from "../constants/queryKeys";
import ErrorAlert from "../components/ErrorAlert";
import { imageUrl } from "../utils/http";

const ProductDetailsPage: React.FC = () => {
  const [weReachBottom, setWeReachBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const handleColorSelect = (colorName: string) => {
    setActiveColor(colorName === activeColor ? null : colorName);
  };

  const { productId } = useParams<{ productId: string }>();
  const thumbnailRef = useRef<HTMLImageElement | null>(null);

  const {
    data: product,
    error,
    isError,
    isLoading,
  } = useQuery<ProductResponse, ErrorResponse>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId!),
    retry: 1,
  });
  const { navbarHeight } = useContext(NavbarHeightContext);
  const [visibilityState, setVisibilityState] = useState<{
    showImageOverview: boolean;
    zoomIn: boolean;
  }>({
    showImageOverview: true,
    zoomIn: false,
  });

  const [activeImage, setActiveImage] = useState<Image | null>(null);

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [product?.images]);

  const handleImageSelect = (image: Image | null) => {
    if (image) {
      setActiveImage(image);
    }
  };

  type VisibilityKeys = keyof typeof visibilityState;

  const toggleVisibility = (key: VisibilityKeys) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  const [isDescriptionShown, setIsDescriptionShown] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { bottom } = contentRef.current.getBoundingClientRect();
        const isChanged = bottom + navbarHeight <= window.innerHeight;
        setWeReachBottom(isChanged);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navbarHeight]);

  const [isAdditionalInfoShown, setIsAdditionalInfoShown] =
    useState<boolean>(false);
  if (isLoading) {
    return <Spinner isNavbarHeightSignificant />;
  }

  if (isError) {
    return <ErrorAlert error={error as ErrorResponse} />;
  }

  const selectedColor = product?.colors.find(
    (color) => color.name === activeColor
  );

  function handleDescriptionChange() {
    setIsDescriptionShown((prevVal) => !prevVal);
  }
  function handleAdditionalInfoChange() {
    setIsAdditionalInfoShown((prevVal) => !prevVal);
  }

  return (
    <div>
      <div
        className="relative flex-grow flex-1 grid grid-cols-2 bg-white"
        style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
      >
        {/* Image Component */}
        <div className="bg-white relative">
          <div
            className="bg-white"
            style={{
              // position: weReachBottom ? "initial" : "fixed",
              // width: weReachBottom ? "100%" : "50%",
              position: weReachBottom ? "initial" : "initial",
              width: weReachBottom ? "100%" : "100%",
            }}
          >
            {activeImage ? (
              <img
                ref={thumbnailRef}
                style={{
                  backgroundColor: activeImage.pathname.endsWith(".png")
                    ? "#ffffff"
                    : "transparent",
                }}
                src={
                  activeImage.pathname
                    ? `${imageUrl}${activeImage.pathname}`
                    : NoImageAvailable
                }
                alt={activeImage.angle || "Product Image"}
                className="w-full h-auto"
              />
            ) : (
              <img
                src={NoImageAvailable}
                alt="No Image Available"
                className="w-full h-auto"
              />
            )}
            <div
              className={`py-2 flex flex-col items-center justify-between absolute top-0 left-0 h-full w-full `}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleVisibility("showImageOverview")}
                  className="flex items-center justify-center p-1 rounded-full bg-white shadow-md duration-200 hover:scale-110"
                  aria-label="Toggle Image Overview"
                >
                  {visibilityState.showImageOverview ? (
                    <EyeIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-blue-600" />
                  )}
                </button>
                <button
                  onClick={() => toggleVisibility("zoomIn")}
                  className="flex items-center justify-center p-1 rounded-full bg-white shadow-md duration-200 hover:scale-110"
                  aria-label="Toggle Zoom"
                >
                  {visibilityState.zoomIn ? (
                    <MagnifyingGlassPlusIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <MagnifyingGlassMinusIcon className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              </div>
              <div
                className={` ${
                  !weReachBottom
                    ? `bottom-5 h-[calc(100vh - ${navbarHeight}px)]`
                    : ""
                }`}
                style={{
                  position: weReachBottom ? "initial" : "fixed",
                }}
              >
                <div className={`flex flex-row items-center justify-between `}>
                  {visibilityState.showImageOverview && (
                    <ul className="flex space-x-4 justify-center">
                      {angles.map((angle) => {
                        const image = product?.images?.find(
                          (img) => img.angle === angle
                        );
                        if (!image) return;
                        const imagePath = image
                          ? `${imageUrl}${image.pathname}`
                          : NoImageAvailable;

                        return (
                          <li
                            key={angle}
                            className={`transition-transform duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-105 ${
                              activeImage?.angle === angle
                                ? "bg-gray-800 border-gray-800 scale-110"
                                : "bg-white border border-gray-300"
                            }`}
                          >
                            <button
                              onClick={() => handleImageSelect(image!)}
                              className="flex flex-col items-center p-[1px]"
                            >
                              <img
                                loading="lazy"
                                className="w-16 h-16 object-cover"
                                src={imagePath}
                                alt={`${angle} view`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div
          ref={contentRef}
          className="py-10 px-8 flex flex-col justify-center space-y-6 transform transition-transform hover:scale-105 w-[calc(100%/1.05)]"
        >
          {/* Product Name */}
          <h2 className="text-black font-extrabold uppercase tracking-wider text-3xl">
            {product?.productName || "Product Name"}
          </h2>

          {/* Product Price */}
          <h6 className="font-semibold text-gray-800 tracking-wider text-xl">
            {product?.price ? `DZD${product.price}` : "Price not available"}
          </h6>

          {/* Product Colors */}
          {product?.colors.length ? (
            <ul className="flex gap-4">
              {product.colors.map((item) => (
                <li
                  key={item.name}
                  className={`h-10 w-10 rounded-full border border-gray-400 cursor-pointer ${
                    activeColor === item.name ? "ring-2 ring-black" : ""
                  }`}
                  style={{
                    backgroundColor: item.name.toLowerCase(), // Assumes color is in a valid CSS format
                  }}
                  title={item.name}
                  onClick={() => handleColorSelect(item.name)}
                />
              ))}
            </ul>
          ) : (
            <div>No Colors Available</div>
          )}

          {selectedColor && selectedColor.availableSizes.length > 0 && (
            <div className="w-full px-6 py-4 bg-gradient-to-br from-gray-950 to-black  text-black text-lg font-semibold">
              {selectedColor.availableSizes.some(
                (size) => size.sizeAvailability === Availability.IN_STOCK
              ) ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedColor.availableSizes
                    .filter(
                      (size) => size.sizeAvailability === Availability.IN_STOCK
                    )
                    .map((size, index) => (
                      <div
                        key={index}
                        className="group relative rounded-full bg-white shadow-md transition-transform duration-300 transform hover:scale-110 hover:shadow-xl cursor-pointer w-10 h-10 flex items-center justify-center text-lg font-semibold text-gray-800"
                        title={`Size: ${size.name}`}
                      >
                        {size.name}

                        {/* Tooltip on hover */}
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-1 p-2 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                          Available
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full text-center bg-gray-50 rounded-md p-4 border border-gray-300">
                  <span className="text-gray-500 italic text-base">
                    Sorry, no sizes available at the moment. Please check back
                    later!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Gender Specification */}
          <div className="text-center py-2 bg-gray-100 border border-black ">
            {product?.isUnisex ? (
              <span className="text-black font-bold uppercase">
                Unisex Product
              </span>
            ) : (
              <span className="text-black font-bold">
                Gender Specific Product
              </span>
            )}
          </div>

          {/* Description Toggle */}
          <button
            onClick={handleDescriptionChange}
            className="w-full py-2 px-4 bg-black text-white font-bold rounded-lg shadow-md hover:bg-gray-900 transition-colors flex items-center justify-between"
          >
            <span className="uppercase">Description</span>
            <ChevronRightIcon
              className={`h-5 w-5 transition-transform ${
                isDescriptionShown ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>

          {/* Product Description */}
          {isDescriptionShown && (
            <div className="text-gray-600 text-base mt-4 border-t pt-4">
              {product?.productDescription || "No description available."}
            </div>
          )}
          <button
            onClick={handleAdditionalInfoChange}
            className="w-full py-2 px-4 bg-black text-white font-bold rounded-lg shadow-md hover:bg-gray-900 transition-colors flex items-center justify-between"
          >
            <span className="uppercase">More Info</span>
            <ChevronRightIcon
              className={`h-5 w-5 transition-transform ${
                isAdditionalInfoShown ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>

          {/* Additional Information Display */}
          {isAdditionalInfoShown && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-gray-700">
              {/* Release Date */}
              {product?.releaseDate && (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Release Date:</span>
                  <time className="text-gray-900 italic">
                    {new Date(product.releaseDate).toLocaleDateString()}
                  </time>
                </div>
              )}

              {/* Wool Percentage */}
              {product?.woolPercentage !== undefined && (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Wool Content:</span>
                  <span
                    className={`text-gray-900 font-bold ${
                      product.woolPercentage > 50
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {product.woolPercentage}% Wool
                  </span>
                </div>
              )}

              {/* Seasons */}
              {product?.season?.length && (
                <div className="flex flex-col">
                  <span className="font-semibold">
                    Perfect for These Seasons:
                  </span>
                  <ul className="flex space-x-3 mt-2 justify-center">
                    {product.season.map((season, index) => (
                      <li
                        key={index}
                        className={`px-4 py-1 rounded-full shadow-lg text-white ${
                          season === "WINTER"
                            ? "bg-blue-500"
                            : season === "SUMMER"
                            ? "bg-yellow-500"
                            : season === "AUTUMN"
                            ? "bg-orange-500"
                            : "bg-green-500"
                        } text-sm font-medium`}
                      >
                        {season.charAt(0).toUpperCase() +
                          season.slice(1).toLowerCase()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <SuggestedProducts id={productId} />
    </div>
  );
};

export default ProductDetailsPage;
const SuggestedProducts: FC<{ id?: string }> = () => {
  const products = [];
  const {
    data: productData,
    error: productError,
    isError: productHasError,
    isLoading: productLoading,
  } = useQuery<DataResponse<Product>, ErrorResponse>({
    queryKey: productQueryKey,
    queryFn: () =>
      fetchProducts({
        availability: Object.values(Availability),
        itemLimit: 8,
      }),
    select: (data: DataResponse<Product>) => data,
  });
  if (productHasError) {
    return <div>Error: {productError.toString()}</div>;
  }
  if (productLoading) {
    return <Spinner />;
  }
  if (productData?.items) {
    products.push(...productData.items);
  }
  return (
    <section className="bg-white flex flex-col justify-center py-10 mt-20 px-4">
      <hr className=" mb-4 border-gray-300" />
      <div className="text-start pl-10 mb-6">
        <h2 className="text-black uppercase text-3xl tracking-wider font-bold">
          You Might Like
        </h2>
      </div>
      <ProductCarousel products={products} />
    </section>
  );
};
