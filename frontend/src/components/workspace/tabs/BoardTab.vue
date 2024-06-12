<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";

import { PlusIcon } from "lucide-vue-next";
import draggable from "vuedraggable";
import Checklist from "../Checklist.vue";
import { AxiosPrivate } from "@/api";
import type { ChecklistData } from "@/types";

const checklists = ref<ChecklistData[]>([]);

const props = defineProps<{
  workspaceId: number;
}>();

async function fetchChecklists() {
  try {
    const { data } = await AxiosPrivate.get(
      `/checklist/getall/${props.workspaceId}`
    );
    checklists.value = data.checklists;
    // workspace.value = data.workspace;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await fetchChecklists();
});
</script>
<template>
  <div class="absolute top-0 left-0 w-full h-full bg-white p-10">
    <!-- create checklist button -->
    <div class="absolute top-4 right-4">
      <button class="bg-red-500 text-white p-2 rounded-md flex items-center">
        <span>New list</span>
        <PlusIcon :size="20" />
      </button>
    </div>
    <draggable
      class="flex gap-4"
      v-if="checklists.length > 0"
      v-model="checklists"
      tag="Checklist"
      item-key="id"
      @start="console.log('start')"
      @end="console.log(checklists)"
    >
      <template #item="{ element: checklist }">
        <Checklist v-if="checklists.length > 0" :checklist="checklist" />
      </template>
    </draggable>
    <!-- end of create checklist button -->
    <!-- <draggable :v-model="MyArray" item-key="id">
      <div>test</div>
    </draggable> -->
  </div>
</template>
