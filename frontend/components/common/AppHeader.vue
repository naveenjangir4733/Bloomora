<script setup lang="ts">
import type { Category } from '@/types/catalog.types';
import type { NavLink } from '@/types/ui.types';

const props = defineProps<{
  storeName: string;
  categories: Category[];
  cartCount: number;
}>();

const emit = defineEmits<{
  openCart: [];
}>();

const NAV_LINKS: NavLink[] = [
  { label: 'Custom Orders', to: '/custom-orders' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const isMenuOpen = ref<boolean>(false);
const route = useRoute();

watch(
  (): string => route.fullPath,
  (): void => {
    isMenuOpen.value = false;
  },
);

const cartLabel = computed<string>((): string => `Open cart, ${props.cartCount} items`);
</script>

<template>
  <header class="site-header">
    <div class="container site-header__bar">
      <button
        type="button"
        class="site-header__menu-toggle"
        :aria-expanded="isMenuOpen"
        aria-controls="site-nav"
        aria-label="Toggle menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span aria-hidden="true">{{ isMenuOpen ? '✕' : '☰' }}</span>
      </button>

      <NuxtLink to="/" class="site-header__logo font-serif">
        <span aria-hidden="true">🌸</span>
        <span>{{ storeName }}</span>
        <small class="site-header__logo-sub">Handmade Studio</small>
      </NuxtLink>

      <nav id="site-nav" :class="['site-nav', { 'is-open': isMenuOpen }]" aria-label="Main">
        <ul class="site-nav__list">
          <li class="site-nav__item site-nav__item--dropdown">
            <NuxtLink to="/shop" class="site-nav__link">Shop <span aria-hidden="true">▾</span></NuxtLink>
            <ul class="site-nav__dropdown">
              <li>
                <NuxtLink to="/shop" class="site-nav__dropdown-link">All products</NuxtLink>
              </li>
              <li v-for="category in categories" :key="category.id">
                <NuxtLink :to="`/collections/${category.slug}`" class="site-nav__dropdown-link">
                  {{ category.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li v-for="link in NAV_LINKS" :key="link.to" class="site-nav__item">
            <NuxtLink :to="link.to" class="site-nav__link">{{ link.label }}</NuxtLink>
          </li>
          <li class="site-nav__item">
            <NuxtLink to="/track-order" class="site-nav__link">Track Order</NuxtLink>
          </li>
        </ul>
      </nav>

      <button type="button" class="site-header__cart" :aria-label="cartLabel" @click="emit('openCart')">
        <span aria-hidden="true">🛍️</span>
        <span class="site-header__cart-label">Cart</span>
        <span class="site-header__cart-count" aria-hidden="true">{{ cartCount }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(253, 248, 245, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.site-header__bar {
  display: flex;
  align-items: center;
  gap: 24px;
  height: var(--header-height);
}

.site-header__menu-toggle {
  display: none;
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
}

.site-header__logo {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 700;
}

.site-header__logo-sub {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.site-nav {
  margin-left: auto;
}

.site-nav__list {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
}

.site-nav__item {
  position: relative;
}

.site-nav__link {
  display: block;
  padding: 8px 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  transition: color 0.2s var(--ease), background-color 0.2s var(--ease);
}

.site-nav__link:hover,
.site-nav__link.router-link-active {
  color: var(--color-primary);
}

.site-nav__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  padding: 8px;
  list-style: none;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: opacity 0.2s var(--ease), transform 0.2s var(--ease), visibility 0.2s;
}

.site-nav__item--dropdown:hover .site-nav__dropdown,
.site-nav__item--dropdown:focus-within .site-nav__dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.site-nav__dropdown-link {
  display: block;
  padding: 8px 12px;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
}

.site-nav__dropdown-link:hover {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.site-header__cart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
}

.site-header__cart:hover {
  border-color: var(--color-primary);
}

.site-header__cart-count {
  min-width: 22px;
  padding: 1px 6px;
  font-size: 0.75rem;
  text-align: center;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
}

@media (max-width: 960px) {
  .site-header__menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .site-header__logo-sub,
  .site-header__cart-label {
    display: none;
  }

  .site-header__cart {
    margin-left: auto;
  }

  .site-nav {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    max-height: calc(100vh - var(--header-height));
    overflow-y: auto;
    padding: 12px var(--gutter) 24px;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-md);
    display: none;
  }

  .site-nav.is-open {
    display: block;
  }

  .site-nav__list {
    flex-direction: column;
    align-items: stretch;
  }

  .site-nav__dropdown {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    padding: 0 0 0 12px;
    background: none;
  }
}
</style>
