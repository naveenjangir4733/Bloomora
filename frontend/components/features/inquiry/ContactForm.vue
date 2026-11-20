<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppTextarea from '@/components/common/AppTextarea.vue';
import type { ContactPayload } from '@/types/store.types';

const emptyForm = (): ContactPayload => ({ name: '', email: '', phone: '', subject: '', message: '' });

const form = reactive<ContactPayload>(emptyForm());
const successMessage = ref<string | null>(null);
const { submitContact } = useInquiries();
const submission = useAsyncAction(submitContact);

const onSubmit = async (): Promise<void> => {
  successMessage.value = null;
  const result = await submission.run({ ...form });
  if (result) {
    successMessage.value = result.message;
    Object.assign(form, emptyForm());
  }
};
</script>

<template>
  <form class="inquiry-form" novalidate @submit.prevent="onSubmit">
    <AppAlert v-if="successMessage" variant="success">💌 {{ successMessage }}</AppAlert>

    <div class="inquiry-form__grid">
      <AppInput id="ct-name" v-model="form.name" label="Name" autocomplete="name" required :error="submission.fieldErrors.value['name']" />
      <AppInput
        id="ct-email"
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        required
        :error="submission.fieldErrors.value['email']"
      />
    </div>
    <div class="inquiry-form__grid">
      <AppInput id="ct-phone" v-model="form.phone" label="Phone (optional)" type="tel" :error="submission.fieldErrors.value['phone']" />
      <AppInput id="ct-subject" v-model="form.subject" label="Subject" required :error="submission.fieldErrors.value['subject']" />
    </div>
    <AppTextarea id="ct-message" v-model="form.message" label="Message" :rows="5" required :error="submission.fieldErrors.value['message']" />

    <AppAlert v-if="submission.error.value" variant="error">{{ submission.error.value }}</AppAlert>
    <AppButton type="submit" size="lg" :loading="submission.pending.value">Send message</AppButton>
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
