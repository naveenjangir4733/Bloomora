<script setup lang="ts">
import AppBadge from '@/components/common/AppBadge.vue';

interface Props {
  title?: string;
  isBackendOnline?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'Learning Project',
  isBackendOnline: false,
});
</script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <div class="app-header__brand">
        <span class="app-header__logo">⚡</span>
        <h1 class="app-header__title">{{ title }}</h1>
      </div>

      <div class="app-header__status">
        <AppBadge :variant="isBackendOnline ? 'success' : 'error'" :dot="true">
          {{ isBackendOnline ? 'Backend Online' : 'Backend Offline' }}
        </AppBadge>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.app-header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__logo {
  font-size: 1.5rem;
}

.app-header__title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.app-header__status {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
