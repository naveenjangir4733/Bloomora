<script setup lang="ts">
import type { AlertVariant } from '@/types/ui.types';

withDefaults(defineProps<{ variant?: AlertVariant }>(), { variant: 'info' });
</script>

<template>
  <div :class="['app-alert', `app-alert--${variant}`]" :role="variant === 'error' ? 'alert' : 'status'">
    <slot />
  </div>
</template>

<style scoped>
.app-alert {
  padding: 12px 16px;
  font-size: 0.875rem;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
}

.app-alert--success {
  background-color: var(--color-sage-soft);
  border-color: #a7f3d0;
  color: var(--color-sage);
}

.app-alert--error {
  background-color: var(--color-danger-soft);
  border-color: #fecaca;
  color: var(--color-danger);
}

.app-alert--info {
  background-color: var(--color-sky-soft);
  border-color: #bae6fd;
  color: var(--color-sky);
}
</style>
