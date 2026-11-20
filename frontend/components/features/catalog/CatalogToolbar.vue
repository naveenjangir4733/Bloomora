<script setup lang="ts">
import AppSelect from '@/components/common/AppSelect.vue';
import type { Category, ProductSort } from '@/types/catalog.types';
import { PRODUCT_SORT_OPTIONS } from '@/utils/labels';

/** Presentational filter bar. All state is owned by the parent via v-model. */
withDefaults(defineProps<{ categories: Category[]; showCategories?: boolean; total: number }>(), {
  showCategories: true,
});

const search = defineModel<string>('search', { required: true });
const sort = defineModel<ProductSort>('sort', { required: true });
const category = defineModel<string | undefined>('category', { required: true });
const inStockOnly = defineModel<boolean>('inStockOnly', { required: true });
</script>

<template>
  <div class="toolbar">
    <div v-if="showCategories" class="toolbar__pills" role="group" aria-label="Filter by category">
      <button
        type="button"
        :class="['pill', { 'is-active': category === undefined }]"
        :aria-pressed="category === undefined"
        @click="category = undefined"
      >
        All
      </button>
      <button
        v-for="item in categories"
        :key="item.id"
        type="button"
        :class="['pill', { 'is-active': category === item.slug }]"
        :aria-pressed="category === item.slug"
        @click="category = item.slug"
      >
        {{ item.name }}
      </button>
    </div>

    <div class="toolbar__row">
      <label class="toolbar__search">
        <span class="sr-only">Search products</span>
        <span aria-hidden="true">🔍</span>
        <input v-model="search" type="search" placeholder="Search tulips, lamps, keychains…" maxlength="100">
      </label>

      <label class="toolbar__toggle">
        <input v-model="inStockOnly" type="checkbox">
        In stock only
      </label>

      <p class="toolbar__count" aria-live="polite">{{ total }} {{ total === 1 ? 'product' : 'products' }}</p>

      <AppSelect id="catalog-sort" v-model="sort" label="Sort products" :options="PRODUCT_SORT_OPTIONS" />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.toolbar__pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.pill {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  transition: background-color 0.2s var(--ease), color 0.2s var(--ease), border-color 0.2s var(--ease);
}

.pill:hover {
  border-color: var(--color-text);
}

.pill.is-active {
  background-color: var(--color-ink);
  border-color: var(--color-ink);
  color: var(--color-text-inverse);
}

.toolbar__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.toolbar__search {
  display: flex;
  align-items: center;
  flex: 1 1 260px;
  gap: 8px;
  padding: 9px 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
}

.toolbar__search:focus-within {
  border-color: var(--color-primary);
}

.toolbar__search input {
  width: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: 0.9375rem;
}

.toolbar__toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.toolbar__toggle input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.toolbar__count {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
