<script setup lang="ts">
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import ProductCatalog from '@/components/features/catalog/ProductCatalog.vue';

useSeoMeta({
  title: 'Shop all',
  description: 'Browse handmade fuzzy-wire bouquets, glow lamps, keychains, cards and gifts.',
});
</script>

<template>
  <section class="section">
    <div class="container">
      <AppSectionHeading
        as="h1"
        eyebrow="Our collection"
        title="Shop everything"
        subtitle="Every piece crafted with fuzzy wire, flowers and a lot of love."
      />
      <ProductCatalog />
    </div>
  </section>
</template>
