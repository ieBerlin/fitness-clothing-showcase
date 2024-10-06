// src/pages/ProductListingPage.tsx
import React from 'react';

const ProductListingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Product Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold">Product Title 1</h2>
            <p className="text-gray-700 mt-2">$29.99</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">View Details</button>
          </div>
        </div>
        {/* Repeat for more products */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold">Product Title 2</h2>
            <p className="text-gray-700 mt-2">$39.99</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">View Details</button>
          </div>
        </div>
        {/* Add more product cards as needed */}
      </div>
    </div>
  );
};

export default ProductListingPage;
