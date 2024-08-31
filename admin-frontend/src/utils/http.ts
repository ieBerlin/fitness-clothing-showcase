import { QueryClient } from "@tanstack/react-query";
import { authHeader } from "../services/auth-header.service";
import ErrorCode from "../enums/ErrorCode";
import { ErrorSeverity } from "../enums/ErrorSeverity";
import { ErrorResponse, SuccessResponse } from "../types/response";

export const queryClient = new QueryClient();
export const SERVER_URL = "http://localhost:5431";
export const API_URL = SERVER_URL + "/api/";
export async function getData<T>({
  url,
  body,
  method = "GET",
  isTokenRequired = true,
}: {
  method?: string;
  url: RequestInfo;
  body?: BodyInit;
  isTokenRequired?: boolean;
}): Promise<T> {
  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (isTokenRequired) {
    const token = authHeader();
    if (!token["x-access-token"]) {
      throw {
        success: false,
        errors: [
          {
            field: "Token",
            message: "No token provided",
            code: ErrorCode.InvalidToken,
            severity: ErrorSeverity.Critical,
          },
        ],
        statusCode: 403,
      } as ErrorResponse;
    }
    headers = { ...headers, ...token };
  }
  try {
    const response = await fetch(url, {
      method,
      body,
      headers,
    });

    const data: SuccessResponse<T> | ErrorResponse = await response.json();
    if (data.success) {
      return (data as SuccessResponse).data;
    }
    switch (response.status) {
      case 400:
        throw {
          success: false,
          errors: data.errors ?? [],
          statusCode: 400,
        } as ErrorResponse;

      case 403:
        throw {
          success: false,
          errors: [
            {
              field: "Token",
              message: "Invalid token provided.",
              code: ErrorCode.InvalidToken,
              severity: ErrorSeverity.Critical,
            },
          ],
          statusCode: 403,
        } as ErrorResponse;

      case 500:
        throw {
          success: false,
          errors: [
            {
              field: "Server",
              message: "Server error occurred while fetching product count.",
              code: ErrorCode.ServerError,
              severity: ErrorSeverity.Critical,
            },
          ],
          statusCode: 500,
        } as ErrorResponse;

      default:
        throw {
          success: false,
          errors: [
            {
              field: "Unknown",
              message: `Unexpected error: ${response.status}`,
              code: ErrorCode.UnknownError,
              severity: ErrorSeverity.Critical,
            },
          ],
          statusCode: response.status,
        } as ErrorResponse;
    }
  } catch (error) {
    throw {
      success: false,
      statusCode: (error as ErrorResponse).statusCode ?? 500,
      errors: (error as ErrorResponse).errors ?? [
        {
          field: "Network",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          code: ErrorCode.NetworkError,
          severity: ErrorSeverity.Critical,
        },
      ],
    } as ErrorResponse;
  }
}
