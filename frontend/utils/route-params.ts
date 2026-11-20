import type { RouteParamsGeneric } from 'vue-router';

/** Returns a single route param as a string (dynamic segments can be arrays for catch-all routes). */
export const readRouteParam = (params: RouteParamsGeneric, key: string): string => {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
};

/** Throws Nuxt's 404 page when a required resource does not exist. */
export const notFound = (message: string): Error => createError({ statusCode: 404, statusMessage: message, fatal: true });
