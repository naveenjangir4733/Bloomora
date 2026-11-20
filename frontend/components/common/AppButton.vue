<script setup lang="ts">
import type { ButtonVariant, ButtonSize } from '@/types';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :type="type"
    :class="['app-btn', `app-btn--${variant}`, `app-btn--${size}`, { 'app-btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner" aria-hidden="true" />
    <span class="btn-content" :class="{ 'btn-content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  border: 1px solid transparent;
  user-select: none;
  white-space: nowrap;
}

.app-btn--sm {
  padding: 6px 12px;
  font-size: 0.8125rem;
  gap: 6px;
}

.app-btn--md {
  padding: 8px 16px;
  font-size: 0.875rem;
  gap: 8px;
}

.app-btn--lg {
  padding: 12px 24px;
  font-size: 1rem;
  gap: 10px;
}

.app-btn--primary {
  background-color: var(--color-primary);
  color: #ffffff;
}
.app-btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.app-btn--secondary {
  background-color: var(--color-secondary);
  color: #ffffff;
}
.app-btn--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-hover);
}

.app-btn--outline {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}
.app-btn--outline:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.app-btn--danger {
  background-color: var(--color-danger);
  color: #ffffff;
}
.app-btn--danger:hover:not(:disabled) {
  background-color: var(--color-danger-hover);
}

.app-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-content--hidden {
  visibility: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
