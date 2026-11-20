<script setup lang="ts">
import type { Category } from '@/types/catalog.types';
import type { ContentPageLink, SocialLinks, StoreSettings } from '@/types/store.types';

const props = defineProps<{
  settings: StoreSettings;
  categories: Category[];
  pages: ContentPageLink[];
}>();

interface SocialLink {
  label: string;
  url: string;
}

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};
const SOCIAL_ORDER: ReadonlyArray<keyof SocialLinks> = ['instagram', 'facebook', 'tiktok', 'youtube'];

const socialLinks = computed<SocialLink[]>((): SocialLink[] =>
  SOCIAL_ORDER.flatMap((key): SocialLink[] => {
    const url = props.settings.social[key];
    return url ? [{ label: SOCIAL_LABELS[key], url }] : [];
  }),
);

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <section class="site-footer__brand">
        <NuxtLink to="/" class="site-footer__logo font-serif">🌸 {{ settings.storeName }}</NuxtLink>
        <p class="site-footer__tagline">{{ settings.tagline }}</p>
        <p class="site-footer__description">{{ settings.description }}</p>
        <ul class="site-footer__social">
          <li v-for="link in socialLinks" :key="link.label">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
        </ul>
      </section>

      <nav aria-label="Shop categories">
        <h2 class="site-footer__heading">Shop</h2>
        <ul class="site-footer__links">
          <li v-for="category in categories" :key="category.id">
            <NuxtLink :to="`/collections/${category.slug}`">{{ category.name }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav aria-label="Help and policies">
        <h2 class="site-footer__heading">Help</h2>
        <ul class="site-footer__links">
          <li><NuxtLink to="/track-order">Track your order</NuxtLink></li>
          <li><NuxtLink to="/custom-orders">Custom orders</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact us</NuxtLink></li>
          <li v-for="page in pages" :key="page.slug">
            <NuxtLink :to="`/${page.slug}`">{{ page.title }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <section>
        <h2 class="site-footer__heading">Get in touch</h2>
        <ul class="site-footer__links">
          <li><a :href="`mailto:${settings.contactEmail}`">{{ settings.contactEmail }}</a></li>
          <li><a :href="`tel:${settings.contactPhone.replaceAll(' ', '')}`">{{ settings.contactPhone }}</a></li>
          <li><a :href="`https://wa.me/${settings.whatsappNumber}`" target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
        </ul>
      </section>
    </div>

    <div class="container site-footer__bottom">
      <p>© {{ year }} {{ settings.storeName }}. Handmade little things. Big feelings.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 40px;
  padding-top: 64px;
  background-color: var(--color-ink);
  color: #e9dfe2;
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 48px;
}

.site-footer__logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-inverse);
}

.site-footer__tagline {
  margin-top: 6px;
  color: var(--color-primary-border);
  font-style: italic;
}

.site-footer__description {
  margin-top: 12px;
  font-size: 0.875rem;
  color: #c4b5ba;
}

.site-footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  list-style: none;
}

.site-footer__social a {
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.8125rem;
  border: 1px solid #5a474d;
  border-radius: var(--radius-full);
}

.site-footer__social a:hover {
  border-color: var(--color-primary-border);
  color: var(--color-text-inverse);
}

.site-footer__heading {
  margin-bottom: 14px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-inverse);
}

.site-footer__links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  font-size: 0.875rem;
}

.site-footer__links a {
  color: #c4b5ba;
  transition: color 0.2s var(--ease);
}

.site-footer__links a:hover {
  color: var(--color-text-inverse);
}

.site-footer__bottom {
  padding-top: 20px;
  padding-bottom: 28px;
  border-top: 1px solid #4a3a3f;
  font-size: 0.8125rem;
  color: #a8979c;
}

@media (max-width: 900px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .site-footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
