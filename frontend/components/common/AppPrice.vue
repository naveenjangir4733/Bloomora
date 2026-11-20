<script setup lang="ts">
import { formatPrice } from '@/utils/format';

const props = withDefaults(
  defineProps<{ amount: number; compareAt?: number | null; fromPrefix?: boolean; size?: 'sm' | 'md' | 'lg' }>(),
  { compareAt: null, fromPrefix: false, size: 'md' },
);

const hasDiscount = computed<boolean>((): boolean => props.compareAt !== null && props.compareAt > props.amount);
const discountPercent = computed<number>((): number =>
  props.compareAt ? Math.round(((props.compareAt - props.amount) / props.compareAt) * 100) : 0,
);
</script>

<template>
  <div :class="['app-price', `app-price--${size}`]">
    <span class="app-price__current">
      <span v-if="fromPrefix" class="app-price__from">From</span>
      {{ formatPrice(amount) }}
    </span>
    <template v-if="hasDiscount && compareAt !== null">
      <s class="app-price__compare">{{ formatPrice(compareAt) }}</s>
      <span class="app-price__save">−{{ discountPercent }}%</span>
    </template>
  </div>
</template>

<style scoped>
.app-price {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
}

.app-price__current {
  font-weight: 700;
  color: var(--color-text);
}

.app-price__from {
  font-size: 0.75em;
  font-weight: 500;
  color: var(--color-text-muted);
}

.app-price__compare {
  font-size: 0.85em;
  color: var(--color-text-subtle);
}

.app-price__save {
  font-size: 0.75em;
  font-weight: 700;
  color: var(--color-primary);
}

.app-price--sm {
  font-size: 0.9375rem;
}

.app-price--md {
  font-size: 1.125rem;
}

.app-price--lg {
  font-size: 1.75rem;
}
</style>
