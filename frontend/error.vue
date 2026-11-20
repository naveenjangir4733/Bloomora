<script setup lang="ts">
import type { NuxtError } from '#app';
import AppButton from '@/components/common/AppButton.vue';

const props = defineProps<{ error: NuxtError }>();

const NOT_FOUND = 404;
const isNotFound = computed<boolean>((): boolean => props.error.statusCode === NOT_FOUND);

useSeoMeta({ title: (): string => (isNotFound.value ? 'Page not found' : 'Something went wrong') });

const goHome = (): Promise<void> => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="container error-page">
        <p class="error-page__code font-serif">{{ error.statusCode }}</p>
        <h1 class="error-page__title font-serif">
          {{ isNotFound ? "This bloom wandered off" : 'Something went wrong' }}
        </h1>
        <p class="error-page__text">
          {{ isNotFound ? "We couldn't find the page you were looking for." : 'Please try again in a moment.' }}
        </p>
        <div class="error-page__actions">
          <AppButton @click="goHome">Back to home</AppButton>
          <AppButton to="/shop" variant="outline">Browse the shop</AppButton>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  max-width: 560px;
  text-align: center;
}

.error-page__code {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary-border);
}

.error-page__title {
  margin-top: 12px;
  font-size: 2rem;
}

.error-page__text {
  margin-top: 8px;
  color: var(--color-text-muted);
}

.error-page__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
</style>
