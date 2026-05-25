/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as about from "../about.js";
import type * as admin from "../admin.js";
import type * as blog from "../blog.js";
import type * as cmsValidators from "../cmsValidators.js";
import type * as dashboard from "../dashboard.js";
import type * as projects from "../projects.js";
import type * as publicContent from "../publicContent.js";
import type * as skillUtils from "../skillUtils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  about: typeof about;
  admin: typeof admin;
  blog: typeof blog;
  cmsValidators: typeof cmsValidators;
  dashboard: typeof dashboard;
  projects: typeof projects;
  publicContent: typeof publicContent;
  skillUtils: typeof skillUtils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
