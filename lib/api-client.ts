"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  error: string;
  status?: number;
};

export type ApiRequestConfig = {
  data?: unknown;
  headers?: HeadersInit;
  method?: string;
  signal?: AbortSignal;
  url: string;
};

export type QueryKey = readonly unknown[] | string;

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

const queryListeners = new Map<string, Set<() => void>>();

function keyToString(key: QueryKey) {
  return typeof key === "string" ? key : JSON.stringify(key);
}

function subscribeQuery(key: QueryKey, listener: () => void) {
  const cacheKey = keyToString(key);
  const listeners = queryListeners.get(cacheKey) ?? new Set<() => void>();
  listeners.add(listener);
  queryListeners.set(cacheKey, listeners);

  return () => {
    listeners.delete(listener);

    if (!listeners.size) {
      queryListeners.delete(cacheKey);
    }
  };
}

export function invalidateQueries(keys: QueryKey[]) {
  keys.forEach((key) => {
    queryListeners.get(keyToString(key))?.forEach((listener) => listener());
  });
}

export async function apiRequest<T>({
  data,
  headers,
  method = "GET",
  signal,
  url,
}: ApiRequestConfig) {
  const response = await fetch(`${baseURL}${url}`, {
    body: data === undefined ? undefined : JSON.stringify(data),
    credentials: "include",
    headers: {
      ...(data === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    method,
    signal,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiResponse<T> | ApiErrorResponse) : null;

  if (!response.ok) {
    const message =
      payload && "error" in payload ? payload.error : "Request failed.";

    if (response.status === 401 && typeof window !== "undefined") {
      window.location.assign("/admin/login");
    }

    if (response.status >= 500) {
      console.error(payload ?? message);
      toast.error(message);
    }

    throw new ApiRequestError(message, response.status);
  }

  return payload && "data" in payload ? payload.data : (undefined as T);
}

export function useApiQuery<TData>({
  enabled = true,
  queryFn,
  queryKey,
}: {
  enabled?: boolean;
  queryFn: () => Promise<TData>;
  queryKey: QueryKey;
}) {
  const serializedQueryKey = keyToString(queryKey);
  const queryFnRef = useRef(queryFn);
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

  const refetch = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setData(await queryFnRef.current());
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    return subscribeQuery(serializedQueryKey, () => {
      void refetch();
    });
  }, [serializedQueryKey, refetch]);

  useEffect(() => {
    void refetch();
  }, [refetch, serializedQueryKey]);

  return {
    data,
    error,
    isError: Boolean(error),
    isLoading,
    refetch,
  };
}

type MutationOptions<TData, TVariables> = {
  invalidate?: QueryKey[];
  onError?: (error: unknown, variables: TVariables) => void;
  onSettled?: (
    data: TData | undefined,
    error: unknown | null,
    variables: TVariables,
  ) => void;
  onSuccess?: (data: TData, variables: TVariables) => void;
};

export function useApiMutation<TData, TVariables>({
  mutationFn,
  ...defaultOptions
}: MutationOptions<TData, TVariables> & {
  mutationFn: (variables: TVariables) => Promise<TData>;
}) {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (variables: TVariables, options?: MutationOptions<TData, TVariables>) => {
      setIsPending(true);

      try {
        const data = await mutationFn(variables);
        defaultOptions.onSuccess?.(data, variables);
        options?.onSuccess?.(data, variables);
        invalidateQueries([
          ...(defaultOptions.invalidate ?? []),
          ...(options?.invalidate ?? []),
        ]);
        defaultOptions.onSettled?.(data, null, variables);
        options?.onSettled?.(data, null, variables);
        return data;
      } catch (error) {
        defaultOptions.onError?.(error, variables);
        options?.onError?.(error, variables);
        defaultOptions.onSettled?.(undefined, error, variables);
        options?.onSettled?.(undefined, error, variables);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [defaultOptions, mutationFn],
  );

  const mutate = useCallback(
    (variables: TVariables, options?: MutationOptions<TData, TVariables>) => {
      void mutateAsync(variables, options).catch(() => {
        // Error handlers are called by mutateAsync.
      });
    },
    [mutateAsync],
  );

  return {
    isPending,
    mutate,
    mutateAsync,
  };
}
