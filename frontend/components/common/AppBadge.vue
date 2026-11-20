<script setup lang="ts">
import type { BadgeVariant } from '@/types/ui.types';

withDefaults(defineProps<{ variant?: BadgeVariant }>(), { variant: 'neutral' });
</script>

<template>
  <span :class="['app-badge', `app-badge--${variant}`]">
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.2;
  border-radius: var(--radius-full);
}

.app-badge--rose {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.app-badge--amber {
  background-color: var(--color-amber-soft);
  color: var(--color-amber);
}

.app-badge--sage {
  background-color: var(--color-sage-soft);
  color: var(--color-sage);
}

.app-badge--sky {
  background-color: var(--color-sky-soft);
  color: var(--color-sky);
}

.app-badge--danger {
  background-color: var(--color-danger-soft);
  color: var(--color-danger);
}

.app-badge--neutral {
  background-color: var(--color-ink);
  color: var(--color-text-inverse);
}
</style>
