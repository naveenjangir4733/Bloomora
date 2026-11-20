<script setup lang="ts">
import type { PaymentOption } from '@/types/store.types';
import { formatPrice } from '@/utils/format';
import { PAYMENT_METHOD_ICONS } from '@/utils/labels';

defineProps<{ option: PaymentOption; total: number; orderNumber: string }>();
</script>

<template>
  <section class="payment-instructions">
    <h2 class="payment-instructions__title">
      <span aria-hidden="true">{{ PAYMENT_METHOD_ICONS[option.method] }}</span>
      Pay {{ formatPrice(total) }} via {{ option.label }}
    </h2>
    <dl class="payment-instructions__details">
      <div>
        <dt>Account title</dt>
        <dd>{{ option.accountTitle }}</dd>
      </div>
      <div>
        <dt>Account number</dt>
        <dd class="payment-instructions__number">{{ option.accountNumber }}</dd>
      </div>
      <div>
        <dt>Reference</dt>
        <dd class="payment-instructions__number">{{ orderNumber }}</dd>
      </div>
    </dl>
    <p class="payment-instructions__note">{{ option.instructions }}</p>
  </section>
</template>

<style scoped>
.payment-instructions {
  padding: 20px 24px;
  background-color: var(--color-amber-soft);
  border: 1px solid #fcd34d;
  border-radius: var(--radius-lg);
}

.payment-instructions__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
}

.payment-instructions__details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.payment-instructions__details dt {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-amber);
}

.payment-instructions__number {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 700;
}

.payment-instructions__note {
  font-size: 0.875rem;
}
</style>
