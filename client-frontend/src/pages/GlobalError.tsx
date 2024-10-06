// src/pages/GlobalError.tsx
import React from 'react';

const GlobalError: React.FC = () => {
  return (
    <div className="container mx-auto px-4 text-center my-8">
      <h1 className="text-3xl font-bold">Oops!</h1>
      <p className="mt-4">Something went wrong. Please try again later.</p>
      <a href="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Go to Home</a>
    </div>
  );
};

export default GlobalError;
