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
};

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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.assign("/admin/login");
    }

    if (error.response?.status && error.response.status >= 500) {
      toast.error(error.response.data?.error ?? "Something went wrong.");
    }

    return Promise.reject(error);
  },
);

export async function apiRequest<T>(config: AxiosRequestConfig) {
  const response = await apiClient.request<ApiResponse<T>>(config);
  return response.data.data;
}
