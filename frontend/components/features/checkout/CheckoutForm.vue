<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppTextarea from '@/components/common/AppTextarea.vue';
import PaymentMethodPicker from '@/components/features/checkout/PaymentMethodPicker.vue';
import type { FieldErrors } from '@/types/api.types';
import type { CustomerDetails, PaymentMethod } from '@/types/order.types';
import type { PaymentOption } from '@/types/store.types';
import { formatPrice } from '@/utils/format';

/** Customer details + payment method. Emits a validated-by-server submit; parent owns the request. */
defineProps<{
  paymentOptions: PaymentOption[];
  total: number;
  pending: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
}>();

const emit = defineEmits<{
  submit: [customer: CustomerDetails, paymentMethod: PaymentMethod];
}>();

const customer = reactive<CustomerDetails>({ name: '', phone: '', email: '', city: '', address: '', notes: '' });
const paymentMethod = ref<PaymentMethod>('bank_transfer');

const onSubmit = (): void => {
  emit('submit', { ...customer }, paymentMethod.value);
};
</script>

<template>
  <form class="checkout-form" novalidate @submit.prevent="onSubmit">
    <section class="checkout-form__section">
      <h2 class="checkout-form__heading">Delivery details</h2>
      <div class="checkout-form__grid">
        <AppInput
          id="name"
          v-model="customer.name"
          label="Full name"
          autocomplete="name"
          required
          :error="fieldErrors['customer.name']"
        />
        <AppInput
          id="phone"
          v-model="customer.phone"
          label="Mobile number"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="0300 1234567"
          required
          :error="fieldErrors['customer.phone']"
          hint="We'll confirm your order on WhatsApp"
        />
        <AppInput
          id="email"
          v-model="customer.email"
          label="Email (optional)"
          type="email"
          autocomplete="email"
          :error="fieldErrors['customer.email']"
        />
        <AppInput
          id="city"
          v-model="customer.city"
          label="City"
          autocomplete="address-level2"
          required
          :error="fieldErrors['customer.city']"
        />
      </div>
      <AppTextarea
        id="address"
        v-model="customer.address"
        label="Full address"
        :rows="3"
        :maxlength="500"
        placeholder="House / street / area"
        required
        :error="fieldErrors['customer.address']"
      />
      <AppTextarea
        id="notes"
        v-model="customer.notes"
        label="Order notes (optional)"
        :rows="2"
        :maxlength="500"
        placeholder="Names or letters for personalised items, gift message, colour preferences…"
        :error="fieldErrors['customer.notes']"
      />
    </section>

    <section class="checkout-form__section">
      <PaymentMethodPicker v-model="paymentMethod" :options="paymentOptions" :error="fieldErrors['paymentMethod']" />
    </section>

    <AppAlert v-if="error" variant="error">{{ error }}</AppAlert>

    <AppButton type="submit" size="lg" block :loading="pending">Place order · {{ formatPrice(total) }}</AppButton>
  </form>
</template>

<style scoped>
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkout-form__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.checkout-form__heading {
  font-size: 1.125rem;
}

.checkout-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 640px) {
  .checkout-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
