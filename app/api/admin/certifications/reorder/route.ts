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

const payloadSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export async function POST(request: Request) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  if (!(await requireAdminSession())) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const { ids } = payloadSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.certifications.reorder, {
      adminApiToken: getAdminApiToken(),
      ids: ids as Id<"certifications">[],
    });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
