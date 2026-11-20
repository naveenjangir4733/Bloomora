<script setup lang="ts">
const props = withDefaults(defineProps<{ min?: number; max?: number; label?: string }>(), {
  min: 1,
  max: 20,
  label: 'Quantity',
});

const model = defineModel<number>({ required: true });

const change = (delta: number): void => {
  model.value = Math.min(props.max, Math.max(props.min, model.value + delta));
};
</script>

<template>
  <div class="stepper" role="group" :aria-label="label">
    <button type="button" class="stepper__btn" :disabled="model <= min" aria-label="Decrease quantity" @click="change(-1)">
      −
    </button>
    <output class="stepper__value" aria-live="polite">{{ model }}</output>
    <button type="button" class="stepper__btn" :disabled="model >= max" aria-label="Increase quantity" @click="change(1)">
      +
    </button>
  </div>
</template>

<style scoped>
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
}

.stepper__btn {
  width: 34px;
  height: 34px;
  font-size: 1.125rem;
  color: var(--color-text-muted);
  border-radius: 50%;
}

.stepper__btn:hover:not(:disabled) {
  color: var(--color-text);
  background-color: var(--color-surface-muted);
}

.stepper__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper__value {
  min-width: 28px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9375rem;
}
</style>
