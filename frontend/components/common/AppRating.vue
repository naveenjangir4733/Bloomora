<script setup lang="ts">
const props = withDefaults(defineProps<{ rating: number | null; count?: number; size?: 'sm' | 'md' }>(), {
  count: undefined,
  size: 'sm',
});

const STAR_COUNT = 5;

const filledStars = computed<number>((): number => Math.round(props.rating ?? 0));
const accessibleLabel = computed<string>((): string =>
  props.rating === null ? 'No ratings yet' : `Rated ${props.rating.toFixed(1)} out of 5`,
);
</script>

<template>
  <div :class="['app-rating', `app-rating--${size}`]" :aria-label="accessibleLabel" role="img">
    <span class="app-rating__stars" aria-hidden="true">
      <span v-for="star in STAR_COUNT" :key="star" :class="{ 'is-filled': star <= filledStars }">★</span>
    </span>
    <span v-if="rating !== null" class="app-rating__value" aria-hidden="true">{{ rating.toFixed(1) }}</span>
    <span v-if="count !== undefined" class="app-rating__count" aria-hidden="true">({{ count }})</span>
  </div>
</template>

<style scoped>
.app-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.app-rating__stars {
  color: var(--color-border-strong);
  letter-spacing: 1px;
}

.is-filled {
  color: #f5a524;
}

.app-rating--sm {
  font-size: 0.8125rem;
}

.app-rating--md {
  font-size: 1rem;
}

.app-rating__value {
  font-weight: 700;
}

.app-rating__count {
  color: var(--color-text-subtle);
}
</style>
