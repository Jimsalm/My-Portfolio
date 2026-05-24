"use client";

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  error: string;
  status?: number;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.user?.id) {
    config.headers.set("x-admin-session", session.user.id);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.error ?? error.message ?? "Request failed.";

    if (status === 401 && typeof window !== "undefined") {
      window.location.assign("/admin/login");
    }

    if (status === 404) {
      return Promise.reject(new ApiRequestError(message || "Not found.", status));
    }

    if (status >= 500) {
      console.error(error);
      toast.error(message || "Something went wrong.");
    }

    return Promise.reject(new ApiRequestError(message, status));
  },
);

export async function apiRequest<T>(config: AxiosRequestConfig) {
  const response = await apiClient.request<ApiResponse<T>>(config);
  return response.data.data;
}
