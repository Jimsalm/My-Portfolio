import { fetchMutation, fetchQuery } from "convex/nextjs";
import type { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { certificationFormSchema } from "@/features/certifications/schemas";
import {
  dataResponse,
  getAdminApiToken,
  parseJson,
  rateLimitRequest,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const limited = rateLimitRequest(request, { limit: 80 });

  if (limited) {
    return limited;
  }

  if (!(await requireAdminSession())) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const data = await fetchQuery(api.api.certifications.get, {
      adminApiToken: getAdminApiToken(),
      id: id as Id<"certifications">,
    });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  if (!(await requireAdminSession())) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const input = certificationFormSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.certifications.update, {
      adminApiToken: getAdminApiToken(),
      id: id as Id<"certifications">,
      input,
    });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  if (!(await requireAdminSession())) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const data = await fetchMutation(api.api.certifications.remove, {
      adminApiToken: getAdminApiToken(),
      id: id as Id<"certifications">,
    });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
