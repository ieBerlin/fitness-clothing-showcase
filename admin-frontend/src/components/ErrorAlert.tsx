import { FC } from "react";
import { ErrorResponse } from "../types/response";
import { ValidationError } from "../types/validation-error.types";

const ErrorAlert: FC<{ error: ErrorResponse }> = ({ error }) => {
  const errorMessages: ValidationError[] = error.errors;

  return (
    <div className="flex flex-col items-center justify-center w-full py-10 gap-4 bg-red-100 border border-red-300 rounded-lg shadow-md">
      <h2 className="text-red-600 font-semibold text-lg">
        Something Went Wrong:
      </h2>

      <ul className="text-red-500 w-full px-4">
        {errorMessages.map((err, index) => (
          <li key={index} className="text-gray-700 font-medium text-base">
            <span className="font-semibold text-red-500">{err.field}:</span>{" "}
            {err.message}.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorAlert;
