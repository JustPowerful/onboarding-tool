<script setup lang="ts">
import type { TaskData } from "@/types";
import { ListChecks, X } from "lucide-vue-next";
import { ref, defineProps } from "vue";
const toggle = ref(false);
const props = defineProps<{
  task: TaskData;
}>();
</script>
<template>
  <button
    @click="toggle = !toggle"
    class="bg-zinc-300 hover:bg-zinc-400 w-full p-1 rounded-md text-slate-700 flex items-center justify-center gap-1"
  >
    <CheckCheck :size="18" />
    Proposed Solutions
  </button>
  <!-- Toggled window background -->
  <div
    v-if="toggle"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center"
  >
    <!-- The window itself ✨ -->
    <div class="relative w-full max-w-[400px] bg-white px-2 py-4 rounded-md">
      <button
        @click="toggle = false"
        class="absolute top-2 right-2 text-red-500 p-2 rounded-full hover:bg-zinc-400"
      >
        <X :size="20" />
      </button>
      Redirecting you to the solution proposition page, proceed?
      <div class="grid grid-cols-2 gap-2 mt-2">
        <RouterLink
          :to="`/proposals/${task.id}`"
          class="text-white bg-red-500 p-2 rounded-md block text-center w-full"
        >
          Sure
        </RouterLink>
        <button class="bg-zinc-700 p-2 text-white rounded-md">Cancel</button>
      </div>
    </div>
  </div>
</template>
