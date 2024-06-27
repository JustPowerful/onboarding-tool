<script setup lang="ts">
import { XIcon } from "lucide-vue-next";

const props = defineProps<{
  show: boolean;
  width?: number;
  height?: number;
}>();
</script>
<template>
  <div
    v-if="props.show"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      :class="`font-medium text-base relative bg-white rounded-md w-full m-6 p-4 max-w-[${
        width ? width + 'px' : '700px'
      }] ${width ? width : ''}`"
    >
      <button
        class="absolute top-3 right-3 hover:bg-zinc-300 p-1 rounded-md text-red-500"
      >
        <XIcon @click="$emit('close')" />
      </button>
      <slot />
    </div>
  </div>
</template>
