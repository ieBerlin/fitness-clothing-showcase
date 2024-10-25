import React from "react";
import { Link } from "react-router-dom";

const ProductNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white border border-gray-200 text-black">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl mb-2">Product Not Found</h2>
      <p className="text-lg mb-6">
        The product you are looking for doesn't exist or has been removed.
      </p>
      <Link
        to="/"
        className="capitalize font-bold px-6 py-3 border border-gray-300 text-white hover:bg-gray-900 bg-black black transition duration-300 ease-in-out"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ProductNotFound;
