/** Narrows `unknown` to an indexable object so its fields can be checked safely. */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string';
