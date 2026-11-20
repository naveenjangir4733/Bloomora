<script setup lang="ts">
import AppQuantityStepper from '@/components/common/AppQuantityStepper.vue';
import { MAX_LINE_QUANTITY } from '@/composables/useCart';
import type { CartItem } from '@/types/cart.types';
import { formatPrice } from '@/utils/format';

const props = defineProps<{ item: CartItem }>();

const emit = defineEmits<{
  updateQuantity: [key: string, quantity: number];
  remove: [key: string];
}>();

const quantity = computed<number>({
  get: (): number => props.item.quantity,
  set: (value: number): void => emit('updateQuantity', props.item.key, value),
});
</script>

<template>
  <li class="line-item">
    <NuxtLink :to="`/products/${item.slug}`" class="line-item__media">
      <img :src="item.imageUrl" :alt="item.name" width="72" height="72">
    </NuxtLink>
    <div class="line-item__body">
      <div class="line-item__top">
        <NuxtLink :to="`/products/${item.slug}`" class="line-item__name">{{ item.name }}</NuxtLink>
        <button type="button" class="line-item__remove" :aria-label="`Remove ${item.name}`" @click="emit('remove', item.key)">
          ✕
        </button>
      </div>
      <p v-if="item.variantName" class="line-item__variant">Size: {{ item.variantName }}</p>
      <div class="line-item__bottom">
        <AppQuantityStepper v-model="quantity" :max="MAX_LINE_QUANTITY" :label="`Quantity of ${item.name}`" />
        <span class="line-item__price">{{ formatPrice(item.unitPrice * item.quantity) }}</span>
      </div>
    </div>
  </li>
</template>

<style scoped>
.line-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.line-item__media img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.line-item__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
}

.line-item__top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.line-item__name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.line-item__name:hover {
  color: var(--color-primary);
}

.line-item__remove {
  width: 28px;
  height: 28px;
  font-size: 0.75rem;
  color: var(--color-text-subtle);
  border-radius: 50%;
}

.line-item__remove:hover {
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
}

.line-item__variant {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.line-item__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.line-item__price {
  font-weight: 700;
}
</style>
