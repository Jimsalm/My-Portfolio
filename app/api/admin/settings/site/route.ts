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
import { siteSettingsSchema } from "@/features/settings/schemas";

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
    const input = siteSettingsSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.settings.updateSite, {
      adminApiToken: getAdminApiToken(),
      input,
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
