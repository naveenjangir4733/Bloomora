<script setup lang="ts">
import { NuxtLink } from '#components';
import type { ButtonSize, ButtonVariant } from '@/types/ui.types';

/**
 * Button primitive. Renders a NuxtLink when `to` is set, an external link when `href`
 * is set, and a native <button> otherwise — so links are never nested inside buttons.
 */
const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit';
    to?: string;
    href?: string;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    to: undefined,
    href: undefined,
    disabled: false,
    loading: false,
    block: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed<string[]>((): string[] => [
  'app-btn',
  `app-btn--${props.variant}`,
  `app-btn--${props.size}`,
  ...(props.block ? ['app-btn--block'] : []),
  ...(props.loading ? ['app-btn--loading'] : []),
]);

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <a v-else-if="href" :href="href" target="_blank" rel="noopener noreferrer" :class="classes">
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true" />
    <span class="app-btn__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  transition:
    background-color 0.2s var(--ease),
    border-color 0.2s var(--ease),
    color 0.2s var(--ease),
    transform 0.2s var(--ease),
    box-shadow 0.2s var(--ease);
}

.app-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.app-btn--block {
  width: 100%;
}

.app-btn--sm {
  padding: 8px 16px;
  font-size: 0.8125rem;
}

.app-btn--md {
  padding: 11px 22px;
  font-size: 0.9375rem;
}

.app-btn--lg {
  padding: 15px 30px;
  font-size: 1rem;
}

.app-btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: 0 6px 16px -6px rgba(194, 37, 92, 0.55);
}

.app-btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.app-btn--secondary {
  background-color: var(--color-ink);
  color: var(--color-text-inverse);
}

.app-btn--secondary:hover:not(:disabled) {
  background-color: #000000;
}

.app-btn--outline {
  background-color: var(--color-surface);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.app-btn--outline:hover:not(:disabled) {
  border-color: var(--color-text);
}

.app-btn--soft {
  background-color: var(--color-primary-soft);
  border-color: var(--color-primary-border);
  color: var(--color-primary);
}

.app-btn--soft:hover:not(:disabled) {
  background-color: var(--color-primary-border);
}

.app-btn--ghost {
  color: var(--color-text-muted);
}

.app-btn--ghost:hover:not(:disabled) {
  color: var(--color-text);
  background-color: var(--color-surface-muted);
}

.app-btn--loading .app-btn__content {
  visibility: hidden;
}

.app-btn__spinner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .app-btn__spinner {
    animation-duration: 2s;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
