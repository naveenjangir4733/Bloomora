<script setup lang="ts">
import { useSlots } from 'vue';

interface Props {
  title?: string;
  subtitle?: string;
  bordered?: boolean;
  hoverable?: boolean;
}

withDefaults(defineProps<Props>(), {
  bordered: true,
  hoverable: false,
});

const slots = useSlots();
</script>

<template>
  <div
    :class="[
      'app-card',
      { 'app-card--bordered': bordered, 'app-card--hoverable': hoverable },
    ]"
  >
    <div v-if="slots.header || title" class="app-card__header">
      <slot name="header">
        <div>
          <h3 v-if="title" class="app-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
    </div>

    <div class="app-card__body">
      <slot />
    </div>

    <div v-if="slots.footer" class="app-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.app-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-card--bordered {
  border: 1px solid var(--color-border);
}

.app-card--hoverable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.app-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.app-card__header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.app-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.app-card__subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.app-card__body {
  padding: 20px;
  flex: 1;
}

.app-card__footer {
  padding: 12px 20px;
  background-color: #fafbfc;
  border-top: 1px solid var(--color-border);
}
</style>
