<script setup lang="ts">
import AppSkeleton from '@/components/common/AppSkeleton.vue';
import ProductCard from '@/components/features/product/ProductCard.vue';
import type { ProductSummary } from '@/types/catalog.types';

withDefaults(defineProps<{ products: ProductSummary[]; loading?: boolean; skeletonCount?: number }>(), {
  loading: false,
  skeletonCount: 8,
});
</script>

<template>
  <div class="product-grid" :aria-busy="loading">
    <template v-if="loading">
      <div v-for="index in skeletonCount" :key="index" class="product-grid__skeleton">
        <AppSkeleton height="auto" radius="var(--radius-lg)" class="product-grid__skeleton-media" />
        <AppSkeleton height="14px" />
        <AppSkeleton height="14px" />
      </div>
    </template>
    <ProductCard v-for="product in products" v-else :key="product.id" :product="product" />
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.product-grid__skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-grid__skeleton-media {
  aspect-ratio: 1 / 1;
}

@media (max-width: 560px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
}
</style>
