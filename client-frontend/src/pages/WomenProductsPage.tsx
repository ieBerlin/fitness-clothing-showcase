import React from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const womenProducts: Product[] = [
  {
    id: 1,
    name: "Women Product 1",
    description: "Description of Women Product 1",
    price: 59.99,
    imageUrl: "/path/to/image1.jpg",
  },
  {
    id: 2,
    name: "Women Product 2",
    description: "Description of Women Product 2",
    price: 79.99,
    imageUrl: "/path/to/image2.jpg",
  },
  {
    id: 3,
    name: "Women Product 3",
    description: "Description of Women Product 3",
    price: 49.99,
    imageUrl: "/path/to/image3.jpg",
  },
];

const WomenProductsPage: React.FC = () => {
  return (
    <div className="women-products-page p-8">
      <h1 className="text-3xl font-bold mb-6">Women's Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {womenProducts.map((product) => (
          <div
            key={product.id}
            className="product-card border p-4 rounded shadow"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <button className="mt-4 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600">
              View Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WomenProductsPage;
