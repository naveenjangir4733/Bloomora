<script setup lang="ts" generic="T extends string">
import type { SelectOption } from '@/types/ui.types';

/** Compact, label-less select used in toolbars. `label` is still announced to screen readers. */
defineProps<{
  id: string;
  label: string;
  options: SelectOption<T>[];
}>();

const model = defineModel<T>({ required: true });
</script>

<template>
  <div class="app-select">
    <label :for="id" class="sr-only">{{ label }}</label>
    <select :id="id" v-model="model" class="app-select__control">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.app-select__control {
  appearance: none;
  padding: 10px 38px 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--color-surface);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236f5f63' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  cursor: pointer;
}
</style>
