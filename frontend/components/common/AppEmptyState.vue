<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; title: string; description?: string }>(), {
  icon: '🌸',
  description: undefined,
});
</script>

<template>
  <div class="empty-state">
    <span class="empty-state__icon" aria-hidden="true">{{ icon }}</span>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <div v-if="$slots.default" class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 56px 24px;
  text-align: center;
  background-color: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
}

.empty-state__icon {
  display: block;
  margin-bottom: 12px;
  font-size: 2.75rem;
}

.empty-state__title {
  font-size: 1.25rem;
}

.empty-state__description {
  max-width: 420px;
  margin: 8px auto 0;
  color: var(--color-text-muted);
}

.empty-state__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}
</style>
