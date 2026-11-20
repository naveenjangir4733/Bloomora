<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import CartLineItem from '@/components/features/cart/CartLineItem.vue';
import FreeShippingMeter from '@/components/features/cart/FreeShippingMeter.vue';
import { formatPrice, pluralize } from '@/utils/format';

defineProps<{ freeShippingThreshold: number }>();

const { items, isDrawerOpen, subtotal, totalCount, setQuantity, removeItem, closeDrawer } = useCart();

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeDrawer();
  }
};

onMounted((): void => window.addEventListener('keydown', onKeydown));
onBeforeUnmount((): void => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div>
    <Transition name="fade">
      <div v-if="isDrawerOpen" class="drawer-backdrop" aria-hidden="true" @click="closeDrawer" />
    </Transition>

    <aside
      :class="['drawer', { 'is-open': isDrawerOpen }]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      :aria-hidden="!isDrawerOpen"
      :inert="!isDrawerOpen"
    >
      <header class="drawer__header">
        <h2 id="cart-title" class="drawer__title font-serif">
          Your cart <span class="drawer__count">({{ pluralize(totalCount, 'item') }})</span>
        </h2>
        <button type="button" class="drawer__close" aria-label="Close cart" @click="closeDrawer">✕</button>
      </header>

      <div v-if="items.length === 0" class="drawer__empty">
        <span aria-hidden="true">💐</span>
        <h3>Your cart is empty</h3>
        <p>Find something handmade to love.</p>
        <AppButton to="/shop" variant="soft" @click="closeDrawer">Browse the shop</AppButton>
      </div>

      <template v-else>
        <div class="drawer__meter">
          <FreeShippingMeter :subtotal="subtotal" :threshold="freeShippingThreshold" />
        </div>
        <ul class="drawer__items">
          <CartLineItem
            v-for="item in items"
            :key="item.key"
            :item="item"
            @update-quantity="setQuantity"
            @remove="removeItem"
          />
        </ul>
        <footer class="drawer__footer">
          <div class="drawer__subtotal">
            <span>Subtotal</span>
            <strong>{{ formatPrice(subtotal) }}</strong>
          </div>
          <p class="drawer__note">Delivery is calculated at checkout. Advance payment only.</p>
          <AppButton to="/checkout" size="lg" block @click="closeDrawer">Checkout</AppButton>
        </footer>
      </template>
    </aside>
  </div>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background-color: rgba(43, 29, 34, 0.45);
  backdrop-filter: blur(3px);
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  background-color: var(--color-bg);
  box-shadow: var(--shadow-lg);
  transform: translateX(100%);
  transition: transform 0.35s var(--ease);
}

.drawer.is-open {
  transform: translateX(0);
}

.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.drawer__title {
  font-size: 1.375rem;
}

.drawer__count {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.drawer__close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.drawer__close:hover {
  background-color: var(--color-surface-muted);
}

.drawer__meter {
  padding: 14px 24px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.drawer__items {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  list-style: none;
}

.drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  padding: 32px;
  text-align: center;
}

.drawer__empty span {
  font-size: 3rem;
}

.drawer__empty p {
  margin-bottom: 12px;
  color: var(--color-text-muted);
}

.drawer__footer {
  padding: 20px 24px;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.drawer__subtotal {
  display: flex;
  justify-content: space-between;
  font-size: 1.0625rem;
}

.drawer__note {
  margin: 4px 0 16px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s var(--ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
