<script setup lang="ts">
withDefaults(defineProps<{ height?: string; radius?: string }>(), { height: '16px', radius: 'var(--radius-sm)' });
</script>

<template>
  <div class="skeleton" :style="{ height, borderRadius: radius }" aria-hidden="true" />
</template>

<style scoped>
.skeleton {
  width: 100%;
  background: linear-gradient(90deg, var(--color-surface-muted) 25%, var(--color-border) 50%, var(--color-surface-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s var(--ease) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
</style>
