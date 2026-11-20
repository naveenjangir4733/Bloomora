<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import OrderLookup from '@/components/features/order/OrderLookup.vue';
import OrderReceipt from '@/components/features/order/OrderReceipt.vue';
import type { OrderConfirmation } from '@/types/order.types';
import { readRouteParam } from '@/utils/route-params';

useSeoMeta({ title: 'Your order', robots: 'noindex' });

const route = useRoute();
const orderNumber = readRouteParam(route.params, 'orderNumber').toUpperCase();
const { lastOrder } = useOrders();

/** Right after checkout the confirmation is already in memory; otherwise ask for the phone number. */
const confirmation = computed<OrderConfirmation | null>((): OrderConfirmation | null =>
  lastOrder.value?.order.orderNumber === orderNumber ? lastOrder.value : null,
);
</script>

<template>
  <section class="section">
    <div class="container order-page">
      <template v-if="confirmation">
        <AppSectionHeading
          as="h1"
          eyebrow="Thank you!"
          :title="`Order ${confirmation.order.orderNumber} received`"
          subtitle="Please complete your advance payment below. We'll confirm on WhatsApp and start crafting right away."
        />
        <OrderReceipt :confirmation="confirmation" />
        <div class="order-page__actions">
          <AppButton to="/shop" variant="outline">Continue shopping</AppButton>
        </div>
      </template>

      <template v-else>
        <AppSectionHeading as="h1" title="Find your order" subtitle="Enter the phone number you used at checkout." />
        <OrderLookup :initial-order-number="orderNumber" />
      </template>
    </div>
  </section>
</template>

<style scoped>
.order-page {
  max-width: 960px;
}

.order-page__actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
