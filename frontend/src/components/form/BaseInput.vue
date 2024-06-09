<script lang="ts" setup>
defineProps<{
  label: string;
  modelValue: string;
}>();
</script>
<template>
  <div class="flex flex-col gap-1">
    <label class="font-semibold">{{ label }}</label>
    <input
      class="border border-gray-400 rounded p-2 outline-2 outline-red-400"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="(event: Event) => $emit('update:modelValue', (event.target as HTMLInputElement).value)"
    />
  </div>
</template>
