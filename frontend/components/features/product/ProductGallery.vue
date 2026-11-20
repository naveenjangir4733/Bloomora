<script setup lang="ts">
const props = defineProps<{ images: string[]; alt: string }>();

const activeIndex = ref<number>(0);
const activeImage = computed<string>((): string => props.images[activeIndex.value] ?? props.images[0] ?? '');
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <img :src="activeImage" :alt="alt" class="gallery__image" width="800" height="800">
    </div>
    <ul v-if="images.length > 1" class="gallery__thumbs">
      <li v-for="(image, index) in images" :key="image">
        <button
          type="button"
          :class="['gallery__thumb', { 'is-active': index === activeIndex }]"
          :aria-label="`Show image ${index + 1} of ${images.length}`"
          :aria-pressed="index === activeIndex"
          @click="activeIndex = index"
        >
          <img :src="image" alt="" loading="lazy" width="96" height="96">
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.gallery__main {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: var(--color-surface-muted);
  border-radius: var(--radius-lg);
}

.gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  list-style: none;
}

.gallery__thumb {
  width: 76px;
  height: 76px;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  opacity: 0.7;
  transition: opacity 0.2s var(--ease), border-color 0.2s var(--ease);
}

.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__thumb:hover,
.gallery__thumb.is-active {
  opacity: 1;
  border-color: var(--color-primary);
}
</style>
