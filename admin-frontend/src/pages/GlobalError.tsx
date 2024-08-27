import { useRouteError } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import ForbiddenPage from "./ForbiddenPage";
import { ErrorResponse } from "../types/product.types";

function GlobalError() {
  const error = useRouteError();

  // Type guard to check if the error is an ErrorResponse
  const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (error as ErrorResponse)?.statusCode !== undefined;
  };

  // Type guard to check if the error is a Response object
  const isResponse = (error: unknown): error is Response => {
    return (error as Response).status !== undefined;
  };

  if (isErrorResponse(error)) {
    switch (error.statusCode) {
      case 403:
        return <ForbiddenPage />;
      case 404:
        return <NotFoundPage />;
      default: {
        const errorMessage =
          error.errors?.[0]?.message || "An unexpected error occurred.";
        return (
          <div>
            <h1>Error {error.statusCode}</h1>
            <p>{errorMessage}</p>
            {error.errors.length > 0 && (
              <ul>
                {error.errors.map((err, index) => (
                  <li key={index}>
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

  if (isResponse(error)) {
    switch (error.status) {
      case 403:
        return <ForbiddenPage />;
      case 404:
        return <NotFoundPage />;
      default:
        return (
          <div>
            <h1>Error {error.status}</h1>
            <p>An unexpected error occurred.</p>
          </div>
        );
    }
  }
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>Sorry, there was a problem loading this page.</p>
    </div>
  );
}

export default GlobalError;
