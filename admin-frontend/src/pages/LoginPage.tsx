/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse, useLoaderData, useNavigate } from "react-router-dom";
import { login, verifyToken } from "../services/admin.service";
import { IAdmin } from "../types/response";
function LoginPage() {
  const [inputBorder, setInputBorder] = useState<string>("border-transparent");
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
      console.log(error);
      setInputBorder("border-red-500");
      setIsErrorShown(true);
      setErrorMessage(
        error.status === 400
          ? "Unmatched admin credentials"
          : "An unexpected error occurred"
      );
    },
    onSuccess: () => {
      setEmail("");
      setPassword("");
      setInputBorder("border-transparent");
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
    <div className="bg-blue-300 flex flex-col items-center justify-center min-h-screen p-6">
      <form
        className="flex gap-3 flex-col p-6 bg-gray-200 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmitForm}
        aria-live="polite"
      >
        <label htmlFor="email" className="text-gray-700">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`outline-none focus:border-blue-500 ${inputBorder} border-2 rounded p-2`}
          disabled={isPending}
          required
          placeholder="Type your email..."
          aria-describedby="email-error"
          onFocus={() => {
            setInputBorder("border-transparent");
            setIsErrorShown(false);
          }}
        />
        <label htmlFor="password" className="text-gray-700">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`outline-none focus:border-blue-500 ${inputBorder} border-2 rounded p-2`}
          disabled={isPending}
          required
          placeholder="Type your password..."
          aria-describedby="password-error"
          onFocus={() => {
            setInputBorder("border-transparent");
            setIsErrorShown(false);
          }}
        />
        <button
          type="submit"
          className={`p-2 rounded ${
            isPending ? "bg-gray-500" : "bg-blue-500"
          } text-white`}
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
          <h1 id="password-error" className="text-red-500 text-center text-sm">
            {errorMessage}
          </h1>
        )}
      </form>
    </div>
  );
}

export default LoginPage;

export async function loader(): Promise<boolean> {
  try {
    const tokenResponse = await verifyToken();
    if (tokenResponse) {
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
}
