import React from "react";

const MenProductsPage: React.FC = () => {
  return (
    <div className="men-products-page p-4">
      <h1 className="text-2xl font-bold mb-4">Men's Products</h1>
      <p className="text-gray-700 mb-6">
        Browse our collection of high-quality men’s clothing, specially curated
        for style and comfort.
      </p>
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="product-item border rounded-lg p-4 flex flex-col items-center">
          <div className="product-image bg-gray-200 w-full h-40 rounded mb-2"></div>
          <h2 className="product-name text-lg font-semibold">Product Name</h2>
          <p className="product-price text-green-600 font-medium">$49.99</p>
        </div>
      </div>
    </div>
  );
};

export default MenProductsPage;
