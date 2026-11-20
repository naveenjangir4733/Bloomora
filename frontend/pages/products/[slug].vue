<script setup lang="ts">
import AppBreadcrumbs from '@/components/common/AppBreadcrumbs.vue';
import AppRating from '@/components/common/AppRating.vue';
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import ProductDetails from '@/components/features/product/ProductDetails.vue';
import ProductGallery from '@/components/features/product/ProductGallery.vue';
import ProductGrid from '@/components/features/product/ProductGrid.vue';
import ProductPurchasePanel from '@/components/features/product/ProductPurchasePanel.vue';
import ReviewCard from '@/components/features/review/ReviewCard.vue';
import type { BreadcrumbItem } from '@/types/ui.types';
import { notFound, readRouteParam } from '@/utils/route-params';

const route = useRoute();
const slug = readRouteParam(route.params, 'slug');
const { data: product } = await useProduct(slug);

if (!product.value) {
  throw notFound('Product not found');
}

const images = computed<string[]>((): string[] =>
  product.value ? [product.value.imageUrl, ...product.value.galleryUrls] : [],
);

const breadcrumbs = computed<BreadcrumbItem[]>((): BreadcrumbItem[] =>
  product.value
    ? [
        { label: 'Home', to: '/' },
        { label: product.value.category.name, to: `/collections/${product.value.category.slug}` },
        { label: product.value.name },
      ]
    : [],
);

useSeoMeta({
  title: (): string => product.value?.name ?? 'Product',
  description: (): string | undefined => product.value?.shortDescription,
  ogImage: (): string | undefined => product.value?.imageUrl,
});
</script>

<template>
  <div v-if="product">
    <section class="section product-page">
      <div class="container">
        <AppBreadcrumbs :items="breadcrumbs" class="product-page__crumbs" />
        <div class="product-page__grid">
          <ProductGallery :images="images" :alt="product.name" />
          <div class="product-page__info">
            <ProductPurchasePanel :product="product" />
            <ProductDetails :product="product" />
          </div>
        </div>
      </div>
    </section>

    <section id="reviews" class="section section--tinted">
      <div class="container">
        <AppSectionHeading title="Customer reviews" align="left">
          <AppRating v-if="product.reviewCount > 0" :rating="product.rating" :count="product.reviewCount" size="md" />
        </AppSectionHeading>
        <ul v-if="product.reviews.length > 0" class="reviews-grid">
          <li v-for="review in product.reviews" :key="review.id">
            <ReviewCard :review="review" :show-product="false" />
          </li>
        </ul>
        <p v-else class="reviews-empty">No reviews yet — be the first to share yours after your order arrives.</p>
      </div>
    </section>

    <section v-if="product.related.length > 0" class="section">
      <div class="container">
        <AppSectionHeading title="You may also like" align="left" />
        <ProductGrid :products="product.related" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.product-page {
  padding-top: 32px;
}

.product-page__crumbs {
  margin-bottom: 24px;
}

.product-page__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 48px;
}

.product-page__info {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section--tinted {
  background-color: var(--color-surface-muted);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  list-style: none;
}

.reviews-empty {
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .product-page__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>
