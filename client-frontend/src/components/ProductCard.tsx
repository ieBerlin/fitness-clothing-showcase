import { FC, useEffect, useState } from "react";
import Availability from "../enums/Availability";
import { SERVER_URL } from "../utils/http";
import Product from "../models/Product";
import ColorOption from "../models/Color";
const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const [activeColor, setActiveColor] = useState<ColorOption | null>(null);
  const setCurrentImageIndex = useState(0)[1];
  const [image, setImage] = useState<string>("https://via.placeholder.com/300");

  useEffect(() => {
    if (product.images.length) {
      setImage(
        `${SERVER_URL}/public/uploads/product/${product.images[0].pathname}`
      );
    }
  }, [product.images]);

  const [hoverInterval, setHoverInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (product.colors.length) {
      setActiveColor(product.colors[0]);
    }
  }, [product.colors]);

  useEffect(() => {
    return () => {
      if (hoverInterval) {
        clearInterval(hoverInterval);
      }
    };
  }, [hoverInterval]);

  const handleMouseOut = () => {
    if (hoverInterval) {
      clearInterval(hoverInterval);
    }
    setCurrentImageIndex(0);
    if (product.images.length) {
      setImage(
        `${SERVER_URL}/public/uploads/product/${product.images[0].pathname}`
      );
    }
  };

  const handleHoverOverImage = () => {
    if (product.images.length > 1) {
      const newInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % product.images.length;
          setImage(
            `${SERVER_URL}/public/uploads/product/${product.images[nextIndex].pathname}`
          );
          return nextIndex;
        });
      }, 1200);
      setHoverInterval(newInterval);
    }
  };

  return (
    <div className="bg-gray-50 overflow-hidden transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 ease-in-out">
      <div
        className="relative group border border-gray-200 "
        onMouseLeave={handleMouseOut}
        onMouseOver={handleHoverOverImage}
      >
        <img
          src={image}
          alt={product.productName}
          className="w-full h-60 object-cover transition-all duration-500 ease-in-out"
        />
        {product.images.length && (
          <>
            {activeColor?.availableSizes?.some(
              (size) => size.sizeAvailability === Availability.IN_STOCK
            ) && (
              <div className="absolute bottom-0 w-full bg-gray-100 bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 grid grid-flow-col text-white text-lg font-semibold">
                <div className="flex flex-wrap justify-start gap-2">
                  {activeColor?.availableSizes
                    .filter(
                      (size) => size.sizeAvailability === Availability.IN_STOCK
                    )
                    .map((size, index) => (
                      <h1
                        key={index}
                        className="inline-block bg-white hover:bg-gray-100 text-black hover:text-black px-2 py-1 text-lg font-semibold mr-2 transition-all duration-300 w-[40px] text-center"
                      >
                        {size.name}
                      </h1>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="px-2 py-4 bg-white">
        <h1 className="text-sm font-medium text-gray-950">
          {product.productName}
        </h1>
        <h2 className="text-xs font-medium text-gray-800">
          DZD {product.price}
        </h2>
      </div>
    </div>
  );
};
export default ProductCard;
