import { IAdmin, IAuthResponse, IErrorResponse } from "../types/auth.types";
import { API_URL } from "../utils/http";
import { authHeader } from "./auth-header.service";


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

export async function login(
  data: IAdmin
): Promise<IAuthResponse | IErrorResponse> {
  try {
    const response = await fetch(`${API_URL}auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.message || "Login failed",
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
