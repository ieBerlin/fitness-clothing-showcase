import { IAdmin, IAuthResponse, IErrorResponse } from "../types/auth.types";
import { API_URL } from "../utils/http";
import { authHeader } from "./auth-header.service";
import {
  ErrorCode,
  ErrorSeverity,
  SuccessResponse,
} from "../types/product.types";
import { createErrorResponse } from "../utils/authUtils";

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

export async function login(
  data: IAdmin
): Promise<SuccessResponse<IAuthResponse>> {
  try {
    const response = await fetch(`${API_URL}auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log(result)
    if (result.success) {
      return result as SuccessResponse;
    }
    switch (response.status) {
      case 400:
        throw createErrorResponse(
          "Bad request",
          400,
          "Request",
          ErrorCode.ValidationError,
          ErrorSeverity.Medium,
          result.errors
        );

      case 403:
        throw createErrorResponse(
          "Invalid token provided",
          403,
          "Token",
          ErrorCode.InvalidToken,
          ErrorSeverity.Critical
        );

      case 404:
        throw createErrorResponse(
          "Product not found",
          404,
          "Product",
          ErrorCode.NotFound,
          ErrorSeverity.High
        );

      case 500:
        throw createErrorResponse(
          "Server error occurred while fetching the product",
          500,
          "Server",
          ErrorCode.ServerError,
          ErrorSeverity.Critical
        );

      default:
        throw createErrorResponse(
          `Unexpected error: ${response.status}`,
          response.status,
          "Unknown",
          ErrorCode.UnknownError,
          ErrorSeverity.Critical
        );
    }
  } catch (error) {
    throw handleError(error);
  }
}
