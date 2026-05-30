import { fetchAction } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  dataResponse,
  errorResponse,
  getAdminApiToken,
  parseJson,
  rateLimitRequest,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";
import { accountSettingsSchema } from "@/features/settings/schemas";

export async function PUT(request: Request) {
  const limited = rateLimitRequest(request, { limit: 20 });

  if (limited) {
    return limited;
  }

  const session = await requireAdminSession();
  const adminId = session?.user?.id;

  if (!session || !adminId) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const input = accountSettingsSchema.parse(await parseJson(request));
    const data = await fetchAction(api.api.settings.updateAccount, {
      adminApiToken: getAdminApiToken(),
      adminId: adminId as Id<"adminUsers">,
      input,
    });

    return dataResponse(data);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Current password") ||
        error.message.includes("Admin account"))
    ) {
      return errorResponse(error.message, 400);
    }

    return routeError(error);
  }
}
