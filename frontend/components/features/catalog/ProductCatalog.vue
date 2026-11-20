<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import AppEmptyState from '@/components/common/AppEmptyState.vue';
import AppPagination from '@/components/common/AppPagination.vue';
import CatalogToolbar from '@/components/features/catalog/CatalogToolbar.vue';
import ProductGrid from '@/components/features/product/ProductGrid.vue';
import { PRODUCT_SORTS, type ProductQuery, type ProductSort } from '@/types/catalog.types';
import { readQueryEnum, readQueryNumber, readQueryString } from '@/utils/route-query';

/**
 * Searchable, sortable, paginated product listing. Filter state lives in the URL query
 * so results are shareable and survive refresh. `lockedCategory` pins the category
 * (used on collection pages) and hides the category pills.
 */
const props = withDefaults(defineProps<{ lockedCategory?: string }>(), { lockedCategory: undefined });

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;

const route = useRoute();
const router = useRouter();
const { data: categories } = useCategories();

const query = computed<ProductQuery>((): ProductQuery => ({
  search: readQueryString(route.query, 'q'),
  category: props.lockedCategory ?? readQueryString(route.query, 'category'),
  sort: readQueryEnum(route.query, 'sort', PRODUCT_SORTS, 'featured'),
  inStock: readQueryString(route.query, 'inStock') === 'true' ? true : undefined,
  page: readQueryNumber(route.query, 'page', 1),
  limit: PAGE_SIZE,
}));

const { data: result, status } = useProducts(`catalog:${props.lockedCategory ?? 'all'}`, query);
const isLoading = computed<boolean>((): boolean => status.value === 'pending');

/** Writes filter changes to the URL; every change except paging resets to page 1. */
const updateQuery = (changes: Record<string, string | undefined>): void => {
  const next: Record<string, string> = {};
  const merged: Record<string, unknown> = { ...route.query, page: undefined, ...changes };
  Object.entries(merged).forEach(([key, value]): void => {
    if (typeof value === 'string' && value.length > 0) {
      next[key] = value;
    }
  });
  void router.replace({ query: next });
};

const searchInput = ref<string>(query.value.search ?? '');
let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchInput, (value: string): void => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout((): void => updateQuery({ q: value.trim() || undefined }), SEARCH_DEBOUNCE_MS);
});
onBeforeUnmount((): void => clearTimeout(searchTimer));

const sort = computed<ProductSort>({
  get: (): ProductSort => query.value.sort ?? 'featured',
  set: (value: ProductSort): void => updateQuery({ sort: value === 'featured' ? undefined : value }),
});

const category = computed<string | undefined>({
  get: (): string | undefined => query.value.category,
  set: (value: string | undefined): void => updateQuery({ category: value }),
});

const inStockOnly = computed<boolean>({
  get: (): boolean => query.value.inStock === true,
  set: (value: boolean): void => updateQuery({ inStock: value ? 'true' : undefined }),
});

const goToPage = (page: number): void => {
  updateQuery({ page: page > 1 ? String(page) : undefined });
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const resetFilters = (): void => {
  searchInput.value = '';
  void router.replace({ query: {} });
};
</script>

<template>
  <div>
    <CatalogToolbar
      v-model:search="searchInput"
      v-model:sort="sort"
      v-model:category="category"
      v-model:in-stock-only="inStockOnly"
      :categories="categories"
      :show-categories="!lockedCategory"
      :total="result.meta.total"
    />

    <AppEmptyState
      v-if="!isLoading && result.items.length === 0"
      icon="🌱"
      title="No products match your filters"
      description="Try a different search or clear the filters to see everything."
    >
      <AppButton variant="outline" @click="resetFilters">Clear filters</AppButton>
    </AppEmptyState>

    <template v-else>
      <ProductGrid :products="result.items" :loading="isLoading && result.items.length === 0" />
      <AppPagination :page="result.meta.page" :total-pages="result.meta.totalPages" @change="goToPage" />
    </template>
  </div>
</template>
