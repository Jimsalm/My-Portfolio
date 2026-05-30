import { fetchMutation } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  getAdminApiToken,
  parseJson,
  rateLimitRequest,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";
import { badgeSettingsSchema } from "@/features/settings/schemas";

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
    const input = badgeSettingsSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.settings.updateBadge, {
      adminApiToken: getAdminApiToken(),
      input,
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
