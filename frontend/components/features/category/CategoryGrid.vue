<script setup lang="ts">
import type { Category } from '@/types/catalog.types';
import { pluralize } from '@/utils/format';

defineProps<{ categories: Category[] }>();
</script>

<template>
  <ul class="category-grid">
    <li v-for="category in categories" :key="category.id">
      <NuxtLink :to="`/collections/${category.slug}`" class="category-tile">
        <img :src="category.imageUrl" :alt="category.name" class="category-tile__image" loading="lazy" width="320" height="400">
        <span class="category-tile__overlay">
          <span class="category-tile__name font-serif">{{ category.name }}</span>
          <span class="category-tile__tagline">{{ category.tagline }}</span>
          <span class="category-tile__count">{{ pluralize(category.productCount, 'design') }} →</span>
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  list-style: none;
}

.category-tile {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-muted);
}

.category-tile__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}

.category-tile:hover .category-tile__image {
  transform: scale(1.06);
}

.category-tile__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
  padding: 18px;
  color: var(--color-text-inverse);
  background: linear-gradient(180deg, transparent 40%, rgba(43, 29, 34, 0.82));
}

.category-tile__name {
  font-size: 1.375rem;
  font-weight: 700;
}

.category-tile__tagline {
  font-size: 0.8125rem;
  opacity: 0.9;
}

.category-tile__count {
  margin-top: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
