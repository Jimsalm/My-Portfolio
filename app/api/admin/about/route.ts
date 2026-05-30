import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { aboutFormSchema, emptyAbout } from "@/features/cms/schemas";
import {
  dataResponse,
  getAdminApiToken,
  parseJson,
  rateLimitRequest,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

export async function GET(request: Request) {
  const limited = rateLimitRequest(request, { limit: 80 });

  if (limited) {
    return limited;
  }

  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const data = await fetchQuery(api.api.about.get, {
      adminApiToken: getAdminApiToken(),
    });

    return dataResponse(data ?? { ...emptyAbout(), id: "", updatedAt: 0 });
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: Request) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const input = aboutFormSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.about.upsert, {
      adminApiToken: getAdminApiToken(),
      input,
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
