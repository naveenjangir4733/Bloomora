<script setup lang="ts">
/** Infinite marquee of store announcements. The list is duplicated so the loop is seamless. */
defineProps<{ messages: string[] }>();
</script>

<template>
  <div v-if="messages.length > 0" class="announcement" role="region" aria-label="Store announcements">
    <div class="announcement__track">
      <ul v-for="copy in 2" :key="copy" class="announcement__list" :aria-hidden="copy === 2">
        <li v-for="message in messages" :key="message" class="announcement__item">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.announcement {
  overflow: hidden;
  background-color: var(--color-ink);
  color: var(--color-text-inverse);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.announcement__track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}

.announcement:hover .announcement__track {
  animation-play-state: paused;
}

.announcement__list {
  display: flex;
  list-style: none;
}

.announcement__item {
  padding: 9px 0;
  white-space: nowrap;
}

.announcement__item::after {
  content: '✦';
  margin: 0 28px;
  color: var(--color-primary-border);
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .announcement__track {
    animation: none;
  }
}
</style>
