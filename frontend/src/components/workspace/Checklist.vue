<script setup lang="ts">
import type { ChecklistData } from "@/types";
import draggable from "vuedraggable";
import { Ellipsis } from "lucide-vue-next";
import { defineProps, onMounted } from "vue";
const props = defineProps<{
  checklist: ChecklistData;
}>();

onMounted(() => {});
</script>
<template>
  <div
    class="bg-white border-2 w-[250px] p-2 border-zinc-200 rounded-md min-h-80 grid grid-rows-[1fr_9fr] gap-3"
  >
    <div class="flex justify-between items-center">
      <div>
        {{ props.checklist.name }}
      </div>
      <button class="text-zinc-400">
        <Ellipsis :size="24" />
      </button>
    </div>
    <div class="bg-zinc-100 rounded-md">
      <draggable
        v-if="props.checklist.tasks.length > 0"
        v-model="props.checklist.tasks"
        :group="{ name: 'tasks' }"
        item-key="id"
        tag="div"
        @end="console.log(checklist)"
      >
        <template #item="{ element: task }">
          <div class="p-2 border-b-2 border-zinc-200">{{ task.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>
