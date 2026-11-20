<script setup lang="ts">
import type { PaymentMethod } from '@/types/order.types';
import type { PaymentOption } from '@/types/store.types';
import { PAYMENT_METHOD_ICONS } from '@/utils/labels';

defineProps<{ options: PaymentOption[]; error?: string }>();

const selected = defineModel<PaymentMethod>({ required: true });
</script>

<template>
  <fieldset class="payment-picker">
    <legend class="payment-picker__legend">Payment method <span aria-hidden="true">*</span></legend>
    <p class="payment-picker__note">
      100% advance payment — no cash on delivery. You'll get the account details right after placing your order.
    </p>
    <div class="payment-picker__options">
      <label
        v-for="option in options"
        :key="option.method"
        :class="['payment-option', { 'is-selected': option.method === selected }]"
      >
        <input v-model="selected" type="radio" name="paymentMethod" :value="option.method" class="sr-only">
        <span class="payment-option__icon" aria-hidden="true">{{ PAYMENT_METHOD_ICONS[option.method] }}</span>
        <span class="payment-option__label">{{ option.label }}</span>
      </label>
    </div>
    <p v-if="error" class="payment-picker__error" role="alert">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.payment-picker {
  border: none;
}

.payment-picker__legend {
  font-size: 0.8125rem;
  font-weight: 600;
}

.payment-picker__legend span {
  color: var(--color-primary);
}

.payment-picker__note {
  margin: 4px 0 12px;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.payment-picker__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background-color: var(--color-surface);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.2s var(--ease), background-color 0.2s var(--ease);
}

.payment-option:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.payment-option.is-selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.payment-option__icon {
  font-size: 1.375rem;
}

.payment-option__label {
  font-weight: 600;
}

.payment-picker__error {
  margin-top: 6px;
  font-size: 0.8125rem;
  color: var(--color-danger);
}
</style>
