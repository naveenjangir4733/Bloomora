<script setup lang="ts">
import AppBreadcrumbs from '@/components/common/AppBreadcrumbs.vue';
import ProductCatalog from '@/components/features/catalog/ProductCatalog.vue';
import { notFound, readRouteParam } from '@/utils/route-params';

const route = useRoute();
const slug = readRouteParam(route.params, 'slug');
const { data: category } = await useCategory(slug);

if (!category.value) {
  throw notFound('Collection not found');
}

useSeoMeta({
  title: (): string => category.value?.name ?? 'Collection',
  description: (): string | undefined => category.value?.description,
});
</script>

<template>
  <div v-if="category">
    <section class="collection-hero" :style="{ backgroundImage: `url(${category.imageUrl})` }">
      <div class="container collection-hero__content">
        <AppBreadcrumbs
          class="collection-hero__crumbs"
          :items="[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: category.name }]"
        />
        <h1 class="collection-hero__title font-serif">{{ category.name }}</h1>
        <p class="collection-hero__tagline">{{ category.tagline }}</p>
        <p class="collection-hero__description">{{ category.description }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <ProductCatalog :locked-category="category.slug" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.collection-hero {
  position: relative;
  padding: 72px 0 56px;
  background-size: cover;
  background-position: center;
}

.collection-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(43, 29, 34, 0.85), rgba(43, 29, 34, 0.45));
}

.collection-hero__content {
  position: relative;
  color: var(--color-text-inverse);
}

.collection-hero__crumbs :deep(ol),
.collection-hero__crumbs :deep([aria-current='page']) {
  color: #e9dfe2;
}

.collection-hero__title {
  margin-top: 12px;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  color: var(--color-text-inverse);
}

.collection-hero__tagline {
  margin-top: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary-border);
}

.collection-hero__description {
  max-width: 560px;
  margin-top: 12px;
  font-size: 1.0625rem;
  color: #f3eaed;
}
</style>
