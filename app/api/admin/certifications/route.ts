import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { certificationFormSchema } from "@/features/certifications/schemas";
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

  if (!(await requireAdminSession())) {
    return dataResponse([], { status: 401 });
  }

  try {
    const data = await fetchQuery(api.api.certifications.list, {
      adminApiToken: getAdminApiToken(),
    });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const limited = rateLimitRequest(request, { limit: 30 });

  if (limited) {
    return limited;
  }

  if (!(await requireAdminSession())) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const input = certificationFormSchema.parse(await parseJson(request));
    const data = await fetchMutation(api.api.certifications.create, {
      adminApiToken: getAdminApiToken(),
      input,
    });
    return dataResponse(data, { status: 201 });
  } catch (error) {
    return routeError(error);
  }
}
