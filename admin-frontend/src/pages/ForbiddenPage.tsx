import { Link } from "react-router-dom";
import { ErrorDetails } from "../types/auth.types";

export default function ForbiddenPage() {
  const errorDetails = new ErrorDetails(
    403,
    "Forbidden",
    "Access to this resource on the server is denied!",
    "Log In to Continue"
  );

  return (
    <div className="min-h-screen w-full flex bg-gray-100 items-center justify-center flex-col text-center gap-2">
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
    </div>
  );
}
