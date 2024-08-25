import { QueryClient } from "@tanstack/react-query";
import { authHeader } from "../services/auth-header.service";
import { json } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product, ProductResponse } from "../types/product.types";
import {
  FetchProductParams,
  StoreImageResponse,
} from "../types/component.types";
import { ValidationError } from "../types/validation-error.types";

export const queryClient = new QueryClient();
export const API_URL = "http://localhost:5431/api/";
export async function verifyToken(): Promise<boolean> {
  try {
    const headers = authHeader();

    if (!headers["x-access-token"]) {
      return false;
    }

    const response = await fetch(`${API_URL}auth/check-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (data && data.valid) {
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return false;
  }
}
export const authenticatedLoader = async () => {
  const isValid = await verifyToken();
  if (!isValid) {
    throw json({ data: "Unauthorized access" }, { status: 403 });
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useFetch<T>(initialData: T, fetchedData: T, _arg?: string) {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setData(fetchedData);
          setIsLoading(false);
        }, 3000);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        setError(error);
        setData(null);
        setIsLoading(false);
      }
    };

    getData();
  }, [error, fetchedData]);
  function handleResetData() {
    setData(null);
  }
  return {
    onRestData: handleResetData,
    isFetching: isLoading,
    data,
    error,
  };
}
export const fetchProduct = async ({
  productId,
}: FetchProductParams): Promise<ProductResponse> => {
  const token = authHeader();
  const url = `${API_URL}product/${productId}`;

  if (!token["x-access-token"]) {
    throw {
      field: "Token",
      message: "No token provided",
    } as ValidationError;
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

    switch (response.status) {
      case 200:
        return data as ProductResponse;

      case 400: {
        const errors: ValidationError[] = data.errors ?? [];
        throw errors;
      }

      case 403:
        throw [
          {
            field: "Token",
            message: "Invalid token provided.",
          } as ValidationError,
        ];

      case 404:
        throw [
          {
            field: "Product",
            message: "Product not found.",
          } as ValidationError,
        ];

      case 500:
        throw [
          {
            field: "Server",
            message: "Server error occurred while fetching the product.",
          } as ValidationError,
        ];

      default:
        throw [
          {
            field: "Unknown",
            message: `Unexpected error: ${response.status}`,
          } as ValidationError,
        ];
    }
  } catch (error) {
    if (Array.isArray(error)) {
      throw error;
    }
    throw [
      {
        field: "Network",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      } as ValidationError,
    ];
  }
};

export const createProduct = async (
  product: Product
): Promise<ProductResponse> => {
  const token = authHeader();
  const url = `${API_URL}product`;
  if (!token["x-access-token"]) {
    throw {
      field: "Token",
      message: "No token provided",
    } as ValidationError;
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
    switch (response.status) {
      case 201:
        return data as ProductResponse;

      case 400: {
        const errors: ValidationError[] = data.errors ?? [];
        throw errors;
      }
      case 403:
        throw [
          {
            field: "Token",
            message: "Invalid token provided.",
          } as ValidationError,
        ];

      case 500:
        throw [
          {
            field: "Server",
            message: "Server error occurred while adding the product.",
          } as ValidationError,
        ];

      default:
        throw [
          {
            field: "Unknown",
            message: `Unexpected error: ${response.status}`,
          } as ValidationError,
        ];
    }
  } catch (error) {
    if (Array.isArray(error)) {
      throw error;
    }
    throw [
      {
        field: "Network",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      } as ValidationError,
    ];
  }
};
export const editProduct = async (
  product: Product
): Promise<ProductResponse> => {
  const token = authHeader();
  const url = `${API_URL}product/${product._id}`;
  if (!token["x-access-token"]) {
    throw {
      field: "Token",
      message: "No token provided",
    } as ValidationError;
  }

  try {
    const response = await fetch(url, {
      method: "PUT", // Use "PUT" for updating existing data
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
        ...token,
      },
    });

    const data = await response.json();
    switch (response.status) {
      case 200: // Success response for an update
        return data as ProductResponse;

      case 400: {
        const errors: ValidationError[] = data.errors ?? [];
        throw errors;
      }
      case 403:
        throw [
          {
            field: "Token",
            message: "Invalid token provided.",
          } as ValidationError,
        ];

      case 500:
        throw [
          {
            field: "Server",
            message: "Server error occurred while updating the product.",
          } as ValidationError,
        ];

      default:
        throw [
          {
            field: "Unknown",
            message: `Unexpected error: ${response.status}`,
          } as ValidationError,
        ];
    }
  } catch (error) {
    if (Array.isArray(error)) {
      throw error;
    }
    throw [
      {
        field: "Network",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      } as ValidationError,
    ];
  }
};

// interface StoreImageParams {
//   productId: string;
//   imageAngle: string; // e.g., 'front', 'back', etc.
//   imageFile: File; // This should be the image file to upload
// }

// export const storeImage = async ({ productId, imageAngle, imageFile }: StoreImageParams): Promise<StoreImageResponse> => {
//   const token = authHeader();
//   const url = `${API_URL}image/upload/product/${imageAngle}/${productId}`;
  
//   if (!token["x-access-token"]) {
//     throw {
//       field: "Token",
//       message: "No token provided",
//     } as ValidationError;
//   }

//   const formData = new FormData();
//   formData.append("image", imageFile);

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         ...token,
//       },
//       body: formData,
//     });

//     const data: StoreImageResponse = await response.json();

//     switch (response.status) {
//       case 200:
//         return data; // Return the response data if successful

//       case 400: {
//         const errors: ValidationError[] = data.errors ?? [];
//         throw errors;
//       }
//       case 403:
//         throw [
//           {
//             field: "Token",
//             message: "Invalid token provided.",
//           } as ValidationError,
//         ];
//       case 404:
//         throw [
//           {
//             field: "Product",
//             message: "Product not found.",
//           } as ValidationError,
//         ];
//       case 500:
//         throw [
//           {
//             field: "Server",
//             message: "Server error occurred while updating the product.",
//           } as ValidationError,
//         ];
//       default:
//         throw [
//           {
//             field: "Unknown",
//             message: `Unexpected error: ${response.status}`,
//           } as ValidationError,
//         ];
//     }
//   } catch (error) {
//     if (Array.isArray(error)) {
//       throw error;
//     }
//     throw [
//       {
//         field: "Network",
//         message:
//           error instanceof Error ? error.message : "An unknown error occurred",
//       } as ValidationError,
//     ];
//   }
// };