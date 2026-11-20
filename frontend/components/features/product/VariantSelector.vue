<script setup lang="ts">
import type { ProductVariant } from '@/types/catalog.types';
import { formatPrice } from '@/utils/format';

defineProps<{ variants: ProductVariant[] }>();

const selectedId = defineModel<string | null>({ required: true });
</script>

<template>
  <fieldset class="variant-selector">
    <legend class="variant-selector__legend">Size</legend>
    <div class="variant-selector__options">
      <label
        v-for="variant in variants"
        :key="variant.id"
        :class="['variant-option', { 'is-selected': variant.id === selectedId }]"
      >
        <input v-model="selectedId" type="radio" name="variant" :value="variant.id" class="sr-only">
        <span class="variant-option__name">{{ variant.name }}</span>
        <span class="variant-option__price">{{ formatPrice(variant.price) }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.variant-selector {
  border: none;
}

.variant-selector__legend {
  margin-bottom: 10px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.variant-selector__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
}

.variant-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  background-color: var(--color-surface);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.2s var(--ease), background-color 0.2s var(--ease);
}

.variant-option:hover {
  border-color: var(--color-text);
}

.variant-option:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.variant-option.is-selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.variant-option__name {
  font-weight: 700;
}

.variant-option__price {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
