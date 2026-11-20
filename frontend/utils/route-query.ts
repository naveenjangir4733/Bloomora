import type { LocationQuery } from 'vue-router';

/** Reads a single string value from the route query (ignores arrays and nulls). */
export const readQueryString = (query: LocationQuery, key: string): string | undefined => {
  const value = query[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

export const readQueryNumber = (query: LocationQuery, key: string, fallback: number): number => {
  const parsed = Number.parseInt(readQueryString(query, key) ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** Narrows a query value to one of the allowed literals. */
export const readQueryEnum = <T extends string>(
  query: LocationQuery,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T => {
  const value = readQueryString(query, key);
  return allowed.find((candidate): boolean => candidate === value) ?? fallback;
};
