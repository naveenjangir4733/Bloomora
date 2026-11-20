<script setup lang="ts">
import type { StoreHighlight } from '@/types/store.types';

defineProps<{ highlights: StoreHighlight[] }>();
</script>

<template>
  <section class="highlights" aria-label="Why shop with us">
    <ul class="container highlights__grid">
      <li v-for="highlight in highlights" :key="highlight.id" class="highlight">
        <span class="highlight__icon" aria-hidden="true">{{ highlight.icon }}</span>
        <div>
          <h3 class="highlight__title">{{ highlight.title }}</h3>
          <p class="highlight__description">{{ highlight.description }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.highlights {
  padding: 28px 0;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.highlights__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  list-style: none;
}

.highlight {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.highlight__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  font-size: 1.375rem;
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-md);
}

.highlight__title {
  font-size: 0.9375rem;
}

.highlight__description {
  margin-top: 2px;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
</style>
