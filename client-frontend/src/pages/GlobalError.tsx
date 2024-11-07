import { useRouteError } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { ErrorResponse } from "../types/response";
import notFoundImage from "/not-found-picture.jpg";
import PageTemplate from "../components/PageTemplate";

function GlobalError() {
  const error = useRouteError();
  const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (error as ErrorResponse)?.success !== undefined;
  };
  if (isErrorResponse(error)) {
    switch (error.statusCode) {
      case 404:
        return <NotFoundPage />;
      default: {
        const errorMessage =
          error.errors?.[0]?.message || "An unexpected error occurred.";
        return (
          <PageTemplate>
            <main className="relative w-full h-screen">
              <img
                className="w-full h-full object-cover"
                src={notFoundImage}
                alt="Background"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <h1 className="text-4xl font-bold mb-4">
                  Error {error.statusCode}
                </h1>
                <h3 className="text-4xl font-extrabold text-white mt-2 uppercase tracking-wider">
                  {errorMessage}
                </h3>
                {error.errors.length > 0 && (
                  <ul className="list-disc text-left pl-5">
                    {error.errors.map((err, index) => (
                      <li
                        key={index}
                        className="mb-2 mt-4 text-xl text-gray-200"
                      >
                        <strong>{err.field}</strong>:{err.message} (
                        {err.code || "Unknown Code"})
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href="/"
                  className="mt-6 inline-block bg-black text-white font-semibold text-lg py-3 px-6 hover:bg-gray-900 transition-all duration-300 ease-in-out"
                >
                  Go to Home
                </a>
              </div>
            </main>
          </PageTemplate>
        );
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-lg">Sorry, there was a problem loading this page.</p>
    </div>
  );
}

export default GlobalError;
