<script setup lang="ts">
import type { OrderStatus } from '@/types/order.types';
import { ORDER_PROGRESS, ORDER_STATUS_STYLES } from '@/utils/labels';

const props = defineProps<{ status: OrderStatus }>();

const currentIndex = computed<number>((): number => ORDER_PROGRESS.indexOf(props.status));
</script>

<template>
  <p v-if="status === 'cancelled'" class="timeline-cancelled">This order was cancelled.</p>
  <ol v-else class="timeline" aria-label="Order progress">
    <li
      v-for="(step, index) in ORDER_PROGRESS"
      :key="step"
      :class="['timeline__step', { 'is-done': index < currentIndex, 'is-current': index === currentIndex }]"
      :aria-current="index === currentIndex ? 'step' : undefined"
    >
      <span class="timeline__dot" aria-hidden="true">{{ index < currentIndex ? '✓' : index + 1 }}</span>
      <span class="timeline__label">{{ ORDER_STATUS_STYLES[step].label }}</span>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  list-style: none;
  counter-reset: step;
}

.timeline__step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-subtle);
}

.timeline__step:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 15px;
  right: 50%;
  width: 100%;
  height: 2px;
  background-color: var(--color-border);
  z-index: 0;
}

.timeline__step.is-done::before,
.timeline__step.is-current::before {
  background-color: var(--color-primary);
}

.timeline__dot {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-weight: 700;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border-strong);
  border-radius: 50%;
}

.timeline__step.is-done .timeline__dot {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.timeline__step.is-current .timeline__dot {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.timeline__step.is-done,
.timeline__step.is-current {
  color: var(--color-text);
  font-weight: 600;
}

.timeline-cancelled {
  font-weight: 600;
  color: var(--color-danger);
}
</style>
