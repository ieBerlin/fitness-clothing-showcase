import { FC, useState, useRef, useEffect } from "react";
import Product from "../models/Product";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCarousel: FC<{ products: Product[] }> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const maxIndex = Math.ceil(products.length / itemsPerPage) - 1;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 100;
        const itemWidth = 220;
        const numItems = Math.floor(containerWidth / itemWidth);
        setItemsPerPage(numItems || 1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [products.length]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const startIndex = currentIndex * itemsPerPage;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        disabled={currentIndex === 0}
        className={`absolute top-1/2 left-4 z-10 p-2 rounded-full text-white transition-all transform -translate-y-1/2 ${
          currentIndex === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={goToPrevSlide}
      >
        <FaChevronLeft className="text-xl" />
      </button>

      <div
        className="grid gap-4 justify-evenly w-full"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 220px))",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {visibleProducts.map((product) => (
          <div key={product._id}>
            <Link to={product._id}>
              <ProductCard product={product} />
            </Link>
          </div>
        ))}
      </div>

      <button
        disabled={currentIndex === maxIndex}
        className={`absolute top-1/2 right-4 z-10 p-2 rounded-full text-white transition-all transform -translate-y-1/2 ${
          currentIndex === maxIndex
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={goToNextSlide}
      >
        <FaChevronRight className="text-xl" />
      </button>
    </div>
  );
};

export default ProductCarousel;
