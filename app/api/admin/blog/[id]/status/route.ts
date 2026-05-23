import { fetchMutation } from "convex/nextjs";
import type { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { contentStatusSchema } from "@/features/cms/schemas";
import {
  dataResponse,
  getAdminApiToken,
  parseJson,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await parseJson(request)) as { status?: unknown };
    const data = await fetchMutation(api.blog.toggleStatus, {
      adminApiToken: getAdminApiToken(),
      id: id as Id<"blogPosts">,
      status: contentStatusSchema.parse(body.status),
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
