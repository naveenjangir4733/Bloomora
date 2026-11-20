<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import { toWhatsAppUrl } from '@/utils/format';

const props = defineProps<{ whatsappNumber: string; storeName: string }>();

const whatsappUrl = computed<string>((): string =>
  toWhatsAppUrl(props.whatsappNumber, `Hi ${props.storeName}! I'd like to discuss a custom order.`),
);
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="cta">
        <p class="cta__eyebrow">Made just for you</p>
        <h2 class="cta__title font-serif">Have something special in mind?</h2>
        <p class="cta__text">
          Names, wedding dates, favourite colours or a completely new idea — tell us what you are dreaming of and we
          will shape it by hand.
        </p>
        <div class="cta__actions">
          <AppButton to="/custom-orders" size="lg">Request a custom order</AppButton>
          <AppButton :href="whatsappUrl" variant="outline" size="lg">💬 Chat on WhatsApp</AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 56px 32px;
  text-align: center;
  color: var(--color-text-inverse);
  background:
    radial-gradient(circle at 15% 20%, rgba(194, 37, 92, 0.45), transparent 45%),
    var(--color-ink);
  border-radius: var(--radius-lg);
}

.cta__eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary-border);
}

.cta__title {
  margin-top: 10px;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--color-text-inverse);
}

.cta__text {
  max-width: 560px;
  margin: 14px auto 0;
  color: #e3d6da;
}

.cta__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
</style>
