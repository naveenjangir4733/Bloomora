<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import CategoryGrid from '@/components/features/category/CategoryGrid.vue';
import CustomOrderCta from '@/components/features/home/CustomOrderCta.vue';
import HeroSection from '@/components/features/home/HeroSection.vue';
import HighlightsStrip from '@/components/features/home/HighlightsStrip.vue';
import ProductGrid from '@/components/features/product/ProductGrid.vue';
import ReviewCard from '@/components/features/review/ReviewCard.vue';

const FEATURED_LIMIT = 8;

const { data: storeConfig } = useStoreConfig();
const { data: categories } = useCategories();
const { data: featured, status: featuredStatus } = useProducts('home:featured', { featured: true, limit: FEATURED_LIMIT });
const { data: reviews } = useReviews('home:reviews', { featured: true, limit: 6 });

useSeoMeta({
  title: (): string => storeConfig.value?.settings.tagline ?? 'Handmade flowers & gifts',
  description: (): string | undefined => storeConfig.value?.settings.description,
});
</script>

<template>
  <div>
    <template v-if="storeConfig">
      <HeroSection :settings="storeConfig.settings" :stats="storeConfig.stats" />
      <HighlightsStrip :highlights="storeConfig.highlights" />
    </template>

    <section class="section">
      <div class="container">
        <AppSectionHeading
          eyebrow="Explore our collection"
          title="Shop by category"
          subtitle="Bouquets, lamps, keepsakes and little extras — every piece shaped by hand."
        />
        <CategoryGrid :categories="categories" />
      </div>
    </section>

    <section class="section section--tinted">
      <div class="container">
        <AppSectionHeading eyebrow="Handpicked" title="Our favourites" subtitle="The pieces our customers keep coming back for." />
        <ProductGrid :products="featured.items" :loading="featuredStatus === 'pending'" :skeleton-count="FEATURED_LIMIT" />
        <div class="section__actions">
          <AppButton to="/shop" variant="outline" size="lg">View all products →</AppButton>
        </div>
      </div>
    </section>

    <section v-if="reviews.length > 0" class="section">
      <div class="container">
        <AppSectionHeading eyebrow="Kind words" title="What our customers say" />
        <ul class="reviews-grid">
          <li v-for="review in reviews" :key="review.id">
            <ReviewCard :review="review" />
          </li>
        </ul>
        <div class="section__actions">
          <AppButton to="/reviews" variant="ghost">Read all reviews →</AppButton>
        </div>
      </div>
    </section>

    <CustomOrderCta
      v-if="storeConfig"
      :whatsapp-number="storeConfig.settings.whatsappNumber"
      :store-name="storeConfig.settings.storeName"
    />
  </div>
</template>

<style scoped>
.section--tinted {
  background-color: var(--color-surface-muted);
}

.section__actions {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  list-style: none;
}
</style>
