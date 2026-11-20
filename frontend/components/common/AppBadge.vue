<script setup lang="ts">
import type { BadgeVariant } from '@/types';

interface Props {
  variant?: BadgeVariant;
  dot?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  dot: false,
});
</script>

<template>
  <span :class="['app-badge', `app-badge--${variant}`]">
    <span v-if="dot" class="badge-dot" />
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  line-height: 1;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.app-badge--success {
  background-color: #ecfdf5;
  color: #059669;
}

.app-badge--warning {
  background-color: #fffbeb;
  color: #d97706;
}

.app-badge--error {
  background-color: #fef2f2;
  color: #dc2626;
}

.app-badge--info {
  background-color: #f0f9ff;
  color: #0284c7;
}

.app-badge--neutral {
  background-color: #f1f5f9;
  color: #475569;
}
</style>
