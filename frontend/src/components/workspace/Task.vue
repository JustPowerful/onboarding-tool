<script setup lang="ts">
import type { TaskData } from "@/types";
import { Ellipsis } from "lucide-vue-next";
import { defineProps } from "vue";

const props = defineProps<{
  task: TaskData;
}>();
</script>
<template>
  <div
    class="bg-white p-2 border-2 border-zinc-200 rounded-md flex justify-between"
  >
    <div>{{ props.task.name }}</div>
    <div class="text-zinc-500">
      <Ellipsis :size="21" />
    </div>
  </div>
</template>
