<script setup lang="ts">
import AppAlert from '@/components/common/AppAlert.vue';
import AppAnnouncementBar from '@/components/common/AppAnnouncementBar.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import CartDrawer from '@/components/features/cart/CartDrawer.vue';
import WhatsAppButton from '@/components/features/WhatsAppButton.vue';
import type { StoreSettings } from '@/types/store.types';

const appConfig = useAppConfig();
const { data: storeConfig, error: storeError } = useStoreConfig();
const { data: categories } = useCategories();
const { data: pages } = useContentLinks();
const { totalCount, openDrawer } = useCart();

const settings = computed<StoreSettings | null>((): StoreSettings | null => storeConfig.value?.settings ?? null);
const storeName = computed<string>((): string => settings.value?.storeName ?? appConfig.fallbackStoreName);
</script>

<template>
  <div class="layout">
    <a href="#main" class="skip-link">Skip to content</a>
    <AppAnnouncementBar v-if="settings" :messages="settings.announcements" />
    <AppHeader :store-name="storeName" :categories="categories" :cart-count="totalCount" @open-cart="openDrawer" />

    <main id="main" class="layout__main">
      <div v-if="storeError" class="container layout__alert">
        <AppAlert variant="error">
          We're having trouble reaching the store right now. Please refresh in a moment.
        </AppAlert>
      </div>
      <slot />
    </main>

    <AppFooter v-if="settings" :settings="settings" :categories="categories" :pages="pages" />
    <CartDrawer :free-shipping-threshold="settings?.freeShippingThreshold ?? 0" />
    <WhatsAppButton v-if="settings" :number="settings.whatsappNumber" :store-name="storeName" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
}

.layout__alert {
  padding-top: 16px;
}

.skip-link {
  position: absolute;
  top: -48px;
  left: 16px;
  z-index: 200;
  padding: 10px 16px;
  font-weight: 600;
  color: var(--color-text-inverse);
  background-color: var(--color-ink);
  border-radius: var(--radius-sm);
}

.skip-link:focus {
  top: 12px;
}
</style>
