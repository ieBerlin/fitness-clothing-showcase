import React from "react";

const ShowcaseSection: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-6xl font-extrabold mb-4 leading-tight tracking-wide drop-shadow-lg animate-fadeIn">
          <span className="text-gradient-to-r from-blue-500 to-purple-500">Welcome</span> to Our Showcase
        </h1>
        <p className="text-xl font-light mb-6 drop-shadow-md animate-fadeIn delay-200">
          Discover the latest trends in fashion and gear.
        </p>
        <a
          href="/products"
          className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-300 transition transform hover:-translate-y-1 hover:scale-105 animate-bounce delay-500"
        >
          Shop Now
        </a>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-2xl animate-bounce-slow"></div>
    </section>
  );
};

export default ShowcaseSection;