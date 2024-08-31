import { useRouteError } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import ForbiddenPage from "./ForbiddenPage";
import { ErrorResponse } from "../types/response";

function GlobalError() {
  const error = useRouteError();
  const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (error as ErrorResponse)?.success !== undefined;
  };
  if (isErrorResponse(error)) {
    switch (error.statusCode) {
      case 403:
        localStorage.removeItem("token");
        return <ForbiddenPage />;
      case 404:
        return <NotFoundPage />;
      default: {
        const errorMessage =
          error.errors?.[0]?.message || "An unexpected error occurred.";
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
            <h1 className="text-4xl font-bold mb-4">
              Error {error.statusCode}
            </h1>
            <p className="text-lg mb-4">{errorMessage}</p>
            {error.errors.length > 0 && (
              <ul className="list-disc text-left pl-5">
                {error.errors.map((err, index) => (
                  <li key={index} className="mb-2">
                    <strong>{err.field}</strong>: {err.message} (
                    {err.code || "Unknown Code"})
                  </li>
                ))}
              </ul>
            )}
          </div>
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
