<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import type { StoreSettings, StoreStats } from '@/types/store.types';

const props = defineProps<{ settings: StoreSettings; stats: StoreStats }>();

interface StatItem {
  value: string;
  label: string;
}

/** Only real, non-zero numbers from the database are shown. */
const statItems = computed<StatItem[]>((): StatItem[] => {
  const { productCount, reviewCount, averageRating } = props.stats;
  const items: StatItem[] = [{ value: '100%', label: 'Handmade in Pakistan' }];
  if (productCount > 0) {
    items.push({ value: `${productCount}+`, label: 'Handmade designs' });
  }
  if (averageRating !== null && reviewCount > 0) {
    items.push({ value: `${averageRating.toFixed(1)}★`, label: `From ${reviewCount} reviews` });
  }
  return items;
});
</script>

<template>
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="hero__eyebrow">{{ settings.tagline }}</p>
        <h1 class="hero__title font-serif">{{ settings.heroTitle }}</h1>
        <p class="hero__subtitle">{{ settings.heroSubtitle }}</p>
        <div class="hero__actions">
          <AppButton to="/shop" size="lg">Shop the collection</AppButton>
          <AppButton to="/custom-orders" variant="outline" size="lg">Custom orders</AppButton>
        </div>
        <dl class="hero__stats">
          <div v-for="stat in statItems" :key="stat.label" class="hero__stat">
            <dt class="hero__stat-label">{{ stat.label }}</dt>
            <dd class="hero__stat-value font-serif">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>

      <div class="hero__media">
        <img :src="settings.heroImageUrl" alt="A handmade fuzzy-wire bouquet" class="hero__image" width="640" height="720">
        <div class="hero__floating-card">
          <span aria-hidden="true">🌷</span>
          <span>
            <strong>Never wilts</strong>
            <small>Zero water · zero pollen</small>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 56px 0 72px;
  background:
    radial-gradient(circle at 8% 15%, rgba(248, 196, 214, 0.45), transparent 40%),
    radial-gradient(circle at 92% 85%, rgba(254, 243, 199, 0.6), transparent 42%);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 56px;
}

.hero__eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-primary);
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-full);
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 1.08;
}

.hero__subtitle {
  max-width: 520px;
  margin-top: 20px;
  font-size: 1.125rem;
  color: var(--color-text-muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 40px;
}

.hero__stat {
  display: flex;
  flex-direction: column-reverse;
}

.hero__stat-value {
  font-size: 1.75rem;
  font-weight: 700;
}

.hero__stat-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.hero__media {
  position: relative;
}

.hero__image {
  width: 100%;
  aspect-ratio: 8 / 9;
  object-fit: cover;
  border: 6px solid var(--color-surface);
  border-radius: 200px 200px var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.hero__floating-card {
  position: absolute;
  bottom: 28px;
  left: -24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  font-size: 0.875rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.hero__floating-card span:first-child {
  font-size: 1.75rem;
}

.hero__floating-card small {
  display: block;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__media {
    max-width: 440px;
    margin: 0 auto;
  }

  .hero__floating-card {
    left: 12px;
  }
}
</style>
