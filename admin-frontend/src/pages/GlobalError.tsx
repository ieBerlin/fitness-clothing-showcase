import { useRouteError } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import ForbiddenPage from "./ForbiddenPage";
import { ErrorResponse } from "../types/product.types";

function GlobalError() {
  const error = useRouteError() as ErrorResponse | unknown;
  
  const isErrorResponse = (error: unknown): error is ErrorResponse => {
    return (error as ErrorResponse).statusCode !== undefined;
  };

  if (isErrorResponse(error)) {
    switch (error.statusCode) {
      case 403:
        return <ForbiddenPage />;
      case 404:
        return <NotFoundPage />;
      default: {
        const errorMessage = error.message || "An unexpected error occurred.";
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

  // Fallback error rendering
  return (
    <div>
      <h1>Something went wrong!</h1>
      {error ? (
        <div>
          <p>An unexpected error occurred.</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <p>Sorry, there was a problem loading this page.</p>
      )}
    </div>
  );
}

export default GlobalError;
