<script setup lang="ts">
import AppSectionHeading from '@/components/common/AppSectionHeading.vue';
import ContentSections from '@/components/features/content/ContentSections.vue';
import { formatDate } from '@/utils/format';
import { notFound, readRouteParam } from '@/utils/route-params';

/** Renders CMS-style pages (about, shipping, policies) stored in the database. */
const route = useRoute();
const slug = readRouteParam(route.params, 'slug');
const { data: page } = await useContentPage(slug);

if (!page.value) {
  throw notFound('Page not found');
}

useSeoMeta({
  title: (): string => page.value?.title ?? '',
  description: (): string | undefined => page.value?.summary,
});
</script>

<template>
  <section v-if="page" class="section">
    <div class="container content-page">
      <AppSectionHeading as="h1" :title="page.title" :subtitle="page.summary" align="left" />
      <ContentSections :sections="page.sections" />
      <p class="content-page__updated">Last updated {{ formatDate(page.updatedAt) }}</p>
    </div>
  </section>
</template>

<style scoped>
.content-page {
  max-width: 780px;
}

.content-page__updated {
  margin-top: 40px;
  font-size: 0.8125rem;
  color: var(--color-text-subtle);
}
</style>
