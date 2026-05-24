import { UTApi } from "uploadthing/server";

import {
  dataResponse,
  parseJson,
  rateLimitRequest,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

export async function POST(request: Request) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const body = (await parseJson(request)) as { key?: string };

    if (body.key) {
      const utapi = new UTApi();
      await utapi.deleteFiles(body.key);
    }

    return dataResponse({ deleted: body.key ?? null });
  } catch (error) {
    return routeError(error);
  }
}
