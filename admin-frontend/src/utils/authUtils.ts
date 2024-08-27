import { authHeader } from "../services/auth-header.service";
import {
  ErrorCode,
  ErrorResponse,
  ErrorSeverity,
  Product,
  ProductResponse,
  ProductsResponse,
  SuccessResponse,
  ValidationError,
} from "../types/product.types";
import {
  FetchProductParams,
  StoreImageResponse,
} from "../types/component.types";
import { API_URL } from "./http";

export async function verifyToken(): Promise<
  SuccessResponse<boolean> | ErrorResponse
> {
  try {
    const headers = authHeader();

    if (!headers["x-access-token"]) {
      throw {
        success: false,
        data: null,
      };
    }

    const response = await fetch(`${API_URL}auth/check-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data.valid as boolean,
      };
    }
    const errorResponse: ErrorResponse = {
      success: false,
      errors: data.errors ?? [],
      statusCode: response.status,
    };

    switch (response.status) {
      case 403:
        errorResponse.errors = [
          {
            field: "Token",
            message: "Invalid token provided.",
            code: ErrorCode.InvalidToken,
            severity: ErrorSeverity.Critical,
          },
        ];
        break;
      case 500:
        errorResponse.errors = [
          {
            field: "Server",
            message: "Server error occurred while verifying the token.",
            code: ErrorCode.ServerError,
            severity: ErrorSeverity.Critical,
          },
        ];
        break;
      default:
        errorResponse.errors = [
          {
            field: "Unknown",
            message: `Unexpected error: ${response.status}`,
            code: ErrorCode.UnknownError,
            severity: ErrorSeverity.Critical,
          },
        ];
    }
    return errorResponse;
  } catch (error) {
    const networkError: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "Network",
          message:
            error instanceof Error
              ? error.message
              : "An unknown network error occurred",
          code: ErrorCode.NetworkError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    return networkError;
  }
}
export async function authenticatedLoader(): Promise<boolean> {
  try {
    const result = await verifyToken();
    // Check if the result is a success response
    if ("success" in result && result.success) {
      return true;
    }

    // Handle error response from verifyToken
    if ("statusCode" in result) {
      const errorResponse = result as ErrorResponse;
      throw new Response(JSON.stringify(errorResponse), {
        status: errorResponse.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle unexpected response format
    throw new Response(
      JSON.stringify({
        success: false,
        errors: [
          {
            field: "Authorization",
            message: "Unauthorized access.",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Critical,
          },
        ],
        statusCode: 403,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Ensure error is handled as ErrorResponse
    const errorResponse: ErrorResponse =
      error instanceof Response
        ? {
            success: false,
            errors: [
              {
                field: "Network",
                message: "Failed to authenticate.",
                code: ErrorCode.UnknownError,
                severity: ErrorSeverity.Critical,
              },
            ],
            statusCode: error.status || 500,
          }
        : {
            success: false,
            errors: [
              {
                field: "Network",
                message:
                  error instanceof Error
                    ? error.message
                    : "An unknown network error occurred",
                code: ErrorCode.NetworkError,
                severity: ErrorSeverity.Critical,
              },
            ],
            statusCode: 500,
          };

    throw new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export const createErrorResponse = (
  message: string,
  statusCode: number,
  field: string,
  code: ErrorCode,
  severity: ErrorSeverity,
  errors: ValidationError[] = []
): ErrorResponse => ({
  success: false,
  errors: [
    ...errors,
    {
      field,
      message,
      code,
      severity,
    },
  ],
  statusCode,
});
export const fetchProducts = async ({
  page = 1,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<SuccessResponse<ProductsResponse>> => {
  const token = authHeader();
  const url = new URL(`${API_URL}product`);
  if (page !== undefined) {
    url.searchParams.append("page", page.toString());
  }
  if (limit !== undefined) {
    url.searchParams.append("limit", limit.toString());
  }
  if (search !== undefined && search !== "" && search?.trim() !== "") {
    url.searchParams.append("search", search.trim());
  }
  if (!token["x-access-token"]) {
    throw createErrorResponse(
      "No token provided",
      401,
      "Token",
      ErrorCode.InvalidToken,
      ErrorSeverity.Critical
    );
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse;
    }
    switch (response.status) {
      case 400:
        throw createErrorResponse(
          "Bad request",
          400,
          "Request",
          ErrorCode.ValidationError,
          ErrorSeverity.Medium,
          data.errors
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
    throw {
      success: false,
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
};
export const fetchProduct = async ({
  productId,
}: FetchProductParams): Promise<SuccessResponse> => {
  const token = authHeader();
  const url = `${API_URL}product/${productId}`;

  if (!token["x-access-token"]) {
    throw createErrorResponse(
      "No token provided",
      401,
      "Token",
      ErrorCode.InvalidToken,
      ErrorSeverity.Critical
    );
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse;
    }
    switch (response.status) {
      case 400:
        throw createErrorResponse(
          "Bad request",
          400,
          "Request",
          ErrorCode.ValidationError,
          ErrorSeverity.Medium,
          data.errors
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
    throw {
      success: false,
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
};
export const deleteProduct = async (
  productId: string
): Promise<SuccessResponse<boolean>> => {
  const token = authHeader();
  const url = `${API_URL}product/${productId}`;

  if (!token["x-access-token"]) {
    throw createErrorResponse(
      "No token provided",
      401,
      "Token",
      ErrorCode.InvalidToken,
      ErrorSeverity.Critical
    );
  }

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse<boolean>;
    }
    switch (response.status) {
      case 400:
        throw createErrorResponse(
          "Bad request",
          400,
          "Request",
          ErrorCode.ValidationError,
          ErrorSeverity.Medium,
          data.errors
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
    throw {
      success: false,
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
};

export const createProduct = async (
  product: Product
): Promise<SuccessResponse> => {
  const token = authHeader();
  const url = `${API_URL}product`;

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
    } as ErrorResponse;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse;
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
              message: "Server error occurred while adding the product.",
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
};

export const editProduct = async (
  product: Product
): Promise<SuccessResponse<ProductResponse>> => {
  const token = authHeader();
  const url = `${API_URL}product/${product._id}`;

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
    } as ErrorResponse;
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse;
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

      case 404:
        throw {
          success: false,
          errors: [
            {
              field: "Product",
              message: "Product not found.",
              code: ErrorCode.NotFound,
              severity: ErrorSeverity.High,
            },
          ],
          statusCode: 404,
        } as ErrorResponse;

      case 500:
        throw {
          success: false,
          errors: [
            {
              field: "Server",
              message: "Server error occurred while updating the product.",
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
};

export const storeImage = async (
  formData: FormData
): Promise<SuccessResponse<StoreImageResponse>> => {
  const token = authHeader();
  const url = `${API_URL}image/upload/product/${formData.get(
    "imageAngle"
  )}/${formData.get("productId")}`;
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
    } as ErrorResponse;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse;
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
              message: "Server error occurred while uploading the image.",
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
};

export const fetchProductsCount = async (): Promise<SuccessResponse> => {
  const token = authHeader();
  const url = `${API_URL}product/count-products`;

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
    } as ErrorResponse;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    if (data.success) {
      return data as SuccessResponse;
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
};
