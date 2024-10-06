import React from "react";
import ShowcaseSection from "../components/ShowcaseSection";

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <ShowcaseSection />

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={`https://via.placeholder.com/300?text=Product+${
                  index + 1
                }`}
                alt={`Product ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Product {index + 1}</h3>
                <p className="text-gray-500">$29.99</p>
                <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-gray-200">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {["Clothing", "Footwear", "Accessories", "Sports Gear"].map(
            (category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={`https://via.placeholder.com/300?text=${category}`}
                  alt={category}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <p className="text-gray-500">
                    Shop the latest in {category.toLowerCase()}.
                  </p>
                  <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition">
                    Shop {category}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-blue-600 text-white">
        <h2 className="text-3xl font-bold text-center mb-4">Stay Updated!</h2>
        <p className="text-center mb-6">
          Subscribe to our newsletter for the latest updates and exclusive
          offers.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-r-full hover:bg-gray-200 transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>&copy; 2024 Showcase Website. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
