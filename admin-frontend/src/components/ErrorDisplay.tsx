import { isArray } from "lodash";
import { FC } from "react";
import { ErrorResponse } from "../types/response";

const ErrorDisplay: FC<{
  error: ErrorResponse;
}> = ({ error }) => {
  if (!error) return null;
  const errorMessages = isArray(error.errors) ? error.errors : [error];

  return (
    <div className="flex flex-col items-center justify-center w-full py-10 gap-4 bg-red-100 border border-red-300 rounded-lg">
      <h2 className="text-red-600 font-semibold text-lg">
        Something went wrong
      </h2>
      {errorMessages.map((err, index) => (
        <p key={index} className="text-red-500 font-medium text-base">
          {err.message}
        </p>
      ))}
    </div>
  );
};

export default ErrorDisplay;
