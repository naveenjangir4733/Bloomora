<script setup lang="ts">
import AppEmptyState from '@/components/common/AppEmptyState.vue';
import AppRating from '@/components/common/AppRating.vue';
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import ReviewCard from '@/components/features/review/ReviewCard.vue';

useSeoMeta({ title: 'Customer reviews', description: 'What our customers say about their handmade orders.' });

const { data: storeConfig } = useStoreConfig();
const { data: reviews } = useReviews('reviews:all', { limit: 50 });
</script>

<template>
  <section class="section">
    <div class="container">
      <AppSectionHeading as="h1" eyebrow="Kind words" title="Customer reviews">
        <div v-if="storeConfig && storeConfig.stats.reviewCount > 0" class="reviews-summary">
          <AppRating :rating="storeConfig.stats.averageRating" size="md" />
          <span>from {{ storeConfig.stats.reviewCount }} verified reviews</span>
        </div>
      </AppSectionHeading>

      <AppEmptyState v-if="reviews.length === 0" title="No reviews yet" />
      <ul v-else class="reviews-grid">
        <li v-for="review in reviews" :key="review.id">
          <ReviewCard :review="review" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.reviews-summary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  color: var(--color-text-muted);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  list-style: none;
}
</style>
