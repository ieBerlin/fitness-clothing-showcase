// src/pages/NotFoundPage.tsx
import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 my-8 text-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Go to Home</a>
    </div>
  );
};

export default NotFoundPage;
