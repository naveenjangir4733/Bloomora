<script setup lang="ts">
const props = defineProps<{ page: number; totalPages: number }>();

const emit = defineEmits<{
  change: [page: number];
}>();

const pages = computed<number[]>((): number[] =>
  Array.from({ length: props.totalPages }, (_unused: unknown, index: number): number => index + 1),
);
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <button type="button" class="pagination__btn" :disabled="page <= 1" @click="emit('change', page - 1)">
      ← Prev
    </button>
    <button
      v-for="number in pages"
      :key="number"
      type="button"
      :class="['pagination__btn', { 'is-active': number === page }]"
      :aria-current="number === page ? 'page' : undefined"
      @click="emit('change', number)"
    >
      {{ number }}
    </button>
    <button type="button" class="pagination__btn" :disabled="page >= totalPages" @click="emit('change', page + 1)">
      Next →
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 40px;
}

.pagination__btn {
  min-width: 40px;
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
}

.pagination__btn:hover:not(:disabled) {
  border-color: var(--color-text);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__btn.is-active {
  background-color: var(--color-ink);
  border-color: var(--color-ink);
  color: var(--color-text-inverse);
}
</style>
