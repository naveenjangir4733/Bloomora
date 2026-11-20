<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppFormField from '@/components/common/AppFormField.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppTextarea from '@/components/common/AppTextarea.vue';
import type { Category } from '@/types/catalog.types';
import type { CustomOrderPayload } from '@/types/store.types';

defineProps<{ categories: Category[] }>();

interface CustomOrderForm {
  name: string;
  phone: string;
  email: string;
  categorySlug: string;
  budget: string;
  neededBy: string;
  description: string;
}

const emptyForm = (): CustomOrderForm => ({
  name: '',
  phone: '',
  email: '',
  categorySlug: '',
  budget: '',
  neededBy: '',
  description: '',
});

const form = reactive<CustomOrderForm>(emptyForm());
const successMessage = ref<string | null>(null);
const { submitCustomOrder } = useInquiries();
const submission = useAsyncAction(submitCustomOrder);

const today = new Date().toISOString().slice(0, 10);

const toPayload = (values: CustomOrderForm): CustomOrderPayload => {
  const budget = Number.parseFloat(values.budget);
  return {
    name: values.name,
    phone: values.phone,
    email: values.email,
    categorySlug: values.categorySlug || null,
    budget: Number.isFinite(budget) ? budget : null,
    neededBy: values.neededBy || null,
    description: values.description,
  };
};

const onSubmit = async (): Promise<void> => {
  successMessage.value = null;
  const result = await submission.run(toPayload(form));
  if (result) {
    successMessage.value = result.message;
    Object.assign(form, emptyForm());
  }
};
</script>

<template>
  <form class="inquiry-form" novalidate @submit.prevent="onSubmit">
    <AppAlert v-if="successMessage" variant="success">🎉 {{ successMessage }}</AppAlert>

    <div class="inquiry-form__grid">
      <AppInput id="co-name" v-model="form.name" label="Your name" autocomplete="name" required :error="submission.fieldErrors.value['name']" />
      <AppInput
        id="co-phone"
        v-model="form.phone"
        label="WhatsApp number"
        type="tel"
        inputmode="tel"
        placeholder="0300 1234567"
        required
        :error="submission.fieldErrors.value['phone']"
      />
      <AppInput id="co-email" v-model="form.email" label="Email (optional)" type="email" :error="submission.fieldErrors.value['email']" />
      <AppFormField id="co-category" label="What would you like?" :error="submission.fieldErrors.value['categorySlug']">
        <select id="co-category" v-model="form.categorySlug" class="form-control">
          <option value="">Not sure yet</option>
          <option v-for="category in categories" :key="category.id" :value="category.slug">{{ category.name }}</option>
        </select>
      </AppFormField>
      <AppInput
        id="co-budget"
        v-model="form.budget"
        label="Budget in Rs (optional)"
        type="number"
        inputmode="numeric"
        min="1"
        :error="submission.fieldErrors.value['budget']"
      />
      <AppInput id="co-date" v-model="form.neededBy" label="Needed by (optional)" type="date" :min="today" :error="submission.fieldErrors.value['neededBy']" />
    </div>

    <AppTextarea
      id="co-description"
      v-model="form.description"
      label="Describe your idea"
      :rows="5"
      placeholder="Colours, flowers, names or dates to include, the occasion, sizes…"
      required
      :error="submission.fieldErrors.value['description']"
    />

    <AppAlert v-if="submission.error.value" variant="error">{{ submission.error.value }}</AppAlert>
    <AppButton type="submit" size="lg" :loading="submission.pending.value">Send request</AppButton>
  </form>
</template>

<style scoped>
.inquiry-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.inquiry-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 640px) {
  .inquiry-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
