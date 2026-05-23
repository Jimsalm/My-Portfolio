import "server-only";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/features/auth/server/auth-options";

export function dataResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json({ error }, { status });
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
