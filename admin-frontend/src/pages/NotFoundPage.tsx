import { Link } from "react-router-dom";
import BrokenLink from "/broken-link-svgrepo-com.svg";
import { ErrorDetails } from "../types/validation-error.types";

export default function NotFoundPage() {
  const errorDetails: ErrorDetails = {
    status: 404,
    title: "Not Found",
    message: "Sorry, the page you're looking for does not exist.",
    buttonLabel: "Back to Home Page",
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-100 items-center justify-center flex-col md:flex-row text-center gap-6 p-4">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-4xl font-bold text-red-600 my-2">
          {errorDetails.status} {errorDetails.title}
        </h1>
        <p className="text-xl font-medium text-stone-950 my-2">
          {errorDetails.message}
        </p>
        <Link
          to="/"
          className="mt-4 font-semibold tracking-widest border rounded py-4 px-8 bg-gray-900 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
        >
          {errorDetails.buttonLabel}
        </Link>
      </div>
      <div className="w-52 md:ml-10">
        <img src={BrokenLink} alt="Broken Link Icon" />
      </div>
    </div>
  );
}
