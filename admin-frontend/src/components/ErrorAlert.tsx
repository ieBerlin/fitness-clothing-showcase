import { FC } from "react";
import { ErrorResponse } from "../types/response";
import { ValidationError } from "../types/validation-error.types";
import { formatMessage } from "../utils/func";

const ErrorAlert: FC<{ error: ErrorResponse; isTheTitleShown?: boolean }> = ({
  error,
  isTheTitleShown = true,
}) => {
  const errorMessages: ValidationError[] = error.errors;
  console.log(errorMessages);
  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${
        isTheTitleShown ? "py-10" : "py-4"
      } gap-4 bg-red-100 border border-red-300`}
    >
      {isTheTitleShown && (
        <h2 className="text-red-600 font-semibold text-lg">
          Something Went Wrong:
        </h2>
      )}
      <ul className="text-red-500 w-full px-4">
        {errorMessages.map((err, index) => (
          <li
            key={index}
            className="flex flex-col mb-2 text-gray-700 font-medium text-base"
          >
            <span className="font-semibold text-red-600">
              {formatMessage(err.field)}:
            </span>
            <span className="text-gray-800 mt-1">
              {formatMessage(err.message)}.
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorAlert;
