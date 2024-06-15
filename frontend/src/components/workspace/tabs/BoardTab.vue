<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";

import { PlusIcon, X } from "lucide-vue-next";
import draggable from "vuedraggable";
import Checklist from "../Checklist.vue";
import { AxiosPrivate } from "@/api";
import type { ChecklistData } from "@/types";
import BaseInput from "@/components/form/BaseInput.vue";

const checklists = ref<ChecklistData[]>([]);

const toggleCreate = ref(false);
const checklistName = ref("");
const createLoading = ref(false);

const props = defineProps<{
  workspaceId: number;
}>();

// this is for disabling dragging when accessing the checklist menu (edit, delete) and more
const disabledDraggable = ref(false);
function disableDragging() {
  disabledDraggable.value = true;
}
function enableDragging() {
  disabledDraggable.value = false;
}

async function fetchChecklists() {
  try {
    const { data } = await AxiosPrivate.get(
      `/checklist/getall/${props.workspaceId}`
    );
    checklists.value = data.checklists;
  } catch (error) {
    console.error(error);
  }
}

async function saveOrder() {
  try {
    const { data } = await AxiosPrivate.patch("/checklist/updateorder", {
      checklists: checklists.value,
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

async function createChecklist() {
  try {
    createLoading.value = true;
    const { data } = await AxiosPrivate.post("/checklist/create", {
      name: checklistName.value,
      workspaceId: props.workspaceId,
    });
    checklists.value.push(data.checklist);
    toggleCreate.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    createLoading.value = false;
  }
}

onMounted(async () => {
  await fetchChecklists();
});
</script>

<template>
  <div
    v-if="toggleCreate"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center"
  >
    <div
      class="relative bg-white p-4 rounded-md w-full max-w-[300px] flex flex-col gap-4"
    >
      <button class="absolute top-3 right-3 text-red-500">
        <X :size="20" @click="toggleCreate = !toggleCreate" />
      </button>
      <BaseInput
        label="Checklist name"
        :value="checklistName"
        v-model="checklistName"
        placeholder="checklist name"
      />
      <button
        @click="createChecklist"
        class="bg-red-500 text-white p-2 rounded-md"
      >
        <span v-if="!createLoading">Create</span>
        <span v-else>
          <v-progress-circular
            indeterminate
            size="24"
            color="white"
          ></v-progress-circular>
        </span>
      </button>
    </div>
  </div>
  <div class="absolute top-0 left-0 w-full h-full bg-white p-10">
    <!-- create checklist button -->
    <div class="absolute top-4 right-4 z-40">
      <button
        @click="toggleCreate = !toggleCreate"
        class="bg-red-500 text-white p-2 rounded-md flex items-center"
      >
        <span>New list</span>
        <PlusIcon :size="20" />
      </button>
    </div>
    <draggable
      :disabled="disabledDraggable"
      class="flex gap-4 overflow-x-scroll h-full"
      v-if="checklists.length > 0"
      v-model="checklists"
      tag="Checklist"
      item-key="id"
      @start="console.log('start')"
      @end="saveOrder"
      ghost-class="drag-checklist"
    >
      <template #item="{ element: checklist }">
        <Checklist
          :updateorder="saveOrder"
          :enable-dragging="enableDragging"
          :disable-dragging="disableDragging"
          :fetch-checklists="fetchChecklists"
          v-if="checklists.length > 0"
          :checklist="checklist"
        />
      </template>
    </draggable>
    <!-- end of create checklist button -->
    <!-- <draggable :v-model="MyArray" item-key="id">
      <div>test</div>
    </draggable> -->
  </div>
</template>
<style scoped></style>
