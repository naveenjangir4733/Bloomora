<script setup lang="ts">
import type { BreadcrumbItem } from '@/types/ui.types';

defineProps<{ items: BreadcrumbItem[] }>();
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li v-for="(item, index) in items" :key="item.label">
        <NuxtLink v-if="item.to && index < items.length - 1" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  font-size: 0.8125rem;
  color: var(--color-text-subtle);
}

.breadcrumbs li:not(:last-child)::after {
  content: '/';
  margin-left: 6px;
}

.breadcrumbs a:hover {
  color: var(--color-primary);
}

.breadcrumbs [aria-current='page'] {
  color: var(--color-text-muted);
}
</style>
