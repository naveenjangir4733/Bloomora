<script setup lang="ts">
withDefaults(
  defineProps<{ eyebrow?: string; title: string; subtitle?: string; align?: 'center' | 'left'; as?: 'h1' | 'h2' }>(),
  { eyebrow: undefined, subtitle: undefined, align: 'center', as: 'h2' },
);
</script>

<template>
  <header :class="['section-heading', `section-heading--${align}`]">
    <p v-if="eyebrow" class="section-heading__eyebrow">{{ eyebrow }}</p>
    <component :is="as" class="section-heading__title font-serif">{{ title }}</component>
    <p v-if="subtitle" class="section-heading__subtitle">{{ subtitle }}</p>
    <slot />
  </header>
</template>

<style scoped>
.section-heading {
  margin-bottom: 40px;
}

.section-heading--center {
  text-align: center;
}

.section-heading--center .section-heading__subtitle {
  margin-left: auto;
  margin-right: auto;
}

.section-heading__eyebrow {
  margin-bottom: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.section-heading__title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  letter-spacing: -0.01em;
}

.section-heading__subtitle {
  max-width: 600px;
  margin-top: 12px;
  color: var(--color-text-muted);
  font-size: 1.0625rem;
}
</style>
