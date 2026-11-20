<script setup lang="ts">
import type { ProductDetail } from '@/types/catalog.types';

defineProps<{ product: ProductDetail }>();
</script>

<template>
  <div class="product-details">
    <section>
      <h2 class="product-details__heading">About this piece</h2>
      <p>{{ product.description }}</p>
    </section>

    <dl class="product-details__specs">
      <div v-if="product.materials.length > 0">
        <dt>Materials</dt>
        <dd>{{ product.materials.join(', ') }}</dd>
      </div>
      <div v-if="product.dimensions">
        <dt>Size</dt>
        <dd>{{ product.dimensions }}</dd>
      </div>
      <div v-if="product.careInstructions">
        <dt>Care</dt>
        <dd>{{ product.careInstructions }}</dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.product-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.product-details__heading {
  margin-bottom: 8px;
  font-size: 1rem;
  color: var(--color-text);
}

.product-details__specs {
  display: grid;
  gap: 12px;
}

.product-details__specs div {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  font-size: 0.9375rem;
}

.product-details__specs dt {
  font-weight: 700;
  color: var(--color-text);
}
</style>
