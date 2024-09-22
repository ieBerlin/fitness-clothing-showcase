import { API_URL, getData } from "../utils/http";
import { authHeader } from "./auth-header.service";
import { IAdmin, IAuthResponse, IErrorResponse } from "../types/response";

export async function register(
  data: IAdmin
): Promise<IAuthResponse | IErrorResponse> {
  try {
    const token = authHeader();
    if (!token["x-access-token"]) {
      return { error: "No token provided", status: 403 };
    }

    const response = await fetch(`${API_URL}auth/signup`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.message || "Registration failed",
        status: response.status,
      };
    }

    return {
      token: result.token,
    };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): IErrorResponse {
  return {
    error: error instanceof Error ? error.message : "Network error",
    status: 500,
  };
}

export const login = async (data: IAdmin) =>
  getData<string>({
    url: new URL(`${API_URL}auth/login`).toString(),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    isTokenRequired: false,
  });

export const verifyToken = async () =>
  getData<null>({
    url: new URL(`${API_URL}auth/check-token`).toString(),
    method: "POST",
  });
