<script setup lang="ts">
/** Label + hint + error wrapper shared by every form control. */
defineProps<{
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}>();
</script>

<template>
  <div class="form-field" :class="{ 'form-field--invalid': error }">
    <label :for="id" class="form-field__label">
      {{ label }}
      <span v-if="required" class="form-field__required" aria-hidden="true">*</span>
    </label>
    <slot :described-by="error ? `${id}-error` : hint ? `${id}-hint` : undefined" />
    <p v-if="error" :id="`${id}-error`" class="form-field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="form-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field__label {
  font-size: 0.8125rem;
  font-weight: 600;
}

.form-field__required {
  color: var(--color-primary);
}

.form-field__error {
  font-size: 0.8125rem;
  color: var(--color-danger);
}

.form-field__hint {
  font-size: 0.8125rem;
  color: var(--color-text-subtle);
}

.form-field :deep(.form-control) {
  width: 100%;
  padding: 11px 14px;
  font-size: 0.9375rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

.form-field :deep(.form-control:focus) {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.form-field--invalid :deep(.form-control) {
  border-color: var(--color-danger);
}
</style>
