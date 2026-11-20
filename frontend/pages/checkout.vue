<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import AppEmptyState from '@/components/common/AppEmptyState.vue';
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import FreeShippingMeter from '@/components/features/cart/FreeShippingMeter.vue';
import CheckoutForm from '@/components/features/checkout/CheckoutForm.vue';
import OrderTotals from '@/components/features/checkout/OrderTotals.vue';
import type { CustomerDetails, OrderConfirmation, PaymentMethod } from '@/types/order.types';
import { formatPrice } from '@/utils/format';

useSeoMeta({ title: 'Checkout', robots: 'noindex' });

const { data: storeConfig } = useStoreConfig();
const { items, subtotal, clearCart } = useCart();
const { placeOrder } = useOrders();
const checkout = useAsyncAction(placeOrder);

/** Estimate only — the server recalculates prices and delivery when the order is placed. */
const shippingFee = computed<number>((): number => {
  const settings = storeConfig.value?.settings;
  if (!settings) {
    return 0;
  }
  return subtotal.value >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
});
const total = computed<number>((): number => subtotal.value + shippingFee.value);

const onSubmit = async (customer: CustomerDetails, paymentMethod: PaymentMethod): Promise<void> => {
  const confirmation: OrderConfirmation | null = await checkout.run({
    customer,
    paymentMethod,
    items: items.value.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
  });
  if (confirmation) {
    clearCart();
    await navigateTo(`/order/${confirmation.order.orderNumber}`);
  }
};
</script>

<template>
  <section class="section">
    <div class="container">
      <AppSectionHeading as="h1" title="Checkout" subtitle="Advance payment only — we start crafting once payment is confirmed." />

      <ClientOnly>
        <AppEmptyState v-if="items.length === 0" icon="🛍️" title="Your cart is empty" description="Add something handmade before checking out.">
          <AppButton to="/shop">Browse the shop</AppButton>
        </AppEmptyState>

        <div v-else class="checkout">
          <CheckoutForm
            :payment-options="storeConfig?.paymentOptions ?? []"
            :total="total"
            :pending="checkout.pending.value"
            :error="checkout.error.value"
            :field-errors="checkout.fieldErrors.value"
            @submit="onSubmit"
          />

          <aside class="checkout__summary" aria-label="Order summary">
            <h2 class="checkout__summary-title">Order summary</h2>
            <ul class="checkout__items">
              <li v-for="item in items" :key="item.key" class="checkout__item">
                <span class="checkout__thumb">
                  <img :src="item.imageUrl" :alt="item.name" width="56" height="56">
                  <span class="checkout__qty">{{ item.quantity }}</span>
                </span>
                <span class="checkout__name">
                  {{ item.name }}
                  <small v-if="item.variantName">{{ item.variantName }}</small>
                </span>
                <span>{{ formatPrice(item.unitPrice * item.quantity) }}</span>
              </li>
            </ul>
            <FreeShippingMeter
              v-if="storeConfig"
              :subtotal="subtotal"
              :threshold="storeConfig.settings.freeShippingThreshold"
              class="checkout__meter"
            />
            <OrderTotals :subtotal="subtotal" :shipping-fee="shippingFee" :total="total" />
          </aside>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
.checkout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  align-items: start;
  gap: 32px;
}

.checkout__summary {
  position: sticky;
  top: calc(var(--header-height) + 16px);
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.checkout__summary-title {
  margin-bottom: 12px;
  font-size: 1.125rem;
}

.checkout__items {
  list-style: none;
}

.checkout__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.9375rem;
  border-bottom: 1px solid var(--color-border);
}

.checkout__thumb {
  position: relative;
}

.checkout__thumb img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.checkout__qty {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  padding: 0 5px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-text-inverse);
  background-color: var(--color-ink);
  border-radius: var(--radius-full);
}

.checkout__name {
  flex: 1;
  font-weight: 600;
}

.checkout__name small {
  display: block;
  font-weight: 400;
  color: var(--color-text-muted);
}

.checkout__meter {
  margin: 16px 0;
}

@media (max-width: 900px) {
  .checkout {
    grid-template-columns: 1fr;
  }

  .checkout__summary {
    position: static;
    order: -1;
  }
}
</style>
