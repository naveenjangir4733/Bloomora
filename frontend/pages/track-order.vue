<script setup lang="ts">
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import OrderLookup from '@/components/features/order/OrderLookup.vue';

useSeoMeta({ title: 'Track your order', description: 'Check the status of your handmade order.' });
</script>

<template>
  <section class="section">
    <div class="container track-page">
      <AppSectionHeading
        as="h1"
        eyebrow="Order status"
        title="Track your order"
        subtitle="Use the order number from your confirmation and the phone number you checked out with."
      />
      <OrderLookup />
    </div>
  </section>
</template>

<style scoped>
.track-page {
  max-width: 960px;
}
</style>
