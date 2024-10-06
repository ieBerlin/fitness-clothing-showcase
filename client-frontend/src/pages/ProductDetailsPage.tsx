// src/pages/ProductDetailsPage.tsx
import React from 'react';

const ProductDetailsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 my-8">
      <div className="flex flex-col md:flex-row">
        <img src="https://via.placeholder.com/400" alt="Product" className="md:w-1/2 w-full h-auto object-cover" />
        <div className="md:ml-6 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">Product Title</h1>
          <p className="text-gray-700 mt-2">$29.99</p>
          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
