<script setup lang="ts">
import type { ContentSection } from '@/types/store.types';

defineProps<{ sections: ContentSection[] }>();
</script>

<template>
  <div class="content-sections">
    <section v-for="section in sections" :key="section.heading" class="content-section">
      <h2 class="content-section__heading font-serif">{{ section.heading }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph" class="content-section__paragraph">{{ paragraph }}</p>
    </section>
  </div>
</template>

<style scoped>
.content-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content-section__heading {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.content-section__paragraph {
  color: var(--color-text-muted);
  font-size: 1.0625rem;
}

.content-section__paragraph + .content-section__paragraph {
  margin-top: 10px;
}
</style>
