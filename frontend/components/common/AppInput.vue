<script setup lang="ts">
import AppFormField from '@/components/common/AppFormField.vue';

withDefaults(
  defineProps<{
    id: string;
    label: string;
    type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'search';
    placeholder?: string;
    autocomplete?: string;
    inputmode?: 'text' | 'tel' | 'email' | 'numeric' | 'search';
    error?: string;
    hint?: string;
    required?: boolean;
    min?: string;
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    autocomplete: undefined,
    inputmode: undefined,
    error: undefined,
    hint: undefined,
    required: false,
    min: undefined,
  },
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <AppFormField :id="id" :label="label" :error="error" :hint="hint" :required="required">
    <template #default="{ describedBy }">
      <input
        :id="id"
        v-model="model"
        class="form-control"
        :type="type"
        :name="id"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :required="required"
        :min="min"
        :aria-invalid="Boolean(error)"
        :aria-describedby="describedBy"
      >
    </template>
  </AppFormField>
</template>
