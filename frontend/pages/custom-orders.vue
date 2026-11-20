<script setup lang="ts">
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import CustomOrderForm from '@/components/features/inquiry/CustomOrderForm.vue';

useSeoMeta({
  title: 'Custom orders',
  description: 'Request a personalised bouquet, shadow box or gift — handmade to your idea.',
});

const { data: categories } = useCategories();

const STEPS: ReadonlyArray<{ title: string; text: string }> = [
  { title: 'Share your idea', text: 'Tell us the occasion, colours, names or dates you would like.' },
  { title: 'Get a quote', text: 'We reply on WhatsApp within 24 hours with a price and sketch.' },
  { title: 'Pay & we craft', text: 'After advance payment we hand-make it in 5–7 working days.' },
  { title: 'Delivered to you', text: 'Gift-ready packaging, delivered anywhere in Pakistan.' },
];
</script>

<template>
  <section class="section">
    <div class="container">
      <AppSectionHeading
        as="h1"
        eyebrow="Made just for you"
        title="Custom orders"
        subtitle="Personalised bouquets, framed keepsakes, bulk favours — if you can imagine it, we can shape it."
      />

      <div class="custom-page">
        <ol class="custom-page__steps">
          <li v-for="(step, index) in STEPS" :key="step.title" class="custom-step">
            <span class="custom-step__number" aria-hidden="true">{{ index + 1 }}</span>
            <div>
              <h2 class="custom-step__title">{{ step.title }}</h2>
              <p class="custom-step__text">{{ step.text }}</p>
            </div>
          </li>
        </ol>

        <div class="custom-page__form">
          <CustomOrderForm :categories="categories" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-page {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: start;
  gap: 40px;
}

.custom-page__steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
  list-style: none;
}

.custom-step {
  display: flex;
  gap: 16px;
}

.custom-step__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  font-weight: 700;
  color: var(--color-primary);
  background-color: var(--color-primary-soft);
  border-radius: 50%;
}

.custom-step__title {
  font-size: 1rem;
}

.custom-step__text {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.custom-page__form {
  padding: 28px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

@media (max-width: 900px) {
  .custom-page {
    grid-template-columns: 1fr;
  }
}
</style>
