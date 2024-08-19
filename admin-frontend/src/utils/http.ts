import { QueryClient } from "@tanstack/react-query";
import { authHeader } from "../services/auth-header.service";
import { json } from "react-router-dom";
import { useEffect, useState } from "react";

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
