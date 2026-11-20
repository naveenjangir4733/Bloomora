<script setup lang="ts">
import AppBadge from '@/components/common/AppBadge.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppPrice from '@/components/common/AppPrice.vue';
import AppRating from '@/components/common/AppRating.vue';
import type { ProductSummary } from '@/types/catalog.types';
import { PRODUCT_BADGE_STYLES, type BadgeStyle } from '@/utils/labels';

const props = defineProps<{ product: ProductSummary }>();

const { addItem } = useCart();

const productUrl = computed<string>((): string => `/products/${props.product.slug}`);
const badge = computed<BadgeStyle | null>((): BadgeStyle | null =>
  props.product.badge ? PRODUCT_BADGE_STYLES[props.product.badge] : null,
);

const addToCart = (): void => {
  addItem({
    productId: props.product.id,
    slug: props.product.slug,
    name: props.product.name,
    imageUrl: props.product.imageUrl,
    variantId: null,
    variantName: null,
    unitPrice: props.product.price,
  });
};
</script>

<template>
  <article class="product-card">
    <NuxtLink :to="productUrl" class="product-card__media" :aria-label="product.name">
      <img :src="product.imageUrl" :alt="product.name" class="product-card__image" loading="lazy" width="400" height="400">
      <div class="product-card__badges">
        <AppBadge v-if="!product.inStock" variant="danger">Sold out</AppBadge>
        <AppBadge v-else-if="badge" :variant="badge.variant">{{ badge.label }}</AppBadge>
      </div>
    </NuxtLink>

    <div class="product-card__body">
      <p class="product-card__category">{{ product.category.name }}</p>
      <h3 class="product-card__title">
        <NuxtLink :to="productUrl">{{ product.name }}</NuxtLink>
      </h3>
      <AppRating v-if="product.reviewCount > 0" :rating="product.rating" :count="product.reviewCount" />

      <div class="product-card__footer">
        <AppPrice :amount="product.price" :compare-at="product.compareAtPrice" :from-prefix="product.hasVariants" size="sm" />
        <AppButton v-if="!product.inStock" variant="outline" size="sm" disabled>Sold out</AppButton>
        <AppButton v-else-if="product.hasVariants" variant="soft" size="sm" :to="productUrl">Choose size</AppButton>
        <AppButton v-else variant="soft" size="sm" @click="addToCart">Add to cart</AppButton>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-card__media {
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: var(--color-surface-muted);
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__badges {
  position: absolute;
  top: 12px;
  left: 12px;
}

.product-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
  padding: 16px 18px 18px;
}

.product-card__category {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.product-card__title {
  font-size: 1.0625rem;
  font-weight: 700;
}

.product-card__title a:hover {
  color: var(--color-primary);
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}
</style>
