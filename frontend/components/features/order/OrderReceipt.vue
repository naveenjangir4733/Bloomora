<script setup lang="ts">
import AppBadge from '@/components/common/AppBadge.vue';
import OrderTotals from '@/components/features/checkout/OrderTotals.vue';
import OrderStatusTimeline from '@/components/features/order/OrderStatusTimeline.vue';
import PaymentInstructions from '@/components/features/order/PaymentInstructions.vue';
import type { OrderConfirmation } from '@/types/order.types';
import { formatDate, formatPrice } from '@/utils/format';
import { ORDER_STATUS_STYLES } from '@/utils/labels';

defineProps<{ confirmation: OrderConfirmation }>();
</script>

<template>
  <div class="receipt">
    <header class="receipt__header">
      <div>
        <p class="receipt__label">Order</p>
        <h2 class="receipt__number font-serif">{{ confirmation.order.orderNumber }}</h2>
        <p class="receipt__date">Placed {{ formatDate(confirmation.order.createdAt) }}</p>
      </div>
      <AppBadge :variant="ORDER_STATUS_STYLES[confirmation.order.status].variant">
        {{ ORDER_STATUS_STYLES[confirmation.order.status].label }}
      </AppBadge>
    </header>

    <OrderStatusTimeline :status="confirmation.order.status" />

    <PaymentInstructions
      v-if="confirmation.order.status === 'pending_payment' && confirmation.paymentOption"
      :option="confirmation.paymentOption"
      :total="confirmation.order.total"
      :order-number="confirmation.order.orderNumber"
    />

    <div class="receipt__columns">
      <section class="receipt__card">
        <h3 class="receipt__heading">Items</h3>
        <ul class="receipt__items">
          <li v-for="item in confirmation.order.items" :key="item.id" class="receipt__item">
            <img :src="item.imageUrl" :alt="item.productName" width="56" height="56">
            <span class="receipt__item-name">
              {{ item.productName }}
              <small v-if="item.variantName">{{ item.variantName }}</small>
              <small>Qty {{ item.quantity }} × {{ formatPrice(item.unitPrice) }}</small>
            </span>
            <strong>{{ formatPrice(item.lineTotal) }}</strong>
          </li>
        </ul>
        <OrderTotals
          :subtotal="confirmation.order.subtotal"
          :shipping-fee="confirmation.order.shippingFee"
          :total="confirmation.order.total"
        />
      </section>

      <section class="receipt__card">
        <h3 class="receipt__heading">Delivering to</h3>
        <address class="receipt__address">
          <strong>{{ confirmation.order.customer.name }}</strong><br>
          {{ confirmation.order.customer.address }}<br>
          {{ confirmation.order.customer.city }}<br>
          {{ confirmation.order.customer.phone }}
        </address>
        <p v-if="confirmation.order.customer.notes" class="receipt__notes">
          <strong>Notes:</strong> {{ confirmation.order.customer.notes }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.receipt {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.receipt__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.receipt__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.receipt__number {
  font-size: 2rem;
}

.receipt__date {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.receipt__columns {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}

.receipt__card {
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.receipt__heading {
  margin-bottom: 12px;
  font-size: 1rem;
}

.receipt__items {
  margin-bottom: 16px;
  list-style: none;
}

.receipt__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}

.receipt__item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.receipt__item-name {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 600;
}

.receipt__item-name small {
  display: block;
  font-weight: 400;
  color: var(--color-text-muted);
}

.receipt__address {
  font-style: normal;
  line-height: 1.7;
}

.receipt__notes {
  margin-top: 12px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (max-width: 800px) {
  .receipt__columns {
    grid-template-columns: 1fr;
  }
}
</style>
