/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as api_about from "../api/about.js";
import type * as api_admin from "../api/admin.js";
import type * as api_blog from "../api/blog.js";
import type * as api_dashboard from "../api/dashboard.js";
import type * as api_projects from "../api/projects.js";
import type * as api_publicContent from "../api/publicContent.js";
import type * as api_settings from "../api/settings.js";
import type * as lib_cmsValidators from "../lib/cmsValidators.js";
import type * as lib_skillUtils from "../lib/skillUtils.js";
import type * as schema_adminUsers from "../schema/adminUsers.js";
import type * as schema_blogPosts from "../schema/blogPosts.js";
import type * as schema_profile from "../schema/profile.js";
import type * as schema_projects from "../schema/projects.js";
import type * as schema_siteSettings from "../schema/siteSettings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "api/about": typeof api_about;
  "api/admin": typeof api_admin;
  "api/blog": typeof api_blog;
  "api/dashboard": typeof api_dashboard;
  "api/projects": typeof api_projects;
  "api/publicContent": typeof api_publicContent;
  "api/settings": typeof api_settings;
  "lib/cmsValidators": typeof lib_cmsValidators;
  "lib/skillUtils": typeof lib_skillUtils;
  "schema/adminUsers": typeof schema_adminUsers;
  "schema/blogPosts": typeof schema_blogPosts;
  "schema/profile": typeof schema_profile;
  "schema/projects": typeof schema_projects;
  "schema/siteSettings": typeof schema_siteSettings;
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
