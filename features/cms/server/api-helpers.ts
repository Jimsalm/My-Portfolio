import "server-only";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/features/auth/server/auth-options";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export function dataResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json({ error }, { status });
}

export function publicCacheHeaders(revalidateSeconds: number) {
  return {
    "Cache-Control": `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=${revalidateSeconds * 5}`,
  };
}

export function rateLimitRequest(
  request: Request,
  options: { limit?: number; windowMs?: number } = {},
) {
  const limit = options.limit ?? 120;
  const windowMs = options.windowMs ?? 60_000;
  const now = Date.now();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "local";
  const pathname = new URL(request.url).pathname;
  const key = `${ip}:${pathname}`;
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (bucket.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        headers: {
          "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)),
        },
        status: 429,
      },
    );
  }

  bucket.count += 1;
  return null;
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    return null;
  }

  return session;
}

export function getAdminApiToken() {
  const token = process.env.ADMIN_API_TOKEN;

  if (!token) {
    throw new Error("ADMIN_API_TOKEN is not configured.");
  }

  return token;
}

export async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON request body.");
  }
}

export function routeError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse(error.issues[0]?.message ?? "Invalid request.", 400);
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("Unexpected server error.", 500);
}

export function emptyDashboard() {
  return {
    profileLastUpdated: null,
    recentBlogPosts: [],
    recentProjects: [],
    totalBlogPosts: 0,
    totalProjects: 0,
  };
}
