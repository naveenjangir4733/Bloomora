import type { Ref } from 'vue';
import type { FieldErrors } from '@/types/api.types';
import { toApiRequestError } from '@/utils/api-error';

export interface AsyncAction<TArgs extends unknown[], TResult> {
  pending: Ref<boolean>;
  error: Ref<string | null>;
  fieldErrors: Ref<FieldErrors>;
  run: (...args: TArgs) => Promise<TResult | null>;
  reset: () => void;
}

/**
 * Wraps a submit handler with loading, error and per-field validation state so
 * every form handles API failures the same way. `run` resolves to `null` on failure.
 */
export const useAsyncAction = <TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
): AsyncAction<TArgs, TResult> => {
  const pending = ref<boolean>(false);
  const error = ref<string | null>(null);
  const fieldErrors = ref<FieldErrors>({});

  const reset = (): void => {
    error.value = null;
    fieldErrors.value = {};
  };

  const run = async (...args: TArgs): Promise<TResult | null> => {
    reset();
    pending.value = true;
    try {
      return await action(...args);
    } catch (caught) {
      const apiError = toApiRequestError(caught);
      error.value = apiError.message;
      fieldErrors.value = apiError.fieldErrors;
      return null;
    } finally {
      pending.value = false;
    }
  };

  return { pending, error, fieldErrors, run, reset };
};
