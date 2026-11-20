<script setup lang="ts">
import { formatPrice } from '@/utils/format';

const props = defineProps<{ subtotal: number; threshold: number }>();

const remaining = computed<number>((): number => Math.max(0, props.threshold - props.subtotal));
const progress = computed<number>((): number =>
  props.threshold > 0 ? Math.min(100, Math.round((props.subtotal / props.threshold) * 100)) : 100,
);
</script>

<template>
  <div class="meter">
    <p class="meter__text">
      <template v-if="remaining > 0">
        Add <strong>{{ formatPrice(remaining) }}</strong> more for <strong>free delivery</strong> 🚚
      </template>
      <template v-else>🎉 You've unlocked <strong>free delivery</strong>!</template>
    </p>
    <div
      class="meter__track"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Progress to free delivery"
    >
      <div class="meter__fill" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<style scoped>
.meter__text {
  margin-bottom: 8px;
  font-size: 0.8125rem;
  text-align: center;
}

.meter__track {
  height: 6px;
  overflow: hidden;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
}

.meter__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #f59e0b);
  border-radius: var(--radius-full);
  transition: width 0.4s var(--ease);
}
</style>
