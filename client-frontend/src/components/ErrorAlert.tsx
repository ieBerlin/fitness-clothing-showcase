import { isArray } from "lodash";
import { FC, ReactNode } from "react";
import { ErrorResponse } from "../types/response";
import ContentWrapper from "./ContentWrapper";
import ForbiddenPage from "./ForbiddenPage";
import NotFoundPage from "../pages/NotFoundPage";

const ErrorAlert: FC<{ error: ErrorResponse }> = ({ error }) => {
  if (!error) return null;

  const errorMessages = isArray(error.errors)
    ? error.errors
    : [{ message: error.errors[0] || "An unexpected error occurred." }];
  let content: ReactNode;
  if (error.statusCode === 404) {
    return <NotFoundPage />;
  } else if (error.statusCode === 403) {
    return <ForbiddenPage />;
  } else {
    content = (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
        <h1 className="text-5xl font-bold mb-4 tracking-wide text-white border-b-4 border-gray-800 pb-2">
          Error {error.statusCode}
        </h1>
        <p className="text-lg mb-4 italic font-light text-gray-300">
          {errorMessages[0]?.message || "Something went wrong."}
        </p>
        {errorMessages.length > 1 && (
          <ul className="list-disc text-left pl-5 space-y-2 text-gray-300">
            {errorMessages.map((err, index) => (
              <li key={index} className="text-sm">
                <strong className="uppercase">{err.message || "Error"}</strong>:{" "}
                {err.message}{" "}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return <ContentWrapper>{content}</ContentWrapper>;
};

export default ErrorAlert;
