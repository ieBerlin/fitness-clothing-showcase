import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "react-router-dom";
import { login } from "../services/admin.service";
import { ErrorResponse, IAdmin } from "../types/response";
function LoginPage() {
  const [isErrorShown, setIsErrorShown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const isAdminAlreadyAuthenticated = useLoaderData();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation<string, ErrorResponse, IAdmin>({
    mutationKey: ["admin"],
    mutationFn: async (token) => {
      const result = await login(token);
      localStorage.setItem("token", result);
      return result;
    },
    onError: (error) => {
      setIsErrorShown(true);
      setErrorMessage(
        error.statusCode === 400
          ? error.errors.length
            ? error.errors.map((error) => error.message).join("\n")
            : "Unmatched admin credentials"
          : "An unexpected error occurred"
      );
    },
    onSuccess: () => {
      setEmail("");
      setPassword("");
      setIsErrorShown(false);
      navigate("/dashboard");
    },
  });

  useEffect(() => {
    if (isAdminAlreadyAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAdminAlreadyAuthenticated, navigate]);

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      setIsErrorShown(true);
      return;
    }
    const data: IAdmin = { email, password };
    mutate(data);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage:
          "url('https://www.theindustry.fashion/wp-content/uploads/2024/09/CNY_3495.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center mb-6">
        <h1 className="text-white text-4xl font-extrabold tracking-wide uppercase">
          Admin Login
        </h1>
        <p className="text-gray-300 mt-2 text-sm uppercase font-bold">
          Authorized Personnel Only
        </p>
        <p className="text-red-600 mt-1 text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded-md">
          Warning: This page is restricted to admins!
        </p>
      </div>

      <form
        className="flex gap-3 flex-col p-6 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmitForm}
        aria-live="polite"
      >
        <label htmlFor="email" className="text-gray-800 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`outline-none border-2 border-gray-300 rounded p-3 bg-white text-gray-800 transition duration-300 focus:border-gray-600`}
          disabled={isPending}
          required
          placeholder="Type your email..."
          aria-describedby="email-error"
          onFocus={() => {
            setIsErrorShown(false);
          }}
        />

        <label htmlFor="password" className="text-gray-800 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`outline-none border-2 border-gray-300 rounded p-3 bg-white text-gray-800 transition duration-300 focus:border-gray-600`}
          disabled={isPending}
          required
          placeholder="Type your password..."
          aria-describedby="password-error"
          onFocus={() => {
            setIsErrorShown(false);
          }}
        />

        <button
          type="submit"
          className={`p-3 rounded-lg font-semibold transition duration-300 ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          } text-white shadow-md`}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7H4zm0 0a8 8 0 018 8v1a7 7 0 00-7-7H4z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        {isErrorShown && (
          <h1
            id="password-error"
            className="text-red-500 text-center text-sm font-bold uppercase"
          >
            {errorMessage}
          </h1>
        )}
      </form>

      <p className="text-white text-xs mt-6 uppercase font-medium tracking-wider">
        © 2024 YourCompany. Unauthorized access is prohibited and will be
        prosecuted.
      </p>
    </div>
  );
}

export default LoginPage;
