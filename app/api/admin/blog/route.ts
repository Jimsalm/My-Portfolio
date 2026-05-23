import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { blogPostFormSchema } from "@/features/cms/schemas";
import {
  dataResponse,
  getAdminApiToken,
  parseJson,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return dataResponse([], { status: 401 });
  }

  try {
    const data = await fetchQuery(api.blog.list, {
      adminApiToken: getAdminApiToken(),
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const input = blogPostFormSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.blog.create, {
      adminApiToken: getAdminApiToken(),
      input,
    });

    return dataResponse(data, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
