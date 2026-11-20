<script setup lang="ts">
import AppRating from '@/components/common/AppRating.vue';
import type { Review } from '@/types/catalog.types';
import { formatDate } from '@/utils/format';

const props = withDefaults(defineProps<{ review: Review; showProduct?: boolean }>(), { showProduct: true });

const initials = computed<string>((): string =>
  props.review.authorName
    .split(' ')
    .map((part: string): string => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase(),
);
</script>

<template>
  <figure class="review-card">
    <AppRating :rating="review.rating" />
    <blockquote class="review-card__quote font-serif">“{{ review.comment }}”</blockquote>
    <figcaption class="review-card__author">
      <span class="review-card__avatar" aria-hidden="true">{{ initials }}</span>
      <span>
        <strong>{{ review.authorName }}</strong>
        <span class="review-card__meta">{{ review.city }} · {{ formatDate(review.createdAt) }}</span>
      </span>
    </figcaption>
    <NuxtLink
      v-if="showProduct && review.productSlug && review.productName"
      :to="`/products/${review.productSlug}`"
      class="review-card__product"
    >
      🌸 {{ review.productName }}
    </NuxtLink>
  </figure>
</template>

<style scoped>
.review-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.review-card__quote {
  flex: 1;
  font-size: 1.0625rem;
  font-style: italic;
  line-height: 1.55;
}

.review-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
}

.review-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 0.8125rem;
  font-weight: 700;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: 50%;
}

.review-card__meta {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-subtle);
}

.review-card__product {
  width: fit-content;
  padding: 5px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--color-surface-muted);
  border-radius: var(--radius-full);
}

.review-card__product:hover {
  color: var(--color-primary);
}
</style>
