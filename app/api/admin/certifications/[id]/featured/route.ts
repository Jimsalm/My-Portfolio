import { fetchMutation } from "convex/nextjs";
import { z } from "zod";
import type { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
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

const payloadSchema = z.object({ featured: z.boolean() });

export async function PATCH(request: Request, context: RouteContext) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  if (!(await requireAdminSession())) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const { featured } = payloadSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.certifications.toggleFeatured, {
      adminApiToken: getAdminApiToken(),
      featured,
      id: id as Id<"certifications">,
    });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
