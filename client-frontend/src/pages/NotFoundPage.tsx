// src/pages/NotFoundPage.tsx
import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <main className="relative w-full h-screen">
      <img
        className="w-full h-full object-cover"
        src="https://www.shutterstock.com/image-photo/three-female-friends-chatting-eating-600nw-2484009473.jpg"
        alt="Background"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-6xl font-extrabold text-white tracking-wide">
          404
        </h1>
        <h3 className="text-4xl font-extrabold text-white mt-2">
          Page Not Found
        </h3>
        <p className="mt-4 text-xl text-gray-200">
          Sorry, the page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-black text-white font-semibold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          Go to Home
        </a>
      </div>
    </main>
  );
};

export default NotFoundPage;
