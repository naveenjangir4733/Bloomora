<script setup lang="ts">
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import ContactForm from '@/components/features/inquiry/ContactForm.vue';

useSeoMeta({ title: 'Contact us', description: 'Questions about an order or a custom piece? Get in touch.' });

const { data: storeConfig } = useStoreConfig();
</script>

<template>
  <section class="section">
    <div class="container">
      <AppSectionHeading as="h1" eyebrow="Say hello" title="Contact us" subtitle="We usually reply within a day." />

      <div class="contact-page">
        <aside v-if="storeConfig" class="contact-page__details">
          <h2 class="contact-page__heading">Reach us directly</h2>
          <ul class="contact-page__list">
            <li>
              <span aria-hidden="true">💬</span>
              <a :href="`https://wa.me/${storeConfig.settings.whatsappNumber}`" target="_blank" rel="noopener noreferrer">
                WhatsApp — fastest reply
              </a>
            </li>
            <li>
              <span aria-hidden="true">✉️</span>
              <a :href="`mailto:${storeConfig.settings.contactEmail}`">{{ storeConfig.settings.contactEmail }}</a>
            </li>
            <li>
              <span aria-hidden="true">📞</span>
              <span>{{ storeConfig.settings.contactPhone }}</span>
            </li>
          </ul>
          <p class="contact-page__note">
            Looking for a personalised piece? Use our <NuxtLink to="/custom-orders">custom order form</NuxtLink> instead.
          </p>
        </aside>

        <div class="contact-page__form">
          <ContactForm />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-page {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: start;
  gap: 40px;
}

.contact-page__heading {
  margin-bottom: 16px;
  font-size: 1.125rem;
}

.contact-page__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  list-style: none;
}

.contact-page__list li {
  display: flex;
  gap: 10px;
}

.contact-page__list a:hover {
  color: var(--color-primary);
}

.contact-page__note {
  margin-top: 24px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.contact-page__note a {
  color: var(--color-primary);
  text-decoration: underline;
}

.contact-page__form {
  padding: 28px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

@media (max-width: 900px) {
  .contact-page {
    grid-template-columns: 1fr;
  }
}
</style>
