<script setup lang="ts">
import AppBadge from '@/components/common/AppBadge.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppPrice from '@/components/common/AppPrice.vue';
import AppQuantityStepper from '@/components/common/AppQuantityStepper.vue';
import AppRating from '@/components/common/AppRating.vue';
import VariantSelector from '@/components/features/product/VariantSelector.vue';
import type { ProductDetail, ProductVariant } from '@/types/catalog.types';
import { PRODUCT_BADGE_STYLES } from '@/utils/labels';

const LOW_STOCK_THRESHOLD = 5;

const props = defineProps<{ product: ProductDetail }>();

const { addItem, openDrawer } = useCart();

// Default to the middle tier (Standard) when there are size options.
const selectedVariantId = ref<string | null>(
  props.product.variants[Math.floor(props.product.variants.length / 2)]?.id ?? null,
);
const quantity = ref<number>(1);

const selectedVariant = computed<ProductVariant | null>(
  (): ProductVariant | null => props.product.variants.find((variant): boolean => variant.id === selectedVariantId.value) ?? null,
);
const unitPrice = computed<number>((): number => selectedVariant.value?.price ?? props.product.price);
const maxQuantity = computed<number>((): number => Math.min(20, props.product.stockQuantity));
const isLowStock = computed<boolean>(
  (): boolean => props.product.inStock && props.product.stockQuantity <= LOW_STOCK_THRESHOLD,
);

const addToCart = (): void => {
  addItem(
    {
      productId: props.product.id,
      slug: props.product.slug,
      name: props.product.name,
      imageUrl: props.product.imageUrl,
      variantId: selectedVariant.value?.id ?? null,
      variantName: selectedVariant.value?.name ?? null,
      unitPrice: unitPrice.value,
    },
    quantity.value,
  );
  openDrawer();
};
</script>

<template>
  <div class="purchase-panel">
    <div class="purchase-panel__meta">
      <NuxtLink :to="`/collections/${product.category.slug}`" class="purchase-panel__category">
        {{ product.category.name }}
      </NuxtLink>
      <AppBadge v-if="product.badge" :variant="PRODUCT_BADGE_STYLES[product.badge].variant">
        {{ PRODUCT_BADGE_STYLES[product.badge].label }}
      </AppBadge>
    </div>

    <h1 class="purchase-panel__title font-serif">{{ product.name }}</h1>
    <a v-if="product.reviewCount > 0" href="#reviews" class="purchase-panel__rating">
      <AppRating :rating="product.rating" :count="product.reviewCount" size="md" />
    </a>

    <AppPrice
      :amount="unitPrice"
      :compare-at="selectedVariant ? null : product.compareAtPrice"
      size="lg"
      class="purchase-panel__price"
    />
    <p class="purchase-panel__lead">{{ product.shortDescription }}</p>

    <VariantSelector v-if="product.variants.length > 0" v-model="selectedVariantId" :variants="product.variants" />

    <p v-if="!product.inStock" class="purchase-panel__stock purchase-panel__stock--out">
      Sold out — <NuxtLink to="/custom-orders">request it as a custom order</NuxtLink>
    </p>
    <p v-else-if="isLowStock" class="purchase-panel__stock purchase-panel__stock--low">
      Only {{ product.stockQuantity }} left — handmade in small batches
    </p>

    <div v-if="product.inStock" class="purchase-panel__actions">
      <AppQuantityStepper v-model="quantity" :max="maxQuantity" />
      <AppButton size="lg" block @click="addToCart">Add to cart</AppButton>
    </div>

    <p v-if="product.isCustomizable" class="purchase-panel__custom">
      ✨ Personalise it — add names, colours or a date in your order notes, or
      <NuxtLink to="/custom-orders">start a custom order</NuxtLink>.
    </p>
  </div>
</template>

<style scoped>
.purchase-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.purchase-panel__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.purchase-panel__category {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.purchase-panel__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.purchase-panel__rating {
  width: fit-content;
}

.purchase-panel__lead {
  color: var(--color-text-muted);
  font-size: 1.0625rem;
}

.purchase-panel__stock {
  font-size: 0.875rem;
  font-weight: 600;
}

.purchase-panel__stock--low {
  color: var(--color-amber);
}

.purchase-panel__stock--out {
  color: var(--color-danger);
}

.purchase-panel__stock a,
.purchase-panel__custom a {
  color: var(--color-primary);
  text-decoration: underline;
}

.purchase-panel__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.purchase-panel__custom {
  padding: 12px 14px;
  font-size: 0.875rem;
  background-color: var(--color-surface-muted);
  border-radius: var(--radius-md);
}
</style>
