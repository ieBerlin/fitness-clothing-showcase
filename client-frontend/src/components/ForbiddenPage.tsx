import { Link } from "react-router-dom";
import { ErrorDetails } from "../types/validation-error.types";
import ContentWrapper from "./ContentWrapper";

export default function ForbiddenPage() {
  const errorDetails: ErrorDetails = {
    status: 403,
    title: "Forbidden",
    message: "Access to this resource on the server is denied!",
    buttonLabel: "Log In to Continue",
  };
  return (
    <ContentWrapper>
      <h1 className="text-[100px] font-bold text-red-600">
        {errorDetails.status}
      </h1>
      <h3 className="text-4xl font-semibold text-stone-950">
        {errorDetails.title}
      </h3>
      <p className="text-xl font-medium text-stone-950">
        {errorDetails.message}
      </p>
      <Link
        to="/"
        className="mt-4 font-semibold tracking-widest border rounded md py-4 px-8 text-center bg-gray-900 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
      >
        {errorDetails.buttonLabel}
      </Link>
    </ContentWrapper>
  );
}
