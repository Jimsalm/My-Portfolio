import { fetchMutation } from "convex/nextjs";
import type { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  getAdminApiToken,
  parseJson,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

export async function POST(request: Request) {
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
