<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import OrderReceipt from '@/components/features/order/OrderReceipt.vue';
import type { OrderConfirmation } from '@/types/order.types';

/** Order number + phone form that reveals the order receipt on success. */
const props = withDefaults(defineProps<{ initialOrderNumber?: string }>(), { initialOrderNumber: '' });

const { trackOrder } = useOrders();
const orderNumber = ref<string>(props.initialOrderNumber);
const phone = ref<string>('');
const confirmation = ref<OrderConfirmation | null>(null);

const lookup = useAsyncAction(trackOrder);

const onSubmit = async (): Promise<void> => {
  confirmation.value = await lookup.run(orderNumber.value, phone.value);
};
</script>

<template>
  <div class="order-lookup">
    <form class="order-lookup__form" novalidate @submit.prevent="onSubmit">
      <AppInput
        id="order-number"
        v-model="orderNumber"
        label="Order number"
        placeholder="BLM-1001"
        required
        :error="lookup.fieldErrors.value['orderNumber']"
      />
      <AppInput
        id="order-phone"
        v-model="phone"
        label="Phone used at checkout"
        type="tel"
        inputmode="tel"
        placeholder="0300 1234567"
        required
        :error="lookup.fieldErrors.value['phone']"
      />
      <AppButton type="submit" :loading="lookup.pending.value" class="order-lookup__submit">Track order</AppButton>
    </form>

    <AppAlert v-if="lookup.error.value && Object.keys(lookup.fieldErrors.value).length === 0" variant="error">
      {{ lookup.error.value }} Double-check the order number and phone number.
    </AppAlert>

    <OrderReceipt v-if="confirmation" :confirmation="confirmation" />
  </div>
</template>

<style scoped>
.order-lookup {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.order-lookup__form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: end;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

@media (max-width: 720px) {
  .order-lookup__form {
    grid-template-columns: 1fr;
  }
}
</style>
