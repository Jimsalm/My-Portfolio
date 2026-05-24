import { fetchMutation } from "convex/nextjs";
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

export async function POST(request: Request) {
  const limited = rateLimitRequest(request, { limit: 20 });

  if (limited) {
    return limited;
  }

  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const body = (await parseJson(request)) as { ids?: string[] };
    const data = await fetchMutation(api.projects.bulkDelete, {
      adminApiToken: getAdminApiToken(),
      ids: (body.ids ?? []) as Array<Id<"projects">>,
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
