<script setup lang="ts">
import { formatPrice } from '@/utils/format';

defineProps<{ subtotal: number; shippingFee: number; total: number }>();
</script>

<template>
  <dl class="totals">
    <div class="totals__row">
      <dt>Subtotal</dt>
      <dd>{{ formatPrice(subtotal) }}</dd>
    </div>
    <div class="totals__row">
      <dt>Delivery</dt>
      <dd>{{ shippingFee === 0 ? 'Free' : formatPrice(shippingFee) }}</dd>
    </div>
    <div class="totals__row totals__row--total">
      <dt>Total</dt>
      <dd>{{ formatPrice(total) }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.totals__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.totals__row dd {
  color: var(--color-text);
  font-weight: 600;
}

.totals__row--total {
  margin-top: 6px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  font-size: 1.125rem;
  color: var(--color-text);
}

.totals__row--total dd {
  font-weight: 800;
}
</style>
