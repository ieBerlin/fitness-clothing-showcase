import { useState, useRef, useEffect, ReactNode } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCarousel = <T,>({
  products,
  renderedItem,
}: {
  products: T[];
  renderedItem: (product: T) => ReactNode;
}) => {
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
        className={`absolute top-1/2 left-4 z-10 p-2 rounded-full transition-all transform -translate-y-1/2 ${
          currentIndex === 0 ? "bg-[#e7e7e7] cursor-not-allowed" : "bg-black"
        }`}
        onClick={goToPrevSlide}
      >
        <FaChevronLeft
          className={`text-base ${
            currentIndex === 0 ? "text-gray-600" : " text-white"
          }`}
        />
      </button>

      <div
        className="grid gap-4 justify-center w-full"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 220px))",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {visibleProducts.map((product) => renderedItem(product))}
      </div>

      <button
        disabled={currentIndex === maxIndex}
        className={`absolute top-1/2 right-4 z-10 p-2 rounded-full text-white transition-all transform -translate-y-1/2 ${
          currentIndex === maxIndex
            ? "bg-[#e7e7e7] cursor-not-allowed"
            : "bg-black"
        }`}
        onClick={goToNextSlide}
      >
        <FaChevronRight
          className={`text-base ${
            currentIndex === maxIndex ? "text-gray-600" : " text-white"
          }`}
        />
      </button>
    </div>
  );
};

export default ProductCarousel;
