<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import { useApi } from '@/composables/useApi';

const { getHealth } = useApi();
const isBackendOnline = ref<boolean>(false);

const checkHealth = async (): Promise<void> => {
  try {
    const res = await getHealth();
    isBackendOnline.value = res.success;
  } catch {
    isBackendOnline.value = false;
  }
};

onMounted(() => {
  void checkHealth();
});
</script>

<template>
  <div class="layout">
    <AppHeader title="Full-Stack Hub (Nuxt 3 + Express)" :is-backend-online="isBackendOnline" />
    <main class="layout__main">
      <slot />
    </main>
    <footer class="layout__footer">
      <div class="layout__footer-content">
        <p>Built with Nuxt 3, Express, Strictly Coupled TypeScript & Clean Architecture.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.layout__footer {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
  padding: 20px 24px;
  text-align: center;
}

.layout__footer-content {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
