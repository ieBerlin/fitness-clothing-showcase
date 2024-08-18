import { QueryClient } from "@tanstack/react-query";
import { authHeader } from "../services/auth-header.service";
import { json } from "react-router-dom";

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
