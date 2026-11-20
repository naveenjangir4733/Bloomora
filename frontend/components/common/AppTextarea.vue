<script setup lang="ts">
import AppFormField from '@/components/common/AppFormField.vue';

withDefaults(
  defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    rows?: number;
    maxlength?: number;
    error?: string;
    hint?: string;
    required?: boolean;
  }>(),
  { placeholder: undefined, rows: 4, maxlength: 2000, error: undefined, hint: undefined, required: false },
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <AppFormField :id="id" :label="label" :error="error" :hint="hint" :required="required">
    <template #default="{ describedBy }">
      <textarea
        :id="id"
        v-model="model"
        class="form-control app-textarea"
        :name="id"
        :rows="rows"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :required="required"
        :aria-invalid="Boolean(error)"
        :aria-describedby="describedBy"
      />
    </template>
  </AppFormField>
</template>

<style scoped>
.app-textarea {
  resize: vertical;
  min-height: 96px;
}
</style>
